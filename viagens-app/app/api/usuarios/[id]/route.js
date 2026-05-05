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
    const id = params.id;

    // Verificar se usuário tem viagens vinculadas
    const viagens = await query(
      `SELECT COUNT(*) as total FROM viagem.tbViagem WHERE funcionario_id = ?`,
      [id]
    );

    // Verificar se usuário tem despesas vinculadas
    const despesas = await query(
      `SELECT COUNT(*) as total FROM financeiro.tbContasPagar WHERE funcionario_id = ?`,
      [id]
    );

    const temViagens = viagens[0]?.total > 0;
    const temDespesas = despesas[0]?.total > 0;

    if (temViagens || temDespesas) {
      // Tem vínculos: faz soft delete (desativa)
      await query(
        `UPDATE seguranca.tbUsuarios SET ativo = 0 WHERE usuario_id = ?`,
        [id]
      );
      return NextResponse.json({
        ok: true,
        tipo: 'desativado',
        mensagem: 'Usuário desativado pois possui viagens ou despesas vinculadas.',
      });
    }

    // Sem vínculos: exclui de verdade
    await query(
      `DELETE FROM seguranca.tbUsuarios WHERE usuario_id = ?`,
      [id]
    );
    return NextResponse.json({ ok: true, tipo: 'excluido' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
