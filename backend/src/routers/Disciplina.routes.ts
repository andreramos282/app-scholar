import { Router } from 'express';
import { DisciplinaController } from '../controllers/DisciplinaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const disciplinaController = new DisciplinaController();

// POST /api/disciplina - Criar nova disciplina
router.post('/', authMiddleware, (req, res) => disciplinaController.create(req, res));

// GET /api/disciplina - Listar todas as disciplinas
router.get('/', authMiddleware, (req, res) => disciplinaController.findAll(req, res));

// GET /api/disciplina/:id - Buscar disciplina por ID
router.get('/:id', authMiddleware, (req, res) => disciplinaController.findById(req, res));

// GET /api/disciplina/curso/:curso - Buscar disciplinas por curso
router.get('/curso/:curso', authMiddleware, (req, res) => disciplinaController.findByCurso(req, res));

// PUT /api/disciplina/:id - Atualizar disciplina
router.put('/:id', authMiddleware, (req, res) => disciplinaController.update(req, res));

// DELETE /api/disciplina/:id - Deletar disciplina
router.delete('/:id', authMiddleware, (req, res) => disciplinaController.delete(req, res));

export default router;