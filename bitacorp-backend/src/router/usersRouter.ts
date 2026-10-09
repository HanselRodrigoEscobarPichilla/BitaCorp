import { Router } from 'express';
import { UserController } from '../controller/usersController';
import { authorizeRoles } from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

router.get('/role/:role', authorizeRoles('ADMINISTRADOR'), (req, res) => userController.getUsersByRole(req, res));
router.get('/profile/:id', (req, res) => userController.getUserProfile(req, res));
router.put('/profile/:id', (req, res) => userController.updateProfile(req, res));
router.delete('/profile/:id', (req, res) => userController.deleteMyAccount(req, res));
router.get('/whistleblower/:id', authorizeRoles('ENCARGADO', 'ADMINISTRADOR'), (req, res) => userController.WhistleblowerForAgent(req, res));
router.post('/register/whistleblower', authorizeRoles('ADMINISTRADOR'), (req, res) => userController.registerWhistleblower(req, res));
router.post('/register/manager', authorizeRoles('ADMINISTRADOR'), (req, res) => userController.registerManager(req, res));
router.post('/register/admin', authorizeRoles('ADMINISTRADOR'), (req, res) => userController.registerAdmin(req, res));
router.get('/', authorizeRoles('ADMINISTRADOR'), (req, res) => userController.listUsers(req, res));
router.put('/:id', authorizeRoles('ADMINISTRADOR'), (req, res) => userController.updateUser(req, res));
router.delete('/:id', authorizeRoles('ADMINISTRADOR'), (req, res) => userController.deleteUser(req, res));

export default router;