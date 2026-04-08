import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { funcionario_id, viagem_id, descricao, valor, data_vencimento,
            data_pagamento, status, tipo_titulo_id, observacoes, comprovante_url } = body;

    await query(
      `UPDATE financeiro.tbContasPagar SET
       funcionario_id=?, viagem_id=?, descricao=?, valor=?,
       data_vencimento=?, data_pagamento=?, status=?,
       tipo_titulo_id=?, observacoes=?, comprovante_url=?
       WHERE conta_pagar_id=?`,
      [funcionario_id, viagem_id || null, descricao, valor,
       data_vencimento || null, data_pagamento || null,
       status, tipo_titulo_id || null, observacoes || null,
       comprovante_url || null, params.id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await query(`DELETE FROM financeiro.tbContasPagar WHERE conta_pagar_id=?`, [params.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
