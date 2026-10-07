import { Router } from 'express';
import { BinnacleController } from '../controller/binnacleController';

const router = Router();
const binnacleController = new BinnacleController();

router.get('/', (req, res) => binnacleController.listBinnacle(req, res));
router.post('/', (req, res) => binnacleController.createBinnacle(req, res));
router.put('/:id', (req, res) => binnacleController.updateBinnacle(req, res));
router.delete('/:id', (req, res) => binnacleController.deleteBinnacle(req, res));

export default router;