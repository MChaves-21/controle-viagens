'use client';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Download, BarChart3 } from 'lucide-react';

const COLORS = ['#3b82f6', '#0f1e3c', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function RelatoriosPage() {
  const [data, setData] = useState(null);
  const [viagens, setViagens] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard-stats').then(r => r.json()),
      fetch('/api/viagens').then(r => r.json()),
      fetch('/api/despesas').then(r => r.json()),
    ]).then(([stats, v, d]) => {
      setData(stats);
      setViagens(Array.isArray(v) ? v : []);
      setDespesas(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, []);

  const statusViagem = ['rascunho', 'pendente', 'aprovada', 'rejeitada', 'concluida'].map(s => ({
    status: s.charAt(0).toUpperCase() + s.slice(1),
    total: viagens.filter(v => v.status === s).length,
  }));

  const statusDespesa = ['pendente', 'aprovado', 'pago', 'rejeitado'].map(s => ({
    status: s.charAt(0).toUpperCase() + s.slice(1),
    total: despesas.filter(d => d.status === s).length,
    valor: despesas.filter(d => d.status === s).reduce((a, d) => a + parseFloat(d.valor || 0), 0),
  }));

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Funcionário', 'Destino', 'Tipo', 'Data Ida', 'Data Volta', 'Status', 'Adiantamento'],
      ...viagens.map(v => [v.viagem_id, v.funcionario, v.destino, v.tipo, v.data_ida, v.data_volta, v.status, v.valor_adiantamento])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'viagens.csv'; a.click();
  };

  const handleExportDespesasCSV = () => {
    const rows = [
      ['ID', 'Funcionário', 'Descrição', 'Categoria', 'Valor', 'Vencimento', 'Pagamento', 'Status'],
      ...despesas.map(d => [d.conta_pagar_id, d.funcionario, d.descricao, d.tipo_titulo, d.valor, d.data_vencimento, d.data_pagamento, d.status])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'despesas.csv'; a.click();
  };

  if (loading) return (
    <div style={{ padding: '2rem', color: '#94a3b8', textAlign: 'center', marginTop: '4rem' }}>
      Carregando relatórios...
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
            Relatórios
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Análise e exportação de dados
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} /> Exportar Viagens
          </button>
          <button className="btn-secondary" onClick={handleExportDespesasCSV}>
            <Download size={15} /> Exportar Despesas
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Gasto em Despesas', value: fmt(despesas.reduce((a, d) => a + parseFloat(d.valor || 0), 0)), sub: `${despesas.length} registros` },
          { label: 'Total de Viagens', value: viagens.length, sub: `${viagens.filter(v => v.status === 'aprovada').length} aprovadas` },
          { label: 'Média por Despesa', value: fmt(despesas.length ? despesas.reduce((a, d) => a + parseFloat(d.valor || 0), 0) / despesas.length : 0), sub: 'Valor médio' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>{k.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#0f172a' }}>{k.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Status Viagens */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: '#0f172a' }}>
            Viagens por Status
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusViagem} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="total" fill="#0f1e3c" radius={[4, 4, 0, 0]} name="Viagens" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Despesas valor */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: '#0f172a' }}>
            Valor por Status de Despesa
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusDespesa} margin={{ left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `R$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
              <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="valor" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1rem' }}>
        {/* Despesas por mês */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: '#0f172a' }}>
            Evolução de Despesas (Mensal)
          </div>
          {data?.despesasMes?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.despesasMes} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `R$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Sem dados suficientes
            </div>
          )}
        </div>

        {/* Por categoria */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: '#0f172a' }}>
            Despesas por Categoria
          </div>
          {data?.despesasTipo?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.despesasTipo} dataKey="total" nameKey="tipo"
                  cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                  {data.despesasTipo.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: '0.72rem', color: '#475569' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Sem dados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
