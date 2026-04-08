import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [totalViagens] = await query(
      `SELECT COUNT(*) as total FROM viagem.tbViagem`
    );
    const [totalDespesas] = await query(
      `SELECT COUNT(*) as total, COALESCE(SUM(valor),0) as soma FROM financeiro.tbContasPagar`
    );
    const [pendentes] = await query(
      `SELECT COUNT(*) as total FROM viagem.tbViagem WHERE status='pendente'`
    );
    const [aReembolsar] = await query(
      `SELECT COALESCE(SUM(valor),0) as soma FROM financeiro.tbContasPagar WHERE status='aprovado'`
    );
    const [totalUsuarios] = await query(
      `SELECT COUNT(*) as total FROM seguranca.tbUsuarios WHERE ativo=1`
    );

    // Despesas por mês (últimos 6 meses)
    const despesasMes = await query(`
      SELECT 
        DATE_FORMAT(STR_TO_DATE(CONCAT(YEAR(CURDATE()),'-',LPAD(MONTH(data_vencimento),2,'0'),'-01'),'%Y-%m-%d'),'%b') as mes,
        MONTH(data_vencimento) as mes_num,
        COALESCE(SUM(valor),0) as total
      FROM financeiro.tbContasPagar
      WHERE data_vencimento >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY MONTH(data_vencimento), YEAR(data_vencimento)
      ORDER BY YEAR(data_vencimento), MONTH(data_vencimento)
    `);

    // Despesas por tipo
    const despesasTipo = await query(`
      SELECT t.descricao as tipo, COALESCE(SUM(c.valor),0) as total
      FROM financeiro.tbContasPagar c
      LEFT JOIN financeiro.tbTipoTitulo t ON c.tipo_titulo_id = t.tipo_titulo_id
      GROUP BY t.tipo_titulo_id, t.descricao
      ORDER BY total DESC
      LIMIT 6
    `);

    // Últimas viagens
    const ultimasViagens = await query(`
      SELECT v.viagem_id, u.nome as funcionario, v.destino, v.status,
             v.data_ida, v.data_volta, vt.descricao as tipo
      FROM viagem.tbViagem v
      LEFT JOIN seguranca.tbUsuarios u ON v.funcionario_id = u.usuario_id
      LEFT JOIN viagem.tbViagemTipo vt ON v.viagem_tipo_id = vt.viagem_tipo_id
      ORDER BY v.viagem_id DESC
      LIMIT 5
    `);

    return NextResponse.json({
      cards: {
        totalViagens: totalViagens.total,
        totalDespesas: parseFloat(totalDespesas.soma),
        pendentes: pendentes.total,
        aReembolsar: parseFloat(aReembolsar.soma),
        totalUsuarios: totalUsuarios.total,
      },
      despesasMes,
      despesasTipo,
      ultimasViagens,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
