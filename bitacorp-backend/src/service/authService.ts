import db from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_mega_ultra_supremo_seguro_bitacorp';

export class AuthService {

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

    async login(email: string, password_user: string) {
        const query = `
            SELECT 
                u.id_users,
                u.email,
                u.passwords,
                r.name_roles AS role_name,
                COALESCE(w.name_whistleblowers, m.name_managers, a.name_administrators) AS first_name,
                COALESCE(w.last_name_whistleblowers, m.last_name_managers, a.last_name_administrators) AS last_name
            FROM Users u
            JOIN Roles r ON u.roles_id = r.id_roles
            LEFT JOIN Whistleblowers w ON u.id_users = w.users_id
            LEFT JOIN Managers m ON u.id_users = m.users_id
            LEFT JOIN Administrators a ON u.id_users = a.users_id
            WHERE u.email = ?
        `;

        const [users]: any = await db.query(query, [email]);

        if (users.length === 0) {
            throw new Error('Credenciales incorrectas.');
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password_user, user.passwords);
        if (!isPasswordValid) {
            throw new Error('Credenciales incorrectas.');
        }

        if ((user.role_name || '').toUpperCase() === 'ENCARGADO') {
            await db.query(
                "UPDATE Managers SET State = 'Activo' WHERE users_id = ?",
                [user.id_users]
            );
        }

        const token = jwt.sign(
            { id: user.id_users, email: user.email, role: user.role_name },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return {
            token,
            user: {
                id: user.id_users,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                email: user.email,
                role: user.role_name
            }
        };
    }

    async registerWhistleblower(userData: any) {
        const gender = userData.gender;
        const department = userData.department;
        const firstName = userData.first_name ?? userData.name_whistleblowers;
        const lastName = userData.last_name ?? userData.last_name_whistleblowers;
        const email = userData.email;
        const password_user = userData.password_user ?? userData.passwords;
        const dpi = userData.dpi ?? userData.dpi_whistleblowers;
        const phone = userData.phone ?? userData.phone_number_whistleblowers;

        if (!email || !password_user) {
            throw new Error('El correo y la contraseña son obligatorios.');
        }

        const [existing]: any = await db.query("SELECT id_users FROM Users WHERE email = ?", [email]);
        if (existing.length > 0) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const [roles]: any = await db.query("SELECT id_roles FROM Roles WHERE name_roles = 'Denunciante'");
        if (roles.length === 0) throw new Error('Rol Denunciante no configurado.');

        const roleId = roles[0].id_roles;
        const hashedPassword = await bcrypt.hash(password_user, 10);
        const departmentId = await this.resolveDepartmentId(department, userData.department_id);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result]: any = await connection.query(
                'INSERT INTO Users (email, passwords, roles_id) VALUES (?, ?, ?)',
                [email, hashedPassword, roleId]
            );

            const newUserId = result.insertId;

            await connection.query(
                `INSERT INTO Whistleblowers 
                (name_whistleblowers, last_name_whistleblowers, phone_number_whistleblowers, dpi_whistleblowers, gender, department_id, users_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [firstName || '', lastName || '', phone || null, dpi || null, gender || null, departmentId, newUserId]
            );

            await connection.commit();
            return { id: newUserId, message: 'Registro exitoso.' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async logout(userId: number, roleName: string) {
        if ((roleName || '').toUpperCase() === 'ENCARGADO') {
            await db.query(
                "UPDATE Managers SET State = 'Inactivo' WHERE users_id = ?",
                [userId]
            );
        }
        return { message: 'Sesión cerrada.' };
    }
}
