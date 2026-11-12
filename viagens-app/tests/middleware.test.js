import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { signToken, COOKIE_NAME } from '@/lib/auth';

async function req(path, { method = 'GET', perfil } = {}) {
  const headers = {};
  if (perfil) headers.cookie = `${COOKIE_NAME}=${await signToken({ id: 1, nome: 'Teste', perfil })}`;
  return new NextRequest(`http://localhost${path}`, { method, headers });
}

describe('middleware', () => {
  it('manda para o login quem não está logado', async () => {
    const res = await middleware(await req('/viagens'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login?redirect=%2Fviagens');
  });

  it('deixa a tela de login aberta', async () => {
    const res = await middleware(await req('/login'));
    expect(res.status).toBe(200);
  });

  it('bloqueia colaborador criando usuário pela API', async () => {
    const res = await middleware(await req('/api/usuarios', { method: 'POST', perfil: 'colaborador' }));
    expect(res.status).toBe(403);
  });

  it('deixa o admin criar usuário', async () => {
    const res = await middleware(await req('/api/usuarios', { method: 'POST', perfil: 'admin' }));
    expect(res.status).toBe(200);
  });

  it('tira quem não é admin da página de usuários', async () => {
    const res = await middleware(await req('/usuarios', { perfil: 'gestor' }));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get('location')).pathname).toBe('/');
  });
});
