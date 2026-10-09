import { Router } from 'express';
import { AuthController } from '../controller/authController';
import { verifyToken } from '../middleware/authMiddleware';


const router = Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/logout', verifyToken, (req, res) => authController.logout(req, res));

export default router;

