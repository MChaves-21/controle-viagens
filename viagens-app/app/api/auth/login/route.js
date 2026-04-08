import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signToken, COOKIE_NAME, cookieOptions } from '@/lib/auth';

export async function POST(req) {
  try {
    const { login, senha } = await req.json();

    if (!login || !senha) {
      return NextResponse.json({ error: 'Login e senha são obrigatórios.' }, { status: 400 });
    }

    const [user] = await query(
      `SELECT usuario_id, nome, login, perfil, ativo
       FROM seguranca.tbUsuarios
       WHERE login = ? AND senha = ? LIMIT 1`,
      [login.trim(), senha]
    );

    if (!user) {
      return NextResponse.json({ error: 'Login ou senha inválidos.' }, { status: 401 });
    }

    if (!user.ativo) {
      return NextResponse.json({ error: 'Usuário inativo. Contate o administrador.' }, { status: 403 });
    }

    const token = await signToken({
      id: user.usuario_id,
      nome: user.nome,
      login: user.login,
      perfil: user.perfil,
    });

    const res = NextResponse.json({
      user: { id: user.usuario_id, nome: user.nome, login: user.login, perfil: user.perfil }
    });

    res.cookies.set(COOKIE_NAME, token, cookieOptions());
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
