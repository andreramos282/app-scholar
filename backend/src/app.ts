import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import alunoRoutes from './routers/Aluno.routes'
import professorRoutes from './routers/Professor.routes'
import disciplinaRouter from './routers/Disciplina.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/aluno", alunoRoutes)
app.use("/api/professor", professorRoutes)
app.use("/api/disciplina", disciplinaRouter)
app.use("/", (_: Request, res: Response) => res.sendStatus(404))

export default app