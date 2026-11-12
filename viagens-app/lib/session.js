import { verifyToken, COOKIE_NAME } from '@/lib/auth';

// Lê o usuário logado a partir do cookie de sessão (JWT).
export async function getSessionUser(req) {
  const token = req.cookies?.get(COOKIE_NAME)?.value;
  return token ? await verifyToken(token) : null;
}
