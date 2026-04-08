'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Plane, Receipt, Users, BarChart3,
  ChevronRight, Briefcase, LogOut, ChevronDown
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/viagens', label: 'Viagens', icon: Plane },
  { href: '/despesas', label: 'Despesas', icon: Receipt },
  { href: '/usuarios', label: 'Usuários', icon: Users },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
];

const perfilLabel = {
  admin: 'Administrador',
  gestor: 'Gestor',
  financeiro: 'Financeiro',
  colaborador: 'Colaborador',
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/login';

  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isLogin) return;
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => {});
  }, [isLogin, pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  // Login page: render without sidebar
  if (isLogin) {
    return (
      <html lang="pt-BR">
        <head>
          <title>ViagemPro — Login</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>{children}</body>
      </html>
    );
  }

  const initials = user?.nome
    ? user.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <html lang="pt-BR">
      <head>
        <title>ViagemPro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside style={{
            width: 240,
            flexShrink: 0,
            background: 'linear-gradient(180deg, #0f1e3c 0%, #1a2f54 100%)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            zIndex: 40,
          }}>
            {/* Logo */}
            <div style={{ padding: '1.5rem 1rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                }}>
                  <Briefcase size={18} color="white" />
                </div>
                <div>
                  <div style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
                    ViagemPro
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                    Gestão de Despesas
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.25rem 1rem 0.5rem' }} />

            {/* Nav */}
            <nav style={{ flex: 1, padding: '0.5rem 0.75rem', overflowY: 'auto' }} className="sidebar-scroll">
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', padding: '0.5rem 0.5rem 0.25rem', textTransform: 'uppercase' }}>
                Menu Principal
              </div>
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-item ${pathname === href ? 'active' : ''}`}
                >
                  <Icon className="icon" />
                  {label}
                  {pathname === href && (
                    <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                  )}
                </Link>
              ))}
            </nav>

            {/* User + Logout */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'white',
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.nome || '...'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>
                    {perfilLabel[user?.perfil] || user?.perfil || ''}
                  </div>
                </div>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  title="Sair"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: 7,
                    width: 30, height: 30,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.55)',
                    flexShrink: 0,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; e.currentTarget.style.color = '#fca5a5'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', background: '#f1f5f9' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
