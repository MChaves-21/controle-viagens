'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Users, Shield } from 'lucide-react';

const perfilMap = {
  admin: { label: 'Administrador', color: '#991b1b', bg: '#fee2e2' },
  gestor: { label: 'Gestor', color: '#1e40af', bg: '#dbeafe' },
  financeiro: { label: 'Financeiro', color: '#065f46', bg: '#d1fae5' },
  colaborador: { label: 'Colaborador', color: '#475569', bg: '#f1f5f9' },
};

const EMPTY = { nome: '', login: '', senha: '', perfil: 'colaborador', ativo: true };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/usuarios');
    const d = await r.json();
    setUsuarios(Array.isArray(d) ? d : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (u) => {
    setEditing(u.usuario_id);
    setForm({ nome: u.nome, login: u.login, senha: '', perfil: u.perfil, ativo: !!u.ativo });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.nome || !form.login || (!editing && !form.senha)) {
      showToast('Preencha os campos obrigatórios', 'error'); return;
    }
    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/usuarios/${editing}` : '/api/usuarios';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    if (r.ok) {
      setModal(false);
      showToast(editing ? 'Usuário atualizado!' : 'Usuário cadastrado!');
      load();
    } else {
      const err = await r.json();
      showToast(err.error || 'Erro ao salvar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Desativar este usuário?')) return;
    const r = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    if (r.ok) { showToast('Usuário desativado'); load(); }
    else showToast('Erro', 'error');
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
            Usuários
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Gerencie os usuários do sistema
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        {Object.entries(perfilMap).map(([k, { label, color, bg }]) => (
          <div key={k} className="card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem', color }}>
              {usuarios.filter(u => u.perfil === k).length}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Login</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Atualizado em</th>
              <th style={{ width: 80 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Carregando...</td></tr>
            ) : usuarios.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                <Users size={32} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.3 }} />
                Nenhum usuário encontrado
              </td></tr>
            ) : usuarios.map(u => {
              const perfil = perfilMap[u.perfil] || perfilMap.colaborador;
              return (
                <tr key={u.usuario_id}>
                  <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{u.usuario_id}</td>
                  <td style={{ fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                        {u.nome?.charAt(0)?.toUpperCase()}
                      </div>
                      {u.nome}
                    </div>
                  </td>
                  <td style={{ color: '#475569', fontFamily: 'monospace', fontSize: '0.85rem' }}>{u.login}</td>
                  <td>
                    <span style={{ background: perfil.bg, color: perfil.color, padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>
                      {perfil.label}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: u.ativo ? '#d1fae5' : '#fee2e2', color: u.ativo ? '#065f46' : '#991b1b', padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {u.atualizado_em ? new Date(u.atualizado_em).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(u)} style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, background: 'white', cursor: 'pointer', color: '#475569' }}>
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(u.usuario_id)} style={{ padding: '5px 8px', border: 'none', borderRadius: 6, background: '#fee2e2', cursor: 'pointer', color: '#991b1b' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>
                {editing ? 'Editar Usuário' : 'Novo Usuário'}
              </div>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Nome Completo *</label>
                  <input className="form-input" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do usuário" />
                </div>
                <div>
                  <label className="form-label">Login *</label>
                  <input className="form-input" value={form.login} onChange={e => set('login', e.target.value)} placeholder="usuario" />
                </div>
                <div>
                  <label className="form-label">Senha {editing ? '(deixe em branco p/ manter)' : '*'}</label>
                  <input className="form-input" type="password" value={form.senha} onChange={e => set('senha', e.target.value)} placeholder="••••••••" />
                </div>
                <div>
                  <label className="form-label">Perfil</label>
                  <select className="form-input" value={form.perfil} onChange={e => set('perfil', e.target.value)}>
                    {Object.entries(perfilMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: '1.5rem' }}>
                  <input type="checkbox" id="ativo" checked={form.ativo} onChange={e => set('ativo', e.target.checked)} style={{ width: 16, height: 16 }} />
                  <label htmlFor="ativo" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>Usuário ativo</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : (editing ? 'Salvar Alterações' : 'Cadastrar')}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
