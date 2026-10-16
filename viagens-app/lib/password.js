import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';

const ROUNDS = 10;

export function isHashed(stored) {
  return typeof stored === 'string' && /^\$2[aby]\$\d{2}\$/.test(stored);
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, ROUNDS);
}

// Verifica a senha. Aceita senhas antigas salvas em texto puro (legado)
// e indica quando o valor salvo precisa ser trocado por um hash.
export async function verifyPassword(plain, stored) {
  if (!stored) return { ok: false, needsRehash: false };
  if (isHashed(stored)) {
    return { ok: await bcrypt.compare(plain, stored), needsRehash: false };
  }
  const a = Buffer.from(String(plain));
  const b = Buffer.from(String(stored));
  const ok = a.length === b.length && timingSafeEqual(a, b);
  return { ok, needsRehash: ok };
}
