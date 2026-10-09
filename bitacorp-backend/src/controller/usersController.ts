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

    async deleteMyAccount(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID de usuario inválido.' });
                return;
            }

            const { id: reqUserId, role } = this.reqUser(req);
            if (role !== 'ADMINISTRADOR' && reqUserId !== id) {
                res.status(403).json({ success: false, message: 'No tienes permisos para eliminar esta cuenta.' });
                return;
            }

            await this.userService.deleteUser(id);
            res.status(200).json({ success: true, message: 'Cuenta eliminada.' });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al eliminar.'
            });
        }
    }

    private reqUser(req: Request) {
        const user = (req as any).user;
        return {
            id: Number(user?.id),
            role: String(user?.role || '').toUpperCase()
        };
    }

    async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { id: reqUserId, role } = this.reqUser(req);
            if (role !== 'ADMINISTRADOR' && reqUserId !== id) {
                res.status(403).json({ success: false, message: 'No tienes permisos para ver este perfil.' });
                return;
            }

            const profile = await this.userService.getUserProfile(id);
            res.status(200).json({ success: true, data: profile });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message || 'Error al obtener.' });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { id: reqUserId, role } = this.reqUser(req);
            if (role !== 'ADMINISTRADOR' && reqUserId !== id) {
                res.status(403).json({ success: false, message: 'No tienes permisos para actualizar este perfil.' });
                return;
            }

            await this.userService.updateProfile(id, req.body);
            res.status(200).json({ success: true, message: 'Perfil actualizado.' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Error al actualizar.' });
        }
    }

    async WhistleblowerForAgent(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID de inválido.' });
                return;
            }

            const profile = await this.userService.WhistleblowerForAgent(id);
            res.status(200).json({ success: true, data: profile });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message || 'Error al obtener datos del denunciante.' });
        }
    }

    async getUsersByRole(req: Request, res: Response): Promise<void> {
        try {
            const { role } = req.params;
            const search = req.query.search as string;
            
            let roleName = '';
            
            if (role === 'whistleblower') roleName = 'Denunciante';
            else if (role === 'manager') roleName = 'Encargado';
            else if (role === 'admin') roleName = 'Administrador';
            else {
                res.status(400).json({ success: false, message: 'Rol inválido' });
                return;
            }

            const users = await this.userService.getUsersByRole(roleName, search);
            res.status(200).json({ success: true, data: users });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener usuarios' });
        }
    }
}