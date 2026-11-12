import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/demo/route';
import { middleware } from '@/middleware';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

const cookieDe = (res) => res.cookies.get(COOKIE_NAME)?.value;

describe('modo demonstração', () => {
  afterEach(() => { delete process.env.DEMO_MODE; });

  it('abre sessão de visitante sem senha', async () => {
    const res = await POST();
    expect(res.status).toBe(200);
    expect(await verifyToken(cookieDe(res))).toMatchObject({ perfil: 'visitante', nome: 'Visitante' });
  });

  it('pode ser desligado com DEMO_MODE=off', async () => {
    process.env.DEMO_MODE = 'off';
    expect((await POST()).status).toBe(404);
  });

  it('visitante lê, mas o middleware barra alterações', async () => {
    const token = cookieDe(await POST());
    const req = (method) => new NextRequest('http://localhost/api/viagens', {
      method, headers: { cookie: `${COOKIE_NAME}=${token}` },
    });
    expect((await middleware(req('GET'))).status).toBe(200);
    expect((await middleware(req('POST'))).status).toBe(403);
    expect((await middleware(req('DELETE'))).status).toBe(403);
  });

  it('a rota de demonstração é pública', async () => {
    const res = await middleware(new NextRequest('http://localhost/api/auth/demo', { method: 'POST' }));
    expect(res.status).toBe(200);
  });
});
