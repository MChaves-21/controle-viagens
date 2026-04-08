import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { nome, login, senha, perfil, ativo } = body;

    if (senha) {
      await query(
        `UPDATE seguranca.tbUsuarios SET nome=?, login=?, senha=?, perfil=?, ativo=? WHERE usuario_id=?`,
        [nome, login, senha, perfil, ativo ? 1 : 0, params.id]
      );
    } else {
      await query(
        `UPDATE seguranca.tbUsuarios SET nome=?, login=?, perfil=?, ativo=? WHERE usuario_id=?`,
        [nome, login, perfil, ativo ? 1 : 0, params.id]
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await query(`UPDATE seguranca.tbUsuarios SET ativo=0 WHERE usuario_id=?`, [params.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
