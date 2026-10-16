import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signToken, COOKIE_NAME, cookieOptions } from '@/lib/auth';
import { verifyPassword, hashPassword } from '@/lib/password';

export async function POST(req) {
  try {
    const { login, senha } = await req.json();

    if (!login || !senha) {
      return NextResponse.json({ error: 'Login e senha são obrigatórios.' }, { status: 400 });
    }

    const [user] = await query(
      `SELECT usuario_id, nome, login, perfil, ativo, senha
       FROM seguranca.tbUsuarios
       WHERE login = ? LIMIT 1`,
      [login.trim()]
    );

    const check = user ? await verifyPassword(senha, user.senha) : { ok: false };
    if (!user || !check.ok) {
      return NextResponse.json({ error: 'Login ou senha inválidos.' }, { status: 401 });
    }

    // Migração transparente: senha antiga em texto puro vira hash no primeiro login
    if (check.needsRehash) {
      await query(`UPDATE seguranca.tbUsuarios SET senha = ? WHERE usuario_id = ?`,
        [await hashPassword(senha), user.usuario_id]);
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
