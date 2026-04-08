'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, X, ChevronDown, Plane } from 'lucide-react';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';
const fmtCur = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const toInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';

const statusMap = {
  rascunho: { label: 'Rascunho', cls: 'badge-rascunho' },
  pendente: { label: 'Pendente', cls: 'badge-pendente' },
  aprovada: { label: 'Aprovada', cls: 'badge-aprovada' },
  rejeitada: { label: 'Rejeitada', cls: 'badge-rejeitada' },
  concluida: { label: 'Concluída', cls: 'badge-concluida' },
};

const EMPTY = {
  funcionario_id: '', destino: '', objetivo: '', data_ida: '', data_volta: '',
  viagem_tipo_id: '', valor_adiantamento: '', observacoes: '', status: 'rascunho',
};

export default function ViagensPage() {
  const [viagens, setViagens] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
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

  const loadViagens = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (search) params.set('search', search);
    const r = await fetch(`/api/viagens?${params}`);
    const d = await r.json();
    setViagens(Array.isArray(d) ? d : []);
    setLoading(false);
  }, [filterStatus, search]);

  useEffect(() => { loadViagens(); }, [loadViagens]);

  useEffect(() => {
    fetch('/api/usuarios').then(r => r.json()).then(d => setUsuarios(Array.isArray(d) ? d : []));
    fetch('/api/tipos-viagem').then(r => r.json()).then(d => setTipos(Array.isArray(d) ? d : []));
  }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (v) => {
    setEditing(v.viagem_id);
    setForm({
      funcionario_id: v.funcionario_id || '',
      destino: v.destino || '',
      objetivo: v.objetivo || '',
      data_ida: toInput(v.data_ida),
      data_volta: toInput(v.data_volta),
      viagem_tipo_id: v.viagem_tipo_id || '',
      valor_adiantamento: v.valor_adiantamento || '',
      observacoes: v.observacoes || '',
      status: v.status || 'rascunho',
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.funcionario_id || !form.destino || !form.data_ida || !form.data_volta) {
      showToast('Preencha os campos obrigatórios', 'error'); return;
    }
    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/viagens/${editing}` : '/api/viagens';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    if (r.ok) {
      setModal(false);
      showToast(editing ? 'Viagem atualizada!' : 'Viagem cadastrada!');
      loadViagens();
    } else {
      const err = await r.json();
      showToast(err.error || 'Erro ao salvar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta viagem?')) return;
    const r = await fetch(`/api/viagens/${id}`, { method: 'DELETE' });
    if (r.ok) { showToast('Viagem excluída'); loadViagens(); }
    else showToast('Erro ao excluir', 'error');
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
            Viagens
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Gerencie as viagens de negócios
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nova Viagem
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 34 }}
            placeholder="Buscar por funcionário ou destino..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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
              <th>Destino</th>
              <th>Tipo</th>
              <th>Ida</th>
              <th>Volta</th>
              <th>Adiantamento</th>
              <th>Status</th>
              <th style={{ width: 80 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Carregando...</td></tr>
            ) : viagens.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                <Plane size={32} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.3 }} />
                Nenhuma viagem encontrada
              </td></tr>
            ) : viagens.map(v => (
              <tr key={v.viagem_id}>
                <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{v.viagem_id}</td>
                <td style={{ fontWeight: 500 }}>{v.funcionario || '-'}</td>
                <td style={{ color: '#475569' }}>{v.destino || '-'}</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{v.tipo || '-'}</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{fmtDate(v.data_ida)}</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{fmtDate(v.data_volta)}</td>
                <td style={{ fontWeight: 500, color: '#1e40af' }}>{fmtCur(v.valor_adiantamento)}</td>
                <td>
                  <span className={`badge ${statusMap[v.status]?.cls || 'badge-rascunho'}`}>
                    {statusMap[v.status]?.label || v.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(v)} style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, background: 'white', cursor: 'pointer', color: '#475569' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(v.viagem_id)} style={{ padding: '5px 8px', border: 'none', borderRadius: 6, background: '#fee2e2', cursor: 'pointer', color: '#991b1b' }}>
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
                {editing ? 'Editar Viagem' : 'Nova Viagem'}
              </div>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Funcionário *</label>
                  <select className="form-input" value={form.funcionario_id} onChange={e => set('funcionario_id', e.target.value)}>
                    <option value="">Selecione...</option>
                    {usuarios.map(u => <option key={u.usuario_id} value={u.usuario_id}>{u.nome}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Destino *</label>
                  <input className="form-input" value={form.destino} onChange={e => set('destino', e.target.value)} placeholder="Ex: São Paulo, SP" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Objetivo</label>
                  <input className="form-input" value={form.objetivo} onChange={e => set('objetivo', e.target.value)} placeholder="Descreva o objetivo da viagem" />
                </div>
                <div>
                  <label className="form-label">Data de Ida *</label>
                  <input className="form-input" type="date" value={form.data_ida} onChange={e => set('data_ida', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Data de Volta *</label>
                  <input className="form-input" type="date" value={form.data_volta} onChange={e => set('data_volta', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Tipo de Viagem</label>
                  <select className="form-input" value={form.viagem_tipo_id} onChange={e => set('viagem_tipo_id', e.target.value)}>
                    <option value="">Selecione...</option>
                    {tipos.map(t => <option key={t.viagem_tipo_id} value={t.viagem_tipo_id}>{t.descricao}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Adiantamento (R$)</label>
                  <input className="form-input" type="number" step="0.01" value={form.valor_adiantamento} onChange={e => set('valor_adiantamento', e.target.value)} placeholder="0,00" />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                    {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
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
                {saving ? 'Salvando...' : (editing ? 'Salvar Alterações' : 'Cadastrar Viagem')}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
