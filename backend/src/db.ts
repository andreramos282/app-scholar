import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const connectionString = process.env.POSTGRESQL_URL
  || (process.env.DB_HOST
    ? `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || '1234'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'escola'}`
    : 'postgresql://postgres:1234@localhost:5432/escola')

const db = new Pool({ connectionString })

const initDatabase = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS cursos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL UNIQUE,
        area VARCHAR(100) NOT NULL DEFAULT 'Não informada',
        duracao VARCHAR(50) NOT NULL DEFAULT '6',
        coordenador VARCHAR(150) NOT NULL DEFAULT 'Não informado',
        periodo VARCHAR(30) NOT NULL DEFAULT 'Noturno',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS professores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        titulacao VARCHAR(100) NOT NULL DEFAULT 'Não informada',
        area_atuacao VARCHAR(100) NOT NULL DEFAULT 'Não informada',
        semestre INTEGER NOT NULL DEFAULT 1,
        periodo VARCHAR(30) NOT NULL DEFAULT 'Noturno',
        tempo_docencia INTEGER NOT NULL DEFAULT 0,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(150) NOT NULL DEFAULT '123456'
      );
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        matricula VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        curso VARCHAR(150) NOT NULL,
        curso_id INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(150) NOT NULL DEFAULT '123456',
        semestre INTEGER NOT NULL DEFAULT 1,
        periodo VARCHAR(30) NOT NULL DEFAULT 'Noturno',
        telefone VARCHAR(30),
        cep VARCHAR(20),
        endereco VARCHAR(200),
        cidade VARCHAR(100),
        estado VARCHAR(50)
      );
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS disciplina (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        carga_horaria INTEGER NOT NULL DEFAULT 80,
        professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL,
        curso VARCHAR(150) NOT NULL,
        semestre INTEGER NOT NULL DEFAULT 1,
        periodo VARCHAR(30) NOT NULL DEFAULT 'Noturno'
      );
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS boletim (
        id SERIAL PRIMARY KEY,
        aluno_matricula VARCHAR(50) NOT NULL REFERENCES alunos(matricula) ON DELETE CASCADE,
        disciplina_id INTEGER NOT NULL REFERENCES disciplina(id) ON DELETE CASCADE,
        nota1 NUMERIC(5,2) NOT NULL DEFAULT 0,
        nota2 NUMERIC(5,2) NOT NULL DEFAULT 0,
        tipo_prova CHAR(1) NOT NULL DEFAULT 'A' CHECK (tipo_prova IN ('A','B','C')),
        faltas INTEGER NOT NULL DEFAULT 0,
        aulas_totais INTEGER NOT NULL DEFAULT 0,
        frequencia NUMERIC(5,2) NOT NULL DEFAULT 100,
        media NUMERIC(5,2) GENERATED ALWAYS AS ((nota1 + nota2) / 2) STORED,
        situacao VARCHAR(50),
        CONSTRAINT boletim_aluno_disciplina_unique UNIQUE (aluno_matricula, disciplina_id)
      );
    `)

    await db.query("ALTER TABLE cursos ADD COLUMN IF NOT EXISTS area VARCHAR(100) NOT NULL DEFAULT 'Não informada';")
    await db.query("ALTER TABLE cursos ADD COLUMN IF NOT EXISTS duracao VARCHAR(50) NOT NULL DEFAULT '6';")
    await db.query("ALTER TABLE cursos ALTER COLUMN duracao TYPE VARCHAR(50) USING duracao::text;")
    await db.query("ALTER TABLE cursos ADD COLUMN IF NOT EXISTS coordenador VARCHAR(150) NOT NULL DEFAULT 'Não informado';")
    await db.query("ALTER TABLE cursos ADD COLUMN IF NOT EXISTS periodo VARCHAR(30) NOT NULL DEFAULT 'Noturno';")
    await db.query("ALTER TABLE cursos ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;")
    await db.query("ALTER TABLE cursos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;")

    await db.query("ALTER TABLE alunos ADD COLUMN IF NOT EXISTS curso_id INTEGER REFERENCES cursos(id) ON DELETE SET NULL;")
    await db.query("ALTER TABLE alunos ADD COLUMN IF NOT EXISTS senha VARCHAR(150) NOT NULL DEFAULT '123456';")
    await db.query("ALTER TABLE alunos ADD COLUMN IF NOT EXISTS semestre INTEGER NOT NULL DEFAULT 1;")
    await db.query("ALTER TABLE alunos ADD COLUMN IF NOT EXISTS periodo VARCHAR(30) NOT NULL DEFAULT 'Noturno';")

    await db.query("ALTER TABLE professores ADD COLUMN IF NOT EXISTS senha VARCHAR(150) NOT NULL DEFAULT '123456';")
    await db.query("ALTER TABLE professores ADD COLUMN IF NOT EXISTS semestre INTEGER NOT NULL DEFAULT 1;")
    await db.query("ALTER TABLE professores ADD COLUMN IF NOT EXISTS periodo VARCHAR(30) NOT NULL DEFAULT 'Noturno';")

    await db.query("ALTER TABLE disciplina ADD COLUMN IF NOT EXISTS professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL;")
    await db.query("ALTER TABLE disciplina ADD COLUMN IF NOT EXISTS semestre INTEGER NOT NULL DEFAULT 1;")
    await db.query("ALTER TABLE disciplina ADD COLUMN IF NOT EXISTS periodo VARCHAR(30) NOT NULL DEFAULT 'Noturno';")

    await db.query("ALTER TABLE boletim ADD COLUMN IF NOT EXISTS tipo_prova CHAR(1) NOT NULL DEFAULT 'A';")
    await db.query("ALTER TABLE boletim ADD COLUMN IF NOT EXISTS faltas INTEGER NOT NULL DEFAULT 0;")
    await db.query("ALTER TABLE boletim ADD COLUMN IF NOT EXISTS aulas_totais INTEGER NOT NULL DEFAULT 0;")
    await db.query("ALTER TABLE boletim ADD COLUMN IF NOT EXISTS frequencia NUMERIC(5,2) NOT NULL DEFAULT 100;")
    await db.query("ALTER TABLE boletim ADD COLUMN IF NOT EXISTS situacao VARCHAR(50);")
    await db.query(`DO $$ BEGIN
      ALTER TABLE boletim ADD CONSTRAINT boletim_aluno_disciplina_unique UNIQUE (aluno_matricula, disciplina_id);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)

    console.log("🟢 Esquema do banco verificado e atualizado com sucesso!")
  } catch (err: unknown) {
    console.error("🔴 Erro ao inicializar banco de dados:", err)
  }
}

initDatabase()

db.connect()
  .then((client) => { client.release(); console.log("🟢 Conectado ao PostgreSQL com sucesso!") })
  .catch((err: unknown) => console.error("🔴 Erro ao conectar:", err))

export default db
