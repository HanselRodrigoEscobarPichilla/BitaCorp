import db from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_mega_ultra_supremo_seguro_bitacorp';

export class AuthService {

    async login(email: string, password_user: string) {
        const query = `
            SELECT 
                u.id_users,
                u.first_name,
                u.last_name,
                u.email,
                u.password_user,
                r.role_name
            FROM Users u
            JOIN Roles r ON u.roles_id = r.id_roles
            WHERE u.email = ?
        `;

        const [users]: any = await db.query(query, [email]);

        if (users.length === 0) {
            throw new Error('Credenciales incorrectas.');
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password_user, user.password_user);
        if (!isPasswordValid) {
            throw new Error('Credenciales incorrectas.');
        }

        if (user.role_name === 'ENCARGADO') {
            await db.query(
                "UPDATE Managers SET state = 'Activo' WHERE users_id = ?",
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
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role_name
            }
        };
    }

    async registerWhistleblower(userData: any) {
        const { gender, department, first_name, last_name, email, password_user, dpi, phone } = userData;

        const [existing]: any = await db.query("SELECT id_users FROM Users WHERE email = ?", [email]);
        if (existing.length > 0) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const hashedPassword = await bcrypt.hash(password_user, 10);

        const [roles]: any = await db.query("SELECT id_roles FROM Roles WHERE role_name = 'DENUNCIANTE'");
        if (roles.length === 0) throw new Error('Rol Denunciante no configurado.');

        const roleId = roles[0].id_roles;

        const query = `
            INSERT INTO Users (first_name, last_name, email, password_user, phone, dpi, gender, department, roles_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result]: any = await db.query(query, [
            first_name,
            last_name,
            email,
            hashedPassword,
            phone,
            dpi,
            gender,
            department,
            roleId
        ]);

        return { id: result.insertId, message: 'Registro exitoso.' };
    }

    async logout(userId: number, roleName: string) {
        if (roleName === 'ENCARGADO') {
            await db.query(
                "UPDATE Managers SET state = 'Inactivo' WHERE users_id = ?",
                [userId]
            );
        }
        return { message: 'Sesión cerrada.' };
    }
}