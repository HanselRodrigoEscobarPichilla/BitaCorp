import { Request, Response } from 'express';
import { BinnacleService } from '../service/binnacleService';

export class BinnacleController {
    private binnacleService = new BinnacleService();

    async listBinnacle(req: Request, res: Response): Promise<void> {
        try {
            const binnacles = await this.binnacleService.listBinnacle();
            res.status(200).json({ success: true, data: binnacles });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Error al obtener las bitácoras.' });
        }
    }

    async createBinnacle(req: Request, res: Response): Promise<void> {
        try {
            const payload = JSON.parse(req.body.data || '{}');
            const files = req.files as Express.Multer.File[];

            if (files && files.length > 0) {
                payload.evidences = files.map(file => ({ file_path: file.path }));
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
        if (files && files.length > 0) {
            payload.evidences = files.map(file => ({ file_path: file.path }));
        }

            await this.binnacleService.updateBinnacle(id, req.body);
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