import { Router } from 'express';
import { BoletimController } from '../controllers/BoletimController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const boletimController = new BoletimController();

// POST /api/boletim - Criar novo boletim
router.post('/', authMiddleware, (req, res) => boletimController.create(req, res));

// GET /api/boletim - Listar todos os boletins
router.get('/', authMiddleware, (req, res) => boletimController.findAll(req, res));

// GET /api/boletim/:matricula - Buscar boletim do aluno
router.get('/:matricula', authMiddleware, (req, res) => boletimController.findByAluno(req, res));

// PUT /api/boletim/:id - Atualizar notas
router.put('/:id', authMiddleware, (req, res) => boletimController.update(req, res));

// DELETE /api/boletim/:id - Deletar boletim
router.delete('/:id', authMiddleware, (req, res) => boletimController.delete(req, res));

export default router;