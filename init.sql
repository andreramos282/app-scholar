CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    area VARCHAR(100) NOT NULL,
    duracao INT NOT NULL CHECK (duracao > 0),
    coordenador VARCHAR(100) NOT NULL,
    periodo VARCHAR(10) NOT NULL DEFAULT 'Noturno' CHECK (periodo IN ('Matutino', 'Vespertino', 'Noturno', 'Diurno'))
);

CREATE TABLE IF NOT EXISTS alunos (
    matricula VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    curso_id INT,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(150) NOT NULL DEFAULT '123456',
    semestre INT NOT NULL CHECK (semestre BETWEEN 1 AND 6),
    periodo VARCHAR(10) NOT NULL DEFAULT 'Noturno' CHECK (periodo IN ('Matutino', 'Vespertino', 'Noturno', 'Diurno')),
    telefone VARCHAR(20),
    cep VARCHAR(10),
    endereco VARCHAR(150),
    cidade VARCHAR(100),
    estado CHAR(2),
    CONSTRAINT chk_estado CHECK (estado ~ '^[A-Z]{2}$'),
    CONSTRAINT fk_aluno_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    titulacao VARCHAR(100) NOT NULL,
    area_atuacao VARCHAR(100) NOT NULL,
    semestre INT NOT NULL CHECK (semestre BETWEEN 1 AND 6),
    periodo VARCHAR(10) NOT NULL DEFAULT 'Noturno' CHECK (periodo IN ('Matutino', 'Vespertino', 'Noturno', 'Diurno')),
    tempo_docencia INT CHECK (tempo_docencia >= 0),
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(150) NOT NULL DEFAULT '123456'
);

CREATE TABLE IF NOT EXISTS disciplina (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria INT NOT NULL CHECK (carga_horaria > 0),
    professor_id INT,
    curso VARCHAR(100) NOT NULL,
    semestre INT NOT NULL CHECK (semestre > 0),
    periodo VARCHAR(10) NOT NULL DEFAULT 'Noturno' CHECK (periodo IN ('Matutino', 'Vespertino', 'Noturno', 'Diurno')),
    CONSTRAINT fk_professor
        FOREIGN KEY (professor_id)
        REFERENCES professores(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS boletim (
    id SERIAL PRIMARY KEY,
    aluno_matricula VARCHAR(20) NOT NULL,
    disciplina_id INT NOT NULL,
    nota1 DECIMAL(5,2) NOT NULL CHECK (nota1 BETWEEN 0 AND 10),
    nota2 DECIMAL(5,2) NOT NULL CHECK (nota2 BETWEEN 0 AND 10),
    tipo_prova CHAR(1) NOT NULL DEFAULT 'A' CHECK (tipo_prova IN ('A', 'B', 'C')),
    faltas INT NOT NULL DEFAULT 0 CHECK (faltas >= 0),
    frequencia DECIMAL(5,2) NOT NULL DEFAULT 100 CHECK (frequencia BETWEEN 0 AND 100),
    media DECIMAL(5,2) GENERATED ALWAYS AS ((nota1 + nota2) / 2) STORED,
    situacao VARCHAR(20),
    CONSTRAINT fk_aluno
        FOREIGN KEY (aluno_matricula)
        REFERENCES alunos(matricula)
        ON DELETE CASCADE,
    CONSTRAINT fk_disciplina
        FOREIGN KEY (disciplina_id)
        REFERENCES disciplina(id)
        ON DELETE CASCADE,
    CONSTRAINT uk_boletim_aluno_disciplina UNIQUE (aluno_matricula, disciplina_id)
);

-- Migração segura para bancos já criados antes desta versão
ALTER TABLE boletim ADD COLUMN IF NOT EXISTS tipo_prova CHAR(1) NOT NULL DEFAULT 'A';
ALTER TABLE boletim DROP CONSTRAINT IF EXISTS chk_boletim_tipo_prova;
ALTER TABLE boletim ADD CONSTRAINT chk_boletim_tipo_prova CHECK (tipo_prova IN ('A', 'B', 'C'));
CREATE UNIQUE INDEX IF NOT EXISTS uk_boletim_aluno_disciplina_idx ON boletim (aluno_matricula, disciplina_id);


-- Migrações SGA Elite v3
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS periodo VARCHAR(10) NOT NULL DEFAULT 'Noturno';
ALTER TABLE professores ADD COLUMN IF NOT EXISTS periodo VARCHAR(10) NOT NULL DEFAULT 'Noturno';
ALTER TABLE disciplina ADD COLUMN IF NOT EXISTS periodo VARCHAR(10) NOT NULL DEFAULT 'Noturno';
ALTER TABLE boletim ADD COLUMN IF NOT EXISTS faltas INT NOT NULL DEFAULT 0;
ALTER TABLE boletim ADD COLUMN IF NOT EXISTS frequencia DECIMAL(5,2) NOT NULL DEFAULT 100;
ALTER TABLE boletim DROP CONSTRAINT IF EXISTS chk_boletim_frequencia;
ALTER TABLE boletim ADD CONSTRAINT chk_boletim_frequencia CHECK (frequencia BETWEEN 0 AND 100);
ALTER TABLE boletim DROP CONSTRAINT IF EXISTS chk_boletim_faltas;
ALTER TABLE boletim ADD CONSTRAINT chk_boletim_faltas CHECK (faltas >= 0);


-- Migrações SGA Elite v4 - módulo de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    area VARCHAR(100) NOT NULL,
    duracao INT NOT NULL CHECK (duracao > 0),
    coordenador VARCHAR(100) NOT NULL,
    periodo VARCHAR(10) NOT NULL DEFAULT 'Noturno' CHECK (periodo IN ('Matutino', 'Vespertino', 'Noturno', 'Diurno'))
);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS curso_id INT;
DO $$ BEGIN
    ALTER TABLE alunos ADD CONSTRAINT fk_aluno_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS idx_alunos_curso_id ON alunos(curso_id);
CREATE INDEX IF NOT EXISTS idx_disciplina_professor_semestre_periodo ON disciplina(professor_id, semestre, periodo);
