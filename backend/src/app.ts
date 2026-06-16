import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import authRoutes from './routers/Auth.routes'
import alunoRoutes from './routers/Aluno.routes'
import professorRoutes from './routers/Professor.routes'
import disciplinaRouter from './routers/Disciplina.routes'
import cursoRoutes from './routers/Curso.routes'
import boletimRoutes from './routers/Boletim.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use((req: Request, _res: Response, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`)
  next()
})

app.get('/health', (_: Request, res: Response) => res.json({ ok: true, message: 'SGA API online' }))

app.use('/api/auth', authRoutes)

// Rotas com apelidos para não quebrar telas antigas nem o Expo Web
app.use(['/api/aluno', '/api/alunos', '/aluno', '/alunos'], alunoRoutes)
app.use(['/api/professor', '/api/professores', '/professor', '/professores'], professorRoutes)
app.use(['/api/disciplina', '/api/disciplinas', '/disciplina', '/disciplinas'], disciplinaRouter)
app.use(['/api/curso', '/api/cursos', '/curso', '/cursos'], cursoRoutes)
app.use(['/api/boletim', '/api/boletins', '/boletim', '/boletins'], boletimRoutes)

app.use((_: Request, res: Response) => res.status(404).json({ message: 'Rota não encontrada' }))

export default app
