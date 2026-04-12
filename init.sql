CREATE TABLE IF NOT EXISTS alunos (
    matricula VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cep VARCHAR(10),
    endereco VARCHAR(150),
    cidade VARCHAR(100),
    estado CHAR(2),
    CONSTRAINT chk_estado CHECK (estado ~ '^[A-Z]{2}$')
);

CREATE TABLE IF NOT EXISTS professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    titulacao VARCHAR(100) NOT NULL,
    area_atuacao VARCHAR(100) NOT NULL,
    tempo_docencia INT CHECK (tempo_docencia >= 0),
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS disciplina (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria INT NOT NULL CHECK (carga_horaria > 0),
    professor_id INT,
    curso VARCHAR(100) NOT NULL,
    semestre INT NOT NULL CHECK (semestre > 0),
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
    media DECIMAL(5,2) GENERATED ALWAYS AS ((nota1 + nota2) / 2) STORED,
    situacao VARCHAR(20),
    CONSTRAINT fk_aluno
        FOREIGN KEY (aluno_matricula)
        REFERENCES alunos(matricula)
        ON DELETE CASCADE,
    CONSTRAINT fk_disciplina
        FOREIGN KEY (disciplina_id)
        REFERENCES disciplina(id)
        ON DELETE CASCADE
);