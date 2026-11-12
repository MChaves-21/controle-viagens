import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query(`SELECT * FROM financeiro.tbTipoTitulo ORDER BY descricao`);
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
