import { Client } from "pg"
import dotenv from "dotenv"

dotenv.config()

const db = new Client({
    connectionString: process.env.POSTGRESQL_URL
})

db.connect()
    .then(() => console.log("🟢 Conectado ao PostgreSQL com sucesso!"))
    .catch((err: unknown) => console.error("🔴 Erro ao conectar:", err))

export default db