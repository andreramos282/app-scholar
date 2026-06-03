import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const result = await authService.login(login, senha);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Erro ao fazer login' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, nome, senha } = req.body;

      if (!email || !nome || !senha) {
        return res.status(400).json({ error: 'Email, nome e senha são obrigatórios' });
      }

      const user = await authService.register(email, nome, senha);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Erro ao registrar' });
    }
  }
}
