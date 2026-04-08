import { NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: { id: payload.id, nome: payload.nome, login: payload.login, perfil: payload.perfil }
    });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
