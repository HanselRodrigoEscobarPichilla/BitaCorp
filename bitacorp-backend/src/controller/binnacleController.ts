import { Request, Response } from 'express';
import { BinnacleService } from '../service/binnacleService';

export class BinnacleController {
    private binnacleService = new BinnacleService();

    private mapFiles(files?: Express.Multer.File[]) {
        if (!files || files.length === 0) return undefined;
        return files.map(file => ({
            file_path: `/uploads/${file.filename}`,
            file_type: file.mimetype.startsWith('image/')
                ? 'Imagen'
                : file.mimetype.startsWith('video/')
                    ? 'Video'
                    : 'Documento'
        }));
    }

    async listBinnacle(req: Request, res: Response): Promise<void> {
        try {
            const binnacles = await this.binnacleService.listBinnacle();
            res.status(200).json({ success: true, data: binnacles });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener las bitácoras.' });
        }
    }

    private reqUser(req: Request) {
        const user = (req as any).user;
        return {
            id: Number(user?.id),
            role: String(user?.role || '').toUpperCase()
        };
    }

    async createBinnacle(req: Request, res: Response): Promise<void> {
        try {
            const payload = JSON.parse(req.body.data || '{}');
            payload.users_id = this.reqUser(req).id;
            const files = req.files as Express.Multer.File[];

            const mapped = this.mapFiles(files);
            if (mapped) {
                payload.evidences = mapped;
            }

            await this.binnacleService.createBinnacle(payload);
            res.status(201).json({ success: true, message: 'Bitácora guardada.' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Error al guardar.' });
        }
    }

    async updateBinnacle(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID inválido' });
                return;
            }

            let payload = req.body;
            if (req.body.data) {
                payload = JSON.parse(req.body.data);
            }

            const files = req.files as Express.Multer.File[];
            const mapped = this.mapFiles(files);
            if (mapped) {
                payload.evidences = mapped;
            }

            const { id: reqUserId, role } = this.reqUser(req);
            if (role !== 'ADMINISTRADOR') {
                const binnacle = await this.binnacleService.getBinnacleById(id);
                if (Number(binnacle.users_id) !== reqUserId) {
                    res.status(403).json({ success: false, message: 'No tienes permisos sobre esta bitácora.' });
                    return;
                }
            }

            await this.binnacleService.updateBinnacle(id, payload);
            res.status(200).json({ success: true, message: 'Bitácora actualizada.' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Error al actualizar.' });
        }
    }

    async deleteBinnacle(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID inválido.' });
                return;
            }

            const { id: reqUserId, role } = this.reqUser(req);
            if (role !== 'ADMINISTRADOR') {
                const binnacle = await this.binnacleService.getBinnacleById(id);
                if (Number(binnacle.users_id) !== reqUserId) {
                    res.status(403).json({ success: false, message: 'No tienes permisos sobre esta bitácora.' });
                    return;
                }
            }

            await this.binnacleService.deleteBinnacle(id);
            res.status(200).json({ success: true, message: 'Bitácora eliminada.' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Error al eliminar.' });
        }
    }

    async getUserBinnacles(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            const search = req.query.search as string;
            
            if (isNaN(userId)) {
                res.status(400).json({ success: false, message: 'ID inválido.' });
                return;
            }

            const { id: reqUserId, role } = this.reqUser(req);
            if (role === 'DENUNCIANTE' && Number(reqUserId) !== userId) {
                res.status(403).json({ success: false, message: 'No tienes permisos sobre estas bitácoras.' });
                return;
            }

            const binnacles = await this.binnacleService.listBinnaclesUser(userId, search);
            res.status(200).json({ success: true, data: binnacles });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener.' });
        }
    }

    async getBinnacleById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'ID inválido.' });
            return;
        }
            const binnacle = await this.binnacleService.getBinnacleById(id);
            const { id: reqUserId, role } = this.reqUser(req);
            if (role === 'DENUNCIANTE' && Number(binnacle.users_id) !== reqUserId) {
                res.status(403).json({ success: false, message: 'No tienes permisos sobre esta bitácora.' });
                return;
            }
            res.status(200).json({ success: true, data: binnacle });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message || 'Error al obtener.' });
        }
    }

    async getAvailableBinnacles(req: Request, res: Response): Promise<void> {
    try {
        const search = req.query.search as string;
        const binnacles = await this.binnacleService.listBinnaclesManager(search);
        res.status(200).json({ success: true, data: binnacles });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async viewBinnacleDetails(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            await this.binnacleService.inReview(id);
            const binnacle = await this.binnacleService.getBinnacleById(id);
            res.status(200).json({ success: true, data: binnacle });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async takeCase(req: Request, res: Response): Promise<void> {
        try {
            const binnacleId = Number(req.params.id);
            const { managerId } = req.body;
            await this.binnacleService.takeCase(binnacleId, managerId);
            res.status(200).json({ success: true, message: 'Caso asignado.' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async cancelCase(req: Request, res: Response): Promise<void> {
        try {
            const binnacleId = Number(req.params.id);
            const { managerId } = req.body;
            await this.binnacleService.cancelCase(binnacleId, managerId);
            res.status(200).json({ success: true, message: 'Caso cancelado.' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async resolveCase(req: Request, res: Response): Promise<void> {
        try {
            const binnacleId = Number(req.params.id);
            const { managerId } = req.body;
            await this.binnacleService.resolveCase(binnacleId, managerId);
            res.status(200).json({ success: true, message: 'Caso marcado como resuelto.' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAgentHistory(req: Request, res: Response): Promise<void> {
        try {
            const managerId = Number(req.params.managerId);
            const search = req.query.search as string;
            const binnacles = await this.binnacleService.listBinnaclesManagerHistory(managerId, search);
            res.status(200).json({ success: true, data: binnacles });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}