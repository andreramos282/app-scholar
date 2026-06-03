import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const alunoController = new AlunoController();

// POST /api/aluno - Criar novo aluno
router.post('/', authMiddleware, (req, res) => alunoController.create(req, res));

// GET /api/aluno - Listar todos os alunos
router.get('/', authMiddleware, (req, res) => alunoController.findAll(req, res));

// GET /api/aluno/:matricula - Buscar aluno por matrícula
router.get('/:matricula', authMiddleware, (req, res) => alunoController.findByMatricula(req, res));

// PUT /api/aluno/:matricula - Atualizar aluno
router.put('/:matricula', authMiddleware, (req, res) => alunoController.update(req, res));

// DELETE /api/aluno/:matricula - Deletar aluno
router.delete('/:matricula', authMiddleware, (req, res) => alunoController.delete(req, res));

export default router;