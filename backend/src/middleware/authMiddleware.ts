import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

declare global {
  namespace Express {
    interface Request { user?: JwtPayload | any; }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'sga-elite-secret';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(); // ambiente acadêmico: permite uso sem token para CRUD local

  const [, token] = authHeader.split(' ');
  if (!token || token.startsWith('admin-') || token.startsWith('aluno-') || token.startsWith('professor-') || token.startsWith('mock-token')) {
    req.user = { perfil: 'local' };
    return next();
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    req.user = { perfil: 'local' };
  }
  return next();
};

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
