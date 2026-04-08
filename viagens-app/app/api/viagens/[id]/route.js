import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const [row] = await query(
      `SELECT v.*, u.nome as funcionario, vt.descricao as tipo
       FROM viagem.tbViagem v
       LEFT JOIN seguranca.tbUsuarios u ON v.funcionario_id = u.usuario_id
       LEFT JOIN viagem.tbViagemTipo vt ON v.viagem_tipo_id = vt.viagem_tipo_id
       WHERE v.viagem_id = ?`,
      [params.id]
    );
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { funcionario_id, destino, objetivo, data_ida, data_volta,
            viagem_tipo_id, valor_adiantamento, observacoes, status } = body;

    await query(
      `UPDATE viagem.tbViagem SET
       funcionario_id=?, destino=?, objetivo=?, data_ida=?, data_volta=?,
       viagem_tipo_id=?, valor_adiantamento=?, observacoes=?, status=?
       WHERE viagem_id=?`,
      [funcionario_id, destino, objetivo, data_ida, data_volta,
       viagem_tipo_id, valor_adiantamento || 0, observacoes, status, params.id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await query(`DELETE FROM viagem.tbViagem WHERE viagem_id=?`, [params.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
