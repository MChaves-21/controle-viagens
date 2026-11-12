import { describe, it, expect } from 'vitest';
import { signToken, verifyToken, cookieOptions } from '@/lib/auth';

describe('JWT', () => {
  it('assina e valida o token com os dados do usuário', async () => {
    const token = await signToken({ id: 1, nome: 'Ana', perfil: 'gestor' });
    const payload = await verifyToken(token);
    expect(payload).toMatchObject({ id: 1, nome: 'Ana', perfil: 'gestor' });
  });

  it('recusa token adulterado', async () => {
    const token = await signToken({ id: 1, perfil: 'colaborador' });
    const [h, , s] = token.split('.');
    const falso = Buffer.from(JSON.stringify({ id: 1, perfil: 'admin' })).toString('base64url');
    expect(await verifyToken(`${h}.${falso}.${s}`)).toBeNull();
  });

  it('cookie de sessão é httpOnly', () => {
    expect(cookieOptions()).toMatchObject({ httpOnly: true, sameSite: 'lax', path: '/' });
  });
});
