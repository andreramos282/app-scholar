import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// POST /api/auth/login - Login do usuário
router.post('/login', (req, res) => authController.login(req, res));

// POST /api/auth/register - Registrar novo usuário
router.post('/register', (req, res) => authController.register(req, res));

export default router;