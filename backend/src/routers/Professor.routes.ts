import { Router } from 'express';
import { ProfessorController } from '../controllers/ProfessorController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const professorController = new ProfessorController();

// POST /api/professor - Criar novo professor
router.post('/', authMiddleware, (req, res) => professorController.create(req, res));

// GET /api/professor - Listar todos os professores
router.get('/', authMiddleware, (req, res) => professorController.findAll(req, res));

// GET /api/professor/:id - Buscar professor por ID
router.get('/:id', authMiddleware, (req, res) => professorController.findById(req, res));

// PUT /api/professor/:id - Atualizar professor
router.put('/:id', authMiddleware, (req, res) => professorController.update(req, res));

// DELETE /api/professor/:id - Deletar professor
router.delete('/:id', authMiddleware, (req, res) => professorController.delete(req, res));

export default router;