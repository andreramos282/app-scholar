import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const db = new Pool({
    connectionString: process.env.POSTGRESQL_URL
})

const initDatabase = async () => {
    try {
        await db.query("ALTER TABLE alunos ADD COLUMN IF NOT EXISTS senha VARCHAR(150) NOT NULL DEFAULT '123456';")
        await db.query("ALTER TABLE professores ADD COLUMN IF NOT EXISTS senha VARCHAR(150) NOT NULL DEFAULT '123456';")
        console.log("🟢 Esquema do banco verificado e atualizado com sucesso!")
    } catch (err: unknown) {
        console.error("🔴 Erro ao inicializar banco de dados:", err)
    }
}

initDatabase()

db.connect()
    .then(() => console.log("🟢 Conectado ao PostgreSQL com sucesso!"))
    .catch((err: unknown) => console.error("🔴 Erro ao conectar:", err))

export default db