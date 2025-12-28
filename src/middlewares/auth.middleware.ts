import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { decrypt } from '../services/crypto.service';

interface JwtPayload {
  data: string;
}

export function authMiddleware(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    const decryptedData = JSON.parse(decrypt(decoded.data));
    
    req.userId = decryptedData.userId;
    req.userEmail = decryptedData.email;

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
