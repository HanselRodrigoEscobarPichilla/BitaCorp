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
            await this.binnacleService.createBinnacle(req.body);
            res.status(201).json({ success: true, message: 'Bitácora creada correctamente' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Error al crear.' });
        }
    }

    async updateBinnacle(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID inválido' });
                return;
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
}