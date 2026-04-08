'use client';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Plane, Receipt, Clock, DollarSign, Users,
  TrendingUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const COLORS = ['#3b82f6', '#0f1e3c', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

const statusMap = {
  rascunho: { label: 'Rascunho', cls: 'badge-rascunho' },
  pendente: { label: 'Pendente', cls: 'badge-pendente' },
  aprovada: { label: 'Aprovada', cls: 'badge-aprovada' },
  rejeitada: { label: 'Rejeitada', cls: 'badge-rejeitada' },
  concluida: { label: 'Concluída', cls: 'badge-concluida' },
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard-stats')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
        Carregando dashboard...
      </div>
    </div>
  );

  const cards = data?.cards || {};

  const statCards = [
    { label: 'Total de Viagens', value: cards.totalViagens || 0, icon: Plane, color: '#3b82f6', bg: '#eff6ff', fmt: v => v },
    { label: 'Total de Despesas', value: cards.totalDespesas || 0, icon: Receipt, color: '#10b981', bg: '#ecfdf5', fmt: fmt },
    { label: 'Aguardando Aprovação', value: cards.pendentes || 0, icon: Clock, color: '#f59e0b', bg: '#fffbeb', fmt: v => v },
    { label: 'A Reembolsar', value: cards.aReembolsar || 0, icon: DollarSign, color: '#8b5cf6', bg: '#f5f3ff', fmt: fmt },
    { label: 'Usuários Ativos', value: cards.totalUsuarios || 0, icon: Users, color: '#ef4444', bg: '#fef2f2', fmt: v => v },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          Visão geral do sistema de gestão de viagens
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {statCards.map(({ label, value, icon: Icon, color, bg, fmt: f }) => (
          <div key={label} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <TrendingUp size={14} color="#94a3b8" />
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#0f172a' }}>
              {f(value)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Bar chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              Despesas por Mês
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Últimos 6 meses</div>
          </div>
          {data?.despesasMes?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.despesasMes} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `R$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                <Tooltip formatter={v => fmt(v)} labelStyle={{ fontWeight: 600 }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              Por Categoria
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Despesas por tipo</div>
          </div>
          {data?.despesasTipo?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.despesasTipo} dataKey="total" nameKey="tipo"
                  cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                  {data.despesasTipo.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => fmt(v)}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: '0.75rem', color: '#475569' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              Nenhum dado disponível
            </div>
          )}
        </div>
      </div>

      {/* Últimas viagens */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              Últimas Viagens
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>5 mais recentes</div>
          </div>
          <a href="/viagens" style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}>
            Ver todas →
          </a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Destino</th>
                <th>Tipo</th>
                <th>Data Ida</th>
                <th>Data Volta</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.ultimasViagens?.length > 0 ? data.ultimasViagens.map(v => (
                <tr key={v.viagem_id}>
                  <td style={{ fontWeight: 500 }}>{v.funcionario || '-'}</td>
                  <td style={{ color: '#475569' }}>{v.destino || '-'}</td>
                  <td style={{ color: '#475569' }}>{v.tipo || '-'}</td>
                  <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{fmtDate(v.data_ida)}</td>
                  <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{fmtDate(v.data_volta)}</td>
                  <td>
                    <span className={`badge ${statusMap[v.status]?.cls || 'badge-rascunho'}`}>
                      {statusMap[v.status]?.label || v.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                    Nenhuma viagem cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
