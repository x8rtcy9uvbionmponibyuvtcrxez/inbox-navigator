import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-minimum-32-characters';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-encryption-key-32-chars';

export interface JWTPayload {
  userId: string;
  email: string;
  workspaceId?: string;
  role?: string;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// JWT token management
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Encryption utilities for sensitive data
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decrypt(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Role-based access control
export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.VIEWER]: 1,
    [Role.MEMBER]: 2,
    [Role.ADMIN]: 3,
    [Role.OWNER]: 4
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function requireRole(requiredRole: Role) {
  return (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.role) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!hasPermission(payload.role as Role, requiredRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.user = payload;
    next();
  };
}
