import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
    try {
        const db = await getConnection();

        // Busca as viagens com JOIN para pegar a descrição do tipo e o nome do responsável
        const [viagens] = await db.query(`
      SELECT 
        v.viagem_id, 
        DATE_FORMAT(v.data_ida, '%d/%m/%Y') as data_ida, 
        DATE_FORMAT(v.data_volta, '%d/%m/%Y') as data_volta, 
        vt.descricao as tipo_viagem, 
        u.nome as responsavel
      FROM tbViagem v
      JOIN tbViagemTipo vt ON v.viagem_tipo_id = vt.viagem_tipo_id
      JOIN tbUsuarios u ON v.atualizado_por = u.usuario_id
      ORDER BY v.atualizado_em DESC
    `);

        // Busca os tipos de viagem para popular o select do formulário
        const [tipos] = await db.query('SELECT * FROM tbViagemTipo');

        return NextResponse.json({ viagens, tipos });
    } catch (error) {
        console.error('Erro no banco:', error);
        return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { data_ida, data_volta, viagem_tipo_id, atualizado_por } = body;

        const db = await getConnection();
        const [result] = await db.query(
            `INSERT INTO tbViagem (data_ida, data_volta, viagem_tipo_id, atualizado_por) 
       VALUES (?, ?, ?, ?)`,
            [data_ida, data_volta, viagem_tipo_id, atualizado_por]
        );

        return NextResponse.json({ id: result.insertId, message: 'Viagem registrada!' }, { status: 201 });
    } catch (error) {
        console.error('Erro ao inserir:', error);
        return NextResponse.json({ error: 'Erro ao registrar viagem' }, { status: 500 });
    }
}