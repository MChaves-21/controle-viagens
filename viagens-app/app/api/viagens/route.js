import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { podeDefinirStatusViagem } from '@/lib/permissions';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let sql = `
      SELECT v.viagem_id, v.destino, v.objetivo, v.status,
             v.data_ida, v.data_volta, v.valor_adiantamento,
             u.nome as funcionario, u.usuario_id as funcionario_id,
             vt.descricao as tipo, vt.viagem_tipo_id,
             v.observacoes, v.atualizado_em
      FROM viagem.tbViagem v
      LEFT JOIN seguranca.tbUsuarios u ON v.funcionario_id = u.usuario_id
      LEFT JOIN viagem.tbViagemTipo vt ON v.viagem_tipo_id = vt.viagem_tipo_id
      WHERE 1=1
    `;
    const params = [];

    if (status) { sql += ` AND v.status = ?`; params.push(status); }
    if (search) { sql += ` AND (u.nome LIKE ? OR v.destino LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }

    sql += ` ORDER BY v.viagem_id DESC`;

    const rows = await query(sql, params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { funcionario_id, destino, objetivo, data_ida, data_volta,
            viagem_tipo_id, valor_adiantamento, observacoes, status } = body;

    const user = await getSessionUser(req);
    if (!user || !podeDefinirStatusViagem(user.perfil, body.status)) {
      return NextResponse.json({ error: 'Seu perfil não pode definir este status.' }, { status: 403 });
    }

    const result = await query(
      `INSERT INTO viagem.tbViagem
       (funcionario_id, destino, objetivo, data_ida, data_volta,
        viagem_tipo_id, valor_adiantamento, observacoes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [funcionario_id, destino, objetivo, data_ida, data_volta,
       viagem_tipo_id, valor_adiantamento || 0, observacoes, status || 'rascunho']
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
