import { Request, Response } from 'express';
import { UserService } from '../service/usersService';

export class UserController {
    private userService = new UserService();

    async listUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.listUser();
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error al obtener usuarios.'
            });
        }
    }

    async registerWhistleblower(req: Request, res: Response): Promise<void> {
        try {
            await this.userService.registerWhistleblower(req.body);
            res.status(201).json({
                success: true,
                message: 'Denunciante registrado con éxito.'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al registrar denunciante.'
            });
        }
    }

    async registerManager(req: Request, res: Response): Promise<void> {
        try {
            await this.userService.registerManager(req.body);
            res.status(201).json({
                success: true,
                message: 'Encargado registrado con éxito.'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al registrar encargado.'
            });
        }
    }

    async registerAdmin(req: Request, res: Response): Promise<void> {
        try {
            await this.userService.registerAdmin(req.body);
            res.status(201).json({
                success: true,
                message: 'Administrador registrado con éxito.'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al registrar administrador.'
            });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID de usuario inválido.' });
                return;
            }

            await this.userService.updateUser(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Usuario actualizado.'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al actualizar.'
            });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID de usuario inválido.' });
                return;
            }

            await this.userService.deleteUser(id);
            res.status(200).json({
                success: true,
                message: 'Usuario eliminado.'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al eliminar.'
            });
        }
    }
}