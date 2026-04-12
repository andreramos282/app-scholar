import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import alunoRoutes from './routers/Aluno.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/aluno", alunoRoutes)
app.use("/", (_: Request, res: Response) => res.sendStatus(404))

export default app