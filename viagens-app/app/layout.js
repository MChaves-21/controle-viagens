'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Plane, Receipt, Users, BarChart3,
  CreditCard, Settings, ChevronRight, Briefcase
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/viagens', label: 'Viagens', icon: Plane },
  { href: '/despesas', label: 'Despesas', icon: Receipt },
  { href: '/usuarios', label: 'Usuários', icon: Users },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="pt-BR">
      <head>
        <title>Gestão de Viagens</title>
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
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 40,
          }}>
            {/* Logo */}
            <div style={{ padding: '1.5rem 1rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.25rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Briefcase size={18} color="white" />
                </div>
                <div>
                  <div style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
                    ViagemPro
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>
                    Gestão de Despesas
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.5rem 1rem' }} />

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

            {/* Bottom */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Users size={15} color="rgba(255,255,255,0.7)" />
                </div>
                <div>
                  <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Administrador</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>admin</div>
                </div>
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
