import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, isHashed } from '@/lib/password';

describe('senhas', () => {
  it('gera hash bcrypt e nunca guarda o texto puro', async () => {
    const hash = await hashPassword('minhaSenha123');
    expect(isHashed(hash)).toBe(true);
    expect(hash).not.toContain('minhaSenha123');
  });

  it('confere a senha certa e recusa a errada', async () => {
    const hash = await hashPassword('minhaSenha123');
    expect(await verifyPassword('minhaSenha123', hash)).toEqual({ ok: true, needsRehash: false });
    expect((await verifyPassword('outra', hash)).ok).toBe(false);
  });

  it('aceita senha legada em texto puro e pede para virar hash', async () => {
    expect(await verifyPassword('antiga', 'antiga')).toEqual({ ok: true, needsRehash: true });
    expect(await verifyPassword('errada', 'antiga')).toEqual({ ok: false, needsRehash: false });
  });

  it('recusa quando não há senha salva', async () => {
    expect((await verifyPassword('qualquer', null)).ok).toBe(false);
  });
});
