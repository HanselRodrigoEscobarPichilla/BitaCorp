import { Request, Response } from 'express';
import { AuthService } from '../service/authService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios.' });
                return;
            }

            const data = await this.authService.login(email, password);
            res.status(200).json({ success: true, ...data });
        } catch (error: any) {
            res.status(401).json({ success: false, message: error.message });
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.authService.registerWhistleblower(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            if (user) {
                await this.authService.logout(user.id, user.role);
            }
            res.status(200).json({ success: true, message: 'Sesión cerrada.' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}