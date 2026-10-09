import db from "../config/database";
import bcrypt from 'bcrypt';
import { UserResponse, CreateUserDTO } from "../model/usersModel";

export class UserService {

    private async resolveDepartmentId(department?: string, departmentId?: number): Promise<number | null> {
        if (departmentId) return departmentId;
        if (!department) return null;

        const [existing]: any = await db.query(
            'SELECT id_department FROM Department WHERE name_department = ?',
            [department]
        );
        if (existing.length > 0) return existing[0].id_department;

        const [created]: any = await db.query(
            'INSERT INTO Department (name_department) VALUES (?)',
            [department]
        );
        return created.insertId;
    }

    private validateUser(user: CreateUserDTO): void {
        const { email, passwords } = user;

        if (!email || !passwords) {
            throw new Error("El correo y la contraseña son obligatorios.");
        }

        const domains = ["@gmail.com", "@kinal.edu.gt", "@outlook.com", "@yahoo.com"];
        const validDomain = domains.some(domain => email.toLowerCase().endsWith(domain));

        if (!validDomain) {
            throw new Error("El correo debe pertenecer a un dominio válido: @gmail.com, @kinal.edu.gt, @outlook.com, @yahoo.com");
        }
    }

    private resolveName(data: any): { first: string; last: string } {
        return {
            first: data.first_name ?? data.name_whistleblowers ?? data.name_managers ?? data.name_administrators ?? '',
            last: data.last_name ?? data.last_name_whistleblowers ?? data.last_name_managers ?? data.last_name_administrators ?? ''
        };
    }

    async listUser(): Promise<UserResponse[]> {
        const query = `
            SELECT 
                u.id_users,
                u.email,
                u.roles_id,
                r.name_roles AS role_name,
                COALESCE(w.name_whistleblowers, m.name_managers, a.name_administrators) AS first_name,
                COALESCE(w.last_name_whistleblowers, m.last_name_managers, a.last_name_administrators) AS last_name,
                COALESCE(w.phone_number_whistleblowers, m.phone_number_managers) AS phone_number,
                COALESCE(w.dpi_whistleblowers, m.dpi_managers, a.dpi_administrators) AS dpi,
                COALESCE(w.department_id, m.department_id, a.department_id) AS department_id,
                d.name_department AS department,
                w.gender,
                COALESCE(m.State, a.State) AS State
            FROM Users u
            LEFT JOIN Roles r ON u.roles_id = r.id_roles
            LEFT JOIN Whistleblowers w ON u.id_users = w.users_id
            LEFT JOIN Managers m ON u.id_users = m.users_id
            LEFT JOIN Administrators a ON u.id_users = a.users_id
            LEFT JOIN Department d ON d.id_department = COALESCE(w.department_id, m.department_id, a.department_id)
        `;
        const [rows] = await db.query(query);
        return rows as UserResponse[];
    }

    async registerWhistleblower(data: CreateUserDTO): Promise<void> {
        this.validateUser(data);
        await this.createUser(data, 'Denunciante');
    }

    async registerManager(data: CreateUserDTO): Promise<void> {
        this.validateUser(data);
        await this.createUser(data, 'Encargado');
    }

    async registerAdmin(data: CreateUserDTO): Promise<void> {
        this.validateUser(data);
        await this.createUser(data, 'Administrador');
    }

    private async createUser(user: CreateUserDTO, roleName: string): Promise<void> {
        const [existingUsers]: any = await db.query('SELECT id_users FROM Users WHERE email = ?', [user.email]);
        if (existingUsers.length > 0) {
            throw new Error("Ya existe un usuario con ese correo electrónico.");
        }

        const [roles]: any = await db.query('SELECT id_roles FROM Roles WHERE name_roles = ?', [roleName]);
        if (roles.length === 0) {
            throw new Error(`Rol ${roleName} no configurado.`);
        }
        const roleId = roles[0].id_roles;

        const { first, last } = this.resolveName(user);
        const hashedPassword = await bcrypt.hash(user.passwords, 10);
        const departmentId = await this.resolveDepartmentId(user.department, user.department_id);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [userResult]: any = await connection.query(
                'INSERT INTO Users (email, passwords, roles_id) VALUES (?, ?, ?)',
                [user.email, hashedPassword, roleId]
            );

            const newUserId = userResult.insertId;

            if (roleName === 'Denunciante') {
                await connection.query(
                    `INSERT INTO Whistleblowers 
                    (name_whistleblowers, last_name_whistleblowers, phone_number_whistleblowers, dpi_whistleblowers, gender, department_id, users_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [first, last, user.phone_number || null, user.dpi || null, user.gender || null, departmentId, newUserId]
                );
            } else if (roleName === 'Encargado') {
                await connection.query(
                    `INSERT INTO Managers 
                    (name_managers, last_name_managers, phone_number_managers, dpi_managers, State, department_id, users_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [first, last, user.phone_number || '', user.dpi || '', user.State || 'Activo', departmentId, newUserId]
                );
            } else if (roleName === 'Administrador') {
                await connection.query(
                    `INSERT INTO Administrators 
                    (name_administrators, last_name_administrators, dpi_administrators, State, department_id, users_id)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [first, last, user.dpi || '', user.State || 'Activo', departmentId, newUserId]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async deleteUser(id: number): Promise<void> {
        const [users]: any = await db.query('SELECT id_users FROM Users WHERE id_users = ?', [id]);
        if (users.length === 0) {
            throw new Error("El usuario no fue encontrado.");
        }

        const [binnacles]: any = await db.query('SELECT id_binnacle FROM Binnacle WHERE users_id = ?', [id]);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            for (const binnacle of binnacles) {
                await connection.query('DELETE FROM Evidence WHERE binnacle_id = ?', [binnacle.id_binnacle]);
                await connection.query('DELETE FROM Aggressors WHERE binnacle_id = ?', [binnacle.id_binnacle]);
            }
            await connection.query('DELETE FROM Binnacle WHERE users_id = ?', [id]);

            await connection.query(
                'UPDATE Binnacle SET managers_id = NULL WHERE managers_id IN (SELECT id_managers FROM Managers WHERE users_id = ?)',
                [id]
            );

            await connection.query('DELETE FROM Whistleblowers WHERE users_id = ?', [id]);
            await connection.query('DELETE FROM Managers WHERE users_id = ?', [id]);
            await connection.query('DELETE FROM Administrators WHERE users_id = ?', [id]);
            await connection.query('DELETE FROM Users WHERE id_users = ?', [id]);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateUser(id: number, data: CreateUserDTO): Promise<void> {
        this.validateUser(data);

        const [users]: any = await db.query(
            'SELECT r.name_roles AS role_name FROM Users u JOIN Roles r ON u.roles_id = r.id_roles WHERE u.id_users = ?',
            [id]
        );
        if (users.length === 0) {
            throw new Error("El usuario no fue encontrado.");
        }

        const roleName = users[0].role_name;
        const { first, last } = this.resolveName(data);
        const hashedPassword = await bcrypt.hash(data.passwords, 10);
        const departmentId = await this.resolveDepartmentId(data.department, data.department_id);
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            await connection.query(
                'UPDATE Users SET email = ?, passwords = ? WHERE id_users = ?',
                [data.email, hashedPassword, id]
            );

            if (roleName === 'Denunciante') {
                await connection.query(
                    `UPDATE Whistleblowers SET name_whistleblowers = ?, last_name_whistleblowers = ?, phone_number_whistleblowers = ?, dpi_whistleblowers = ?, gender = ?, department_id = ? WHERE users_id = ?`,
                    [first, last, data.phone_number || null, data.dpi || null, data.gender || null, departmentId, id]
                );
            } else if (roleName === 'Encargado') {
                await connection.query(
                    `UPDATE Managers SET name_managers = ?, last_name_managers = ?, phone_number_managers = ?, dpi_managers = ?, State = ?, department_id = ? WHERE users_id = ?`,
                    [first, last, data.phone_number || '', data.dpi || '', data.State || 'Activo', departmentId, id]
                );
            } else if (roleName === 'Administrador') {
                await connection.query(
                    `UPDATE Administrators SET name_administrators = ?, last_name_administrators = ?, dpi_administrators = ?, State = ?, department_id = ? WHERE users_id = ?`,
                    [first, last, data.dpi || '', data.State || 'Activo', departmentId, id]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getUserProfile(id: number): Promise<UserResponse> {
        const query = `
            SELECT 
                u.id_users,
                u.email,
                u.roles_id,
                r.name_roles AS role_name,
                COALESCE(w.name_whistleblowers, m.name_managers, a.name_administrators) AS first_name,
                COALESCE(w.last_name_whistleblowers, m.last_name_managers, a.last_name_administrators) AS last_name,
                COALESCE(w.phone_number_whistleblowers, m.phone_number_managers) AS phone_number,
                COALESCE(w.dpi_whistleblowers, m.dpi_managers, a.dpi_administrators) AS dpi,
                COALESCE(w.department_id, m.department_id, a.department_id) AS department_id,
                d.name_department AS department,
                w.gender,
                COALESCE(m.State, a.State) AS State
            FROM Users u
            LEFT JOIN Roles r ON u.roles_id = r.id_roles
            LEFT JOIN Whistleblowers w ON u.id_users = w.users_id
            LEFT JOIN Managers m ON u.id_users = m.users_id
            LEFT JOIN Administrators a ON u.id_users = a.users_id
            LEFT JOIN Department d ON d.id_department = COALESCE(w.department_id, m.department_id, a.department_id)
            WHERE u.id_users = ?;
        `;
        const [rows]: any = await db.query(query, [id]);
        if (rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }
        return rows[0] as UserResponse;
    }

    async updateProfile(id: number, data: any): Promise<void> {
        const [users]: any = await db.query(
            'SELECT r.name_roles AS role_name FROM Users u JOIN Roles r ON u.roles_id = r.id_roles WHERE u.id_users = ?',
            [id]
        );
        if (users.length === 0) {
            throw new Error("El usuario no fue encontrado.");
        }

        const roleName = users[0].role_name;
        const { first, last } = this.resolveName(data);
        const departmentId = await this.resolveDepartmentId(data.department, data.department_id);
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            if (data.email) {
                await connection.query(
                    'UPDATE Users SET email = ? WHERE id_users = ?',
                    [data.email, id]
                );
            }

            if (roleName === 'Denunciante') {
                await connection.query(
                    `UPDATE Whistleblowers SET name_whistleblowers = ?, last_name_whistleblowers = ?, phone_number_whistleblowers = ?, department_id = ?, gender = ? WHERE users_id = ?`,
                    [first, last, data.phone ?? data.phone_number ?? null, departmentId, data.gender || null, id]
                );
            } else if (roleName === 'Encargado') {
                await connection.query(
                    `UPDATE Managers SET name_managers = ?, last_name_managers = ?, phone_number_managers = ?, department_id = ? WHERE users_id = ?`,
                    [first, last, data.phone ?? data.phone_number ?? '', departmentId, id]
                );
            } else if (roleName === 'Administrador') {
                await connection.query(
                    `UPDATE Administrators SET name_administrators = ?, last_name_administrators = ?, department_id = ? WHERE users_id = ?`,
                    [first, last, departmentId, id]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async WhistleblowerForAgent(whistleblowerId: number) {
        const query = `
            SELECT 
                u.id_users,
                w.name_whistleblowers AS first_name,
                w.last_name_whistleblowers AS last_name,
                u.email,
                w.phone_number_whistleblowers AS phone,
                w.dpi_whistleblowers AS dpi,
                w.gender,
                d.name_department AS department
            FROM Users u
            INNER JOIN Whistleblowers w ON u.id_users = w.users_id
            LEFT JOIN Department d ON w.department_id = d.id_department
            WHERE u.id_users = ?
        `;

        const [rows]: any = await db.query(query, [whistleblowerId]);

        if (rows.length === 0) {
            throw new Error('Denunciante no fue encontrado.');
        }

        return rows[0];
    }

    async getUsersByRole(roleName: string, search?: string) {
        let query = `
            SELECT 
                u.id_users,
                u.email,
                r.name_roles AS role_name,
                COALESCE(w.name_whistleblowers, m.name_managers, a.name_administrators) AS first_name,
                COALESCE(w.last_name_whistleblowers, m.last_name_managers, a.last_name_administrators) AS last_name,
                COALESCE(w.phone_number_whistleblowers, m.phone_number_managers) AS phone_number,
                COALESCE(w.dpi_whistleblowers, m.dpi_managers, a.dpi_administrators) AS dpi,
                COALESCE(w.department_id, m.department_id, a.department_id) AS department_id,
                d.name_department AS department,
                w.gender,
                COALESCE(m.State, a.State) AS State
            FROM Users u
            JOIN Roles r ON u.roles_id = r.id_roles
            LEFT JOIN Whistleblowers w ON u.id_users = w.users_id
            LEFT JOIN Managers m ON u.id_users = m.users_id
            LEFT JOIN Administrators a ON u.id_users = a.users_id
            LEFT JOIN Department d ON d.id_department = COALESCE(w.department_id, m.department_id, a.department_id)
            WHERE r.name_roles = ?
        `;

        const params: any[] = [roleName];

        if (search && search.trim() !== '') {
            query += ` AND (
                COALESCE(w.name_whistleblowers, m.name_managers, a.name_administrators) LIKE ? OR
                COALESCE(w.last_name_whistleblowers, m.last_name_managers, a.last_name_administrators) LIKE ? OR
                u.email LIKE ?
            )`;
            const searchTerm = `%${search.trim()}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        const [users]: any = await db.query(query, params);
        return users;
    }
}
