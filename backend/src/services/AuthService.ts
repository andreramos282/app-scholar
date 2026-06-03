import bcrypt from 'bcryptjs';
import db from '../db';
import { generateToken } from '../middleware/authMiddleware';
import { User, JwtPayload } from '../types';

export class AuthService {
  async login(email: string, senha: string): Promise<{ token: string; usuario: User }> {
    // Query para encontrar usuário (pode ser aluno ou admin)
    const query = `
      SELECT id, email, nome, matricula, 'aluno' as perfil
      FROM alunos
      WHERE email = $1
      UNION
      SELECT id, email, nome, NULL as matricula, 'admin' as perfil
      FROM (SELECT 1 as id, 'admin@fatec.sp.gov.br' as email, 'Admin' as nome) admin
      WHERE email = $1
    `;

    const result = await db.query(query, [email]);
    
    if (result.rows.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    const user = result.rows[0];

    // Para demonstração, aceitar senha padrão
    // Em produção, usar bcrypt para comparar hashes
    const isValidPassword = senha === '123456';

    if (!isValidPassword) {
      throw new Error('Senha inválida');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      perfil: user.perfil,
    };

    const token = generateToken(payload);

    return {
      token,
      usuario: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        perfil: user.perfil,
        matricula: user.matricula || null,
      },
    };
  }

  async register(email: string, nome: string, senha: string): Promise<User> {
    // Verificar se usuário já existe
    const checkQuery = 'SELECT id FROM alunos WHERE email = $1';
    const checkResult = await db.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      throw new Error('Usuário já existe');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Por simplicidade, usar email como matrícula temporária
    const matricula = `MAT-${Date.now()}`;

    const query = `
      INSERT INTO alunos (matricula, nome, email, curso)
      VALUES ($1, $2, $3, 'Não definido')
      RETURNING id, email, nome
    `;

    const result = await db.query(query, [matricula, nome, email]);
    const user = result.rows[0];

    return {
      id: user.id,
      email: user.email,
      nome: user.nome,
      perfil: 'aluno',
    };
  }
}
