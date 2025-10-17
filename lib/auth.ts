
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

type User = {
  id: string;
  email: string;
  name: string;
  type: 'PROFESSOR' | 'ALUNO';
  points: number;
  level: number;
  medals: string[];
  createdAt: Date;
  updatedAt: Date;
};

const JWT_SECRET = process.env.JWT_SECRET || 'ifpi-platform-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  type: string;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      type: user.type,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
