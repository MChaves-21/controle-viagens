import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const viagem_id = searchParams.get('viagem_id');
    const search = searchParams.get('search');

    let sql = `
      SELECT c.conta_pagar_id, c.descricao, c.valor, c.data_vencimento,
             c.data_pagamento, c.status, c.observacoes, c.viagem_id,
             c.comprovante_url,
             u.nome as funcionario, u.usuario_id as funcionario_id,
             t.descricao as tipo_titulo, t.tipo_titulo_id,
             v.destino as viagem_destino
      FROM financeiro.tbContasPagar c
      LEFT JOIN seguranca.tbUsuarios u ON c.funcionario_id = u.usuario_id
      LEFT JOIN financeiro.tbTipoTitulo t ON c.tipo_titulo_id = t.tipo_titulo_id
      LEFT JOIN viagem.tbViagem v ON c.viagem_id = v.viagem_id
      WHERE 1=1
    `;
    const params = [];

    if (status) { sql += ` AND c.status = ?`; params.push(status); }
    if (viagem_id) { sql += ` AND c.viagem_id = ?`; params.push(viagem_id); }
    if (search) { sql += ` AND (u.nome LIKE ? OR c.descricao LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }

    sql += ` ORDER BY c.conta_pagar_id DESC`;

    const rows = await query(sql, params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { funcionario_id, viagem_id, descricao, valor, data_vencimento,
            data_pagamento, status, tipo_titulo_id, observacoes, comprovante_url } = body;

    const result = await query(
      `INSERT INTO financeiro.tbContasPagar
       (funcionario_id, viagem_id, descricao, valor, data_vencimento,
        data_pagamento, status, tipo_titulo_id, observacoes, comprovante_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [funcionario_id, viagem_id || null, descricao, valor,
       data_vencimento || null, data_pagamento || null,
       status || 'pendente', tipo_titulo_id || null, observacoes || null,
       comprovante_url || null]
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
