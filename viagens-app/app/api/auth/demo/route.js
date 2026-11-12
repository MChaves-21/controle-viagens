import { NextResponse } from 'next/server';
import { signToken, COOKIE_NAME, cookieOptions } from '@/lib/auth';
import { VISITANTE } from '@/lib/permissions';

// Modo demonstração: abre uma sessão de visitante, sem senha e sem usuário no banco.
// O perfil "visitante" só lê: o middleware recusa qualquer POST/PUT/DELETE (403).
// Para desligar, defina DEMO_MODE=off nas variáveis de ambiente.
export async function POST() {
  if (process.env.DEMO_MODE === 'off') {
    return NextResponse.json({ error: 'Modo demonstração desativado.' }, { status: 404 });
  }

  const visitante = { id: 0, nome: 'Visitante', login: 'visitante', perfil: VISITANTE };
  const res = NextResponse.json({ user: visitante });
  res.cookies.set(COOKIE_NAME, await signToken(visitante), cookieOptions(60 * 60 * 2));
  return res;
}
