'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form
  const [loginForm, setLoginForm] = useState({ login: '', senha: '' });
  // Register form
  const [regForm, setRegForm] = useState({ nome: '', login: '', senha: '', confirmarSenha: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginForm.login || !loginForm.senha) { setError('Preencha login e senha.'); return; }
    setLoading(true);
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });
    const data = await r.json();
    setLoading(false);
    if (r.ok) {
      router.push(redirectTo);
      router.refresh();
    } else {
      setError(data.error || 'Erro ao fazer login.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!regForm.nome || !regForm.login || !regForm.senha || !regForm.confirmarSenha) {
      setError('Preencha todos os campos.'); return;
    }
    setLoading(true);
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm),
    });
    const data = await r.json();
    setLoading(false);
    if (r.ok) {
      setSuccess('Cadastro realizado! Faça login para continuar.');
      setRegForm({ nome: '', login: '', senha: '', confirmarSenha: '' });
      setTimeout(() => { setTab('login'); setSuccess(''); }, 2000);
    } else {
      setError(data.error || 'Erro ao cadastrar.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#f1f5f9',
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(155deg, #0f1e3c 0%, #1a2f54 50%, #1e3a6e 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(59,130,246,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -120, left: -60,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(59,130,246,0.05)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '3rem', position: 'relative' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
          }}>
            <Briefcase size={22} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>
              ViagemPro
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 3 }}>
              Gestão de Despesas
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <h1 style={{
            color: 'white',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '2.25rem',
            lineHeight: 1.2,
            margin: '0 0 1rem',
          }}>
            Controle total das suas viagens corporativas
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
            Gerencie reembolsos, despesas e aprovações de forma simples e centralizada.
          </p>

          {/* Feature bullets */}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Aprovação de viagens em tempo real',
              'Categorização automática de despesas',
              'Relatórios e indicadores completos',
            ].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: 440,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'white',
        boxShadow: '-4px 0 40px rgba(0,0,0,0.06)',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            borderRadius: 10,
            padding: 4,
            marginBottom: '2rem',
          }}>
            {[['login', 'Entrar'], ['register', 'Criar conta']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); setSuccess(''); }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  border: 'none',
                  borderRadius: 7,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: tab === key ? 'white' : 'transparent',
                  color: tab === key ? '#0f172a' : '#64748b',
                  boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#0f172a', margin: '0 0 0.25rem' }}>
              {tab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
              {tab === 'login'
                ? 'Entre com suas credenciais para continuar.'
                : 'Preencha os dados para criar sua conta.'}
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} /> {success}
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6, letterSpacing: '0.02em' }}>
                  Login
                </label>
                <input
                  className="form-input"
                  placeholder="seu.login"
                  value={loginForm.login}
                  onChange={e => setLoginForm(f => ({ ...f, login: e.target.value }))}
                  autoComplete="username"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6, letterSpacing: '0.02em' }}>
                  Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.senha}
                    onChange={e => setLoginForm(f => ({ ...f, senha: e.target.value }))}
                    style={{ paddingRight: 42 }}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: loading ? '#94a3b8' : '#0f1e3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 9,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.15s',
                }}
              >
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Entrando...</> : <>Entrar <ArrowRight size={16} /></>}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
                Não tem conta?{' '}
                <button type="button" onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  Cadastre-se
                </button>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Nome Completo
                </label>
                <input
                  className="form-input"
                  placeholder="Seu nome"
                  value={regForm.nome}
                  onChange={e => setRegForm(f => ({ ...f, nome: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Login
                </label>
                <input
                  className="form-input"
                  placeholder="seu.login"
                  value={regForm.login}
                  onChange={e => setRegForm(f => ({ ...f, login: e.target.value }))}
                  autoComplete="username"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={regForm.senha}
                    onChange={e => setRegForm(f => ({ ...f, senha: e.target.value }))}
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Confirmar Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repita a senha"
                    value={regForm.confirmarSenha}
                    onChange={e => setRegForm(f => ({ ...f, confirmarSenha: e.target.value }))}
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: loading ? '#94a3b8' : '#0f1e3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 9,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.15s',
                }}
              >
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Cadastrando...</> : <>Criar conta <ArrowRight size={16} /></>}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
                Já tem conta?{' '}
                <button type="button" onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  Entrar
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
