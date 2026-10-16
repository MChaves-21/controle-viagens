import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';

export async function GET() {
  try {
    const rows = await query(
      `SELECT usuario_id, nome, login, perfil, ativo, atualizado_em
       FROM seguranca.tbUsuarios ORDER BY nome`
    );
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nome, login, senha, perfil } = body;
    if (!nome || !login || !senha) {
      return NextResponse.json({ error: 'Nome, login e senha são obrigatórios.' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO seguranca.tbUsuarios (nome, login, senha, perfil) VALUES (?, ?, ?, ?)`,
      [nome, login, await hashPassword(senha), perfil || 'colaborador']
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
