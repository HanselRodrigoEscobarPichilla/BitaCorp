import { Router } from 'express';
import { UserController } from '../controller/usersController';

const router = Router();
const userController = new UserController();

router.get('/', (req, res) => userController.listUsers(req, res));
router.put('/:id', (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

router.post('/register/whistleblower', (req, res) => userController.registerWhistleblower(req, res));
router.post('/register/manager', (req, res) => userController.registerManager(req, res));
router.post('/register/admin', (req, res) => userController.registerAdmin(req, res));

export default router;