import { Router } from 'express';
import { BinnacleController } from '../controller/binnacleController';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();
const binnacleController = new BinnacleController();

router.get('/agent/available', (req, res) => binnacleController.getAvailableBinnacles(req, res));
router.get('/agent/history/:managerId', (req, res) => binnacleController.getAgentHistory(req, res));
router.get('/agent/view/:id', (req, res) => binnacleController.viewBinnacleDetails(req, res));
router.get('/user/:userId', (req, res) => binnacleController.getUserBinnacles(req, res));
router.get('/', (req, res) => binnacleController.listBinnacle(req, res));
router.get('/:id', (req, res) => binnacleController.getBinnacleById(req, res));
router.post('/', upload.array('files'), (req, res) => binnacleController.createBinnacle(req, res));
router.put('/:id', upload.array('files'), (req, res) => binnacleController.updateBinnacle(req, res));
router.put('/:id/take', (req, res) => binnacleController.takeCase(req, res));
router.put('/:id/cancel', (req, res) => binnacleController.cancelCase(req, res));
router.put('/:id/resolve', (req, res) => binnacleController.resolveCase(req, res));
router.delete('/:id', (req, res) => binnacleController.deleteBinnacle(req, res));

export default router;