'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, X, Receipt } from 'lucide-react';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';
const fmtCur = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const toInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';

const statusMap = {
  pendente: { label: 'Pendente', cls: 'badge-pendente' },
  aprovado: { label: 'Aprovado', cls: 'badge-aprovado' },
  pago: { label: 'Pago', cls: 'badge-pago' },
  rejeitado: { label: 'Rejeitado', cls: 'badge-rejeitado' },
};

const EMPTY = {
  funcionario_id: '', viagem_id: '', descricao: '', valor: '',
  data_vencimento: '', data_pagamento: '', status: 'pendente',
  tipo_titulo_id: '', observacoes: '', comprovante_url: '',
};

export default function DespesasPage() {
  const [despesas, setDespesas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [viagens, setViagens] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadDespesas = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (search) params.set('search', search);
    const r = await fetch(`/api/despesas?${params}`);
    const d = await r.json();
    setDespesas(Array.isArray(d) ? d : []);
    setLoading(false);
  }, [filterStatus, search]);

  useEffect(() => { loadDespesas(); }, [loadDespesas]);

  useEffect(() => {
    fetch('/api/usuarios').then(r => r.json()).then(d => setUsuarios(Array.isArray(d) ? d : []));
    fetch('/api/viagens').then(r => r.json()).then(d => setViagens(Array.isArray(d) ? d : []));
    fetch('/api/tipos-titulo').then(r => r.json()).then(d => setTipos(Array.isArray(d) ? d : []));
  }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (d) => {
    setEditing(d.conta_pagar_id);
    setForm({
      funcionario_id: d.funcionario_id || '',
      viagem_id: d.viagem_id || '',
      descricao: d.descricao || '',
      valor: d.valor || '',
      data_vencimento: toInput(d.data_vencimento),
      data_pagamento: toInput(d.data_pagamento),
      status: d.status || 'pendente',
      tipo_titulo_id: d.tipo_titulo_id || '',
      observacoes: d.observacoes || '',
      comprovante_url: d.comprovante_url || '',
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.funcionario_id || !form.descricao || !form.valor) {
      showToast('Preencha os campos obrigatórios', 'error'); return;
    }
    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/despesas/${editing}` : '/api/despesas';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    if (r.ok) {
      setModal(false);
      showToast(editing ? 'Despesa atualizada!' : 'Despesa cadastrada!');
      loadDespesas();
    } else {
      const err = await r.json();
      showToast(err.error || 'Erro ao salvar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta despesa?')) return;
    const r = await fetch(`/api/despesas/${id}`, { method: 'DELETE' });
    if (r.ok) { showToast('Despesa excluída'); loadDespesas(); }
    else showToast('Erro ao excluir', 'error');
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const totalFiltrado = despesas.reduce((s, d) => s + parseFloat(d.valor || 0), 0);

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
            Despesas
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Controle de despesas de viagens corporativas
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nova Despesa
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        {[
          { label: 'Total Filtrado', value: fmtCur(totalFiltrado), color: '#0f172a' },
          { label: 'Pendentes', value: despesas.filter(d => d.status === 'pendente').length, color: '#92400e' },
          { label: 'Aprovados', value: despesas.filter(d => d.status === 'aprovado').length, color: '#065f46' },
          { label: 'Pagos', value: despesas.filter(d => d.status === 'pago').length, color: '#1e40af' },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>{c.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="form-input" style={{ paddingLeft: 34 }}
            placeholder="Buscar por funcionário ou descrição..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="form-input" style={{ width: 180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Funcionário</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Viagem</th>
              <th>Vencimento</th>
              <th>Pagamento</th>
              <th>Valor</th>
              <th>Status</th>
              <th style={{ width: 80 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Carregando...</td></tr>
            ) : despesas.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                <Receipt size={32} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.3 }} />
                Nenhuma despesa encontrada
              </td></tr>
            ) : despesas.map(d => (
              <tr key={d.conta_pagar_id}>
                <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{d.conta_pagar_id}</td>
                <td style={{ fontWeight: 500 }}>{d.funcionario || '-'}</td>
                <td style={{ color: '#475569', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.descricao || '-'}</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{d.tipo_titulo || '-'}</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{d.viagem_destino || '-'}</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{fmtDate(d.data_vencimento)}</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{fmtDate(d.data_pagamento)}</td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{fmtCur(d.valor)}</td>
                <td>
                  <span className={`badge ${statusMap[d.status]?.cls || 'badge-pendente'}`}>
                    {statusMap[d.status]?.label || d.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(d)} style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, background: 'white', cursor: 'pointer', color: '#475569' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(d.conta_pagar_id)} style={{ padding: '5px 8px', border: 'none', borderRadius: 6, background: '#fee2e2', cursor: 'pointer', color: '#991b1b' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>
                {editing ? 'Editar Despesa' : 'Nova Despesa'}
              </div>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Funcionário *</label>
                  <select className="form-input" value={form.funcionario_id} onChange={e => set('funcionario_id', e.target.value)}>
                    <option value="">Selecione...</option>
                    {usuarios.map(u => <option key={u.usuario_id} value={u.usuario_id}>{u.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Viagem (opcional)</label>
                  <select className="form-input" value={form.viagem_id} onChange={e => set('viagem_id', e.target.value)}>
                    <option value="">Sem vínculo</option>
                    {viagens.map(v => <option key={v.viagem_id} value={v.viagem_id}>#{v.viagem_id} — {v.destino}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Descrição *</label>
                  <input className="form-input" value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descreva a despesa" />
                </div>
                <div>
                  <label className="form-label">Valor (R$) *</label>
                  <input className="form-input" type="number" step="0.01" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="0,00" />
                </div>
                <div>
                  <label className="form-label">Categoria</label>
                  <select className="form-input" value={form.tipo_titulo_id} onChange={e => set('tipo_titulo_id', e.target.value)}>
                    <option value="">Selecione...</option>
                    {tipos.map(t => <option key={t.tipo_titulo_id} value={t.tipo_titulo_id}>{t.descricao}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Data Vencimento</label>
                  <input className="form-input" type="date" value={form.data_vencimento} onChange={e => set('data_vencimento', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Data Pagamento</label>
                  <input className="form-input" type="date" value={form.data_pagamento} onChange={e => set('data_pagamento', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                    {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">URL do Comprovante</label>
                  <input className="form-input" value={form.comprovante_url} onChange={e => set('comprovante_url', e.target.value)} placeholder="https://..." />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Observações</label>
                  <textarea className="form-input" rows={3} value={form.observacoes} onChange={e => set('observacoes', e.target.value)} placeholder="Observações adicionais..." style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : (editing ? 'Salvar Alterações' : 'Cadastrar Despesa')}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
