import { Router } from 'express';
import { BinnacleController } from '../controller/binnacleController';
import { upload } from '../middleware/uploadMiddleware';
import { authorizeRoles } from '../middleware/authMiddleware';

const router = Router();
const binnacleController = new BinnacleController();

router.get('/agent/available', authorizeRoles('ENCARGADO'), (req, res) => binnacleController.getAvailableBinnacles(req, res));
router.get('/agent/history/:managerId', authorizeRoles('ENCARGADO'), (req, res) => binnacleController.getAgentHistory(req, res));
router.get('/agent/view/:id', authorizeRoles('ENCARGADO'), (req, res) => binnacleController.viewBinnacleDetails(req, res));
router.get('/user/:userId', authorizeRoles('DENUNCIANTE', 'ADMINISTRADOR'), (req, res) => binnacleController.getUserBinnacles(req, res));
router.get('/', authorizeRoles('ADMINISTRADOR'), (req, res) => binnacleController.listBinnacle(req, res));
router.get('/:id', (req, res) => binnacleController.getBinnacleById(req, res));
router.post('/', authorizeRoles('DENUNCIANTE', 'ADMINISTRADOR'), upload.array('files'), (req, res) => binnacleController.createBinnacle(req, res));
router.put('/:id', authorizeRoles('DENUNCIANTE', 'ADMINISTRADOR'), upload.array('files'), (req, res) => binnacleController.updateBinnacle(req, res));
router.put('/:id/take', authorizeRoles('ENCARGADO'), (req, res) => binnacleController.takeCase(req, res));
router.put('/:id/cancel', authorizeRoles('ENCARGADO'), (req, res) => binnacleController.cancelCase(req, res));
router.put('/:id/resolve', authorizeRoles('ENCARGADO'), (req, res) => binnacleController.resolveCase(req, res));
router.delete('/:id', authorizeRoles('DENUNCIANTE', 'ADMINISTRADOR'), (req, res) => binnacleController.deleteBinnacle(req, res));

export default router;