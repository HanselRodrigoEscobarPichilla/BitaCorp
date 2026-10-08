import db from "../config/database";
import { UserResponse, CreateUserDTO } from "../model/usersModel";

export class UserService {

    private validateUser(user: CreateUserDTO): void{
        const { email, passwords} = user;

        if (!email || !passwords) {
            throw new Error("El correo y la contraseña son obligatorios.");
        }

        const domains = ["@gmail.com", "@kinal.edu.gt", "@outlook.com", "@yahoo.com"];
        const validDomain = domains.some(domain => email.toLowerCase().endsWith(domain));
    
        if (!validDomain) {
            throw new Error("El correo debe pertenecer a un dominio válido: @gmail.com, @kinal.edu.gt, @outlook.com, @yahoo.com");
        }
    }

    async listUser(): Promise<UserResponse[]> {
        const query = `
        SELECT 
                u.id_users,
                u.email,
                u.roles_id,
                r.roles AS role_name,
                COALESCE(w.phone_number, m.phone_number, a.phone_number) AS phone_number,
                COALESCE(w.dpi, m.dpi, a.dpi) AS dpi,
                COALESCE(w.department_id, m.department_id, a.department_id) AS department_id,
                w.gender,
                COALESCE(m.State, a.State) AS State
            FROM Users u
            LEFT JOIN Roles r ON u.roles_id = r.id_roles
            LEFT JOIN Whistleblowers w ON u.id_users = w.users_id
            LEFT JOIN Managers m ON u.id_users = m.users_id
            LEFT JOIN Administrators a ON u.id_users = a.users_id;
            `;
            const [rows] = await db.query(query);
            return rows as UserResponse[];
    }
    
    async registerWhistleblower(data: CreateUserDTO): Promise<void> {
        this.validateUser(data);
        await this.createUser(data, 3);
    }

    async registerManager(data: CreateUserDTO): Promise<void> {
        this.validateUser(data);
        await this.createUser(data, 2);
    }

    async registerAdmin(data: CreateUserDTO): Promise<void> {
        this.validateUser(data);
        await this.createUser(data, 1);
    }

    private async createUser(user: CreateUserDTO, roleId: number): Promise<void> {
        const [existingUsers]: any = await db.query('SELECT id_users FROM Users WHERE email = ?', [user.email]);
        if (existingUsers.length > 0) {
            throw new Error("Ya existe un usuario con ese correo electrónico.");
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [userResult]: any = await connection.query(
                'INSERT INTO Users (email, passwords, roles_id) VALUES (?, ?, ?)',
                [user.email, user.passwords, roleId]
            );

            const newUserId = userResult.insertId;

            if (roleId === 3) {
                await connection.query(
                    'INSERT INTO Whistleblowers (gender, phone_number, dpi, department_id, users_id) VALUES (?, ?, ?, ?, ?)',
                    [user.gender || null, user.phone_number || null, user.dpi || null, user.department_id || null, newUserId]
                );
            } else if (roleId === 2) {
                await connection.query(
                    'INSERT INTO Managers (State, dpi, phone_number, department_id, users_id) VALUES (?, ?, ?, ?, ?)',
                    [user.State || 'Activo', user.dpi || null, user.phone_number || null, user.department_id || null, newUserId]
                );
            } else if (roleId === 1) {
                await connection.query(
                    'INSERT INTO Administrators (State, dpi, phone_number, department_id, users_id) VALUES (?, ?, ?, ?, ?)',
                    [user.State || 'Activo', user.dpi || null, user.phone_number || null, user.department_id || null, newUserId]
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

        await db.query('DELETE FROM Users WHERE id_users = ?', [id]);
    }

    async updateUser(id: number, data: CreateUserDTO): Promise<void> {
        this.validateUser(data);

        const [users]: any = await db.query('SELECT roles_id FROM Users WHERE id_users = ?', [id]);
        if (users.length === 0) {
            throw new Error("El usuario no fue encontrado.");
        }

        const roleId = users[0].roles_id;
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            await connection.query(
                'UPDATE Users SET email = ?, passwords = ? WHERE id_users = ?',
                [data.email, data.passwords, id]
            );

            if (roleId === 3) {
                await connection.query(
                    'UPDATE Whistleblowers SET gender = ?, phone_number = ?, dpi = ?, department_id = ? WHERE users_id = ?',
                    [data.gender || null, data.phone_number || null, data.dpi || null, data.department_id || null, id]
                );
            } else if (roleId === 2) {
                await connection.query(
                    'UPDATE Managers SET State = ?, dpi = ?, phone_number = ?, department_id = ? WHERE users_id = ?',
                    [data.State || 'Activo', data.dpi || null, data.phone_number || null, data.department_id || null, id]
                );
            } else if (roleId === 1) {
                await connection.query(
                    'UPDATE Administrators SET State = ?, dpi = ?, phone_number = ?, department_id = ? WHERE users_id = ?',
                    [data.State || 'Activo', data.dpi || null, data.phone_number || null, data.department_id || null, id]
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
                r.roles AS role_name,
                w.phone_number,
                w.dpi,
                w.department_id,
                w.gender
            FROM Users u
            LEFT JOIN Roles r ON u.roles_id = r.id_roles
            LEFT JOIN Whistleblowers w ON u.id_users = w.users_id
            WHERE u.id_users = ?;
        `;
        const [rows]: any = await db.query(query, [id]);
        if (rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }
        return rows[0] as UserResponse;
    }

    async updateProfile(id: number, data: CreateUserDTO): Promise<void> {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            if (data.email) {
                await connection.query(
                    'UPDATE Users SET email = ? WHERE id_users = ?',
                    [data.email, id]
                );
            }

            await connection.query(
                'UPDATE Whistleblowers SET gender = ?, phone_number = ?, department_id = ? WHERE users_id = ?',
                [data.gender || null, data.phone_number || null, data.department_id || null, id]
            );

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
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.dpi,
        u.gender,
        u.department
        FROM Users u
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
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.dpi,
        u.gender,
        u.department,
        m.state AS agent_state
        FROM Users u
        JOIN Roles r ON u.roles_id = r.id_roles
        LEFT JOIN Managers m ON u.id_users = m.users_id
        WHERE r.role_name = ?
        `;
        
        const params: any[] = [roleName];
        
        if (search && search.trim() !== '') {
            query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ?)`;
            const searchTerm = `%${search.trim()}%`;
            params.push(searchTerm, searchTerm);
        }
        
        const [users]: any = await db.query(query, params);
        return users;
    }
}