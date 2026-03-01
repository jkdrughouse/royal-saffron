import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// ── Env Validation (boot-time) ───────────────────────────────────────────────
// Fail fast: if JWT_SECRET is not set the server must not start.
if (!process.env.JWT_SECRET) {
  throw new Error(
    '[auth] FATAL: JWT_SECRET environment variable is not set. ' +
    'Add it to .env.local (dev) and your hosting environment (prod).'
  );
}
export const JWT_SECRET: string = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
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

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  return verifyToken(token);
}

export function setAuthCookie(token: string) {
  // This will be handled in the API route
  return token;
}

export function clearAuthCookie() {
  // This will be handled in the API route
}
