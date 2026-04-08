import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req) {
  try {
    const { nome, login, senha, confirmarSenha } = await req.json();

    if (!nome || !login || !senha) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }
    if (senha !== confirmarSenha) {
      return NextResponse.json({ error: 'As senhas não coincidem.' }, { status: 400 });
    }
    if (senha.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
    }

    // Check duplicate login
    const [existing] = await query(
      `SELECT usuario_id FROM seguranca.tbUsuarios WHERE login = ? LIMIT 1`,
      [login.trim()]
    );
    if (existing) {
      return NextResponse.json({ error: 'Este login já está em uso.' }, { status: 409 });
    }

    await query(
      `INSERT INTO seguranca.tbUsuarios (nome, login, senha, perfil, ativo) VALUES (?, ?, ?, 'colaborador', 1)`,
      [nome.trim(), login.trim(), senha]
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
