import { describe, it, expect } from 'vitest';
import {
  podeAcessarApi, podeDefinirStatusViagem, podeDefinirStatusDespesa, podeVerPagina,
} from '@/lib/permissions';

describe('podeAcessarApi', () => {
  it('só o admin cria, edita ou exclui usuários', () => {
    for (const method of ['POST', 'PUT', 'DELETE']) {
      expect(podeAcessarApi('admin', method, '/api/usuarios')).toBe(true);
      expect(podeAcessarApi('admin', method, '/api/usuarios/7')).toBe(true);
      for (const perfil of ['gestor', 'financeiro', 'colaborador']) {
        expect(podeAcessarApi(perfil, method, '/api/usuarios/7')).toBe(false);
      }
    }
  });

  it('todos os perfis listam usuários (usado nos seletores)', () => {
    for (const perfil of ['admin', 'gestor', 'financeiro', 'colaborador']) {
      expect(podeAcessarApi(perfil, 'GET', '/api/usuarios')).toBe(true);
    }
  });

  it('perfil desconhecido não acessa nada', () => {
    expect(podeAcessarApi('hacker', 'GET', '/api/viagens')).toBe(false);
    expect(podeAcessarApi(undefined, 'GET', '/api/viagens')).toBe(false);
  });

  it('demais rotas ficam abertas para perfis válidos', () => {
    expect(podeAcessarApi('colaborador', 'POST', '/api/viagens')).toBe(true);
    expect(podeAcessarApi('financeiro', 'GET', '/api/dashboard-stats')).toBe(true);
  });
});

describe('podeDefinirStatusViagem', () => {
  it('colaborador cria rascunho e envia para aprovação', () => {
    expect(podeDefinirStatusViagem('colaborador', 'rascunho')).toBe(true);
    expect(podeDefinirStatusViagem('colaborador', 'pendente')).toBe(true);
  });

  it('colaborador não aprova nem rejeita a própria viagem', () => {
    expect(podeDefinirStatusViagem('colaborador', 'aprovada')).toBe(false);
    expect(podeDefinirStatusViagem('colaborador', 'rejeitada')).toBe(false);
  });

  it('gestor e admin aprovam; financeiro conclui', () => {
    expect(podeDefinirStatusViagem('gestor', 'aprovada')).toBe(true);
    expect(podeDefinirStatusViagem('admin', 'rejeitada')).toBe(true);
    expect(podeDefinirStatusViagem('financeiro', 'aprovada')).toBe(false);
    expect(podeDefinirStatusViagem('financeiro', 'concluida')).toBe(true);
  });

  it('sem status usa o padrão do banco; status inválido é negado', () => {
    expect(podeDefinirStatusViagem('colaborador', undefined)).toBe(true);
    expect(podeDefinirStatusViagem('admin', 'inexistente')).toBe(false);
  });
});

describe('podeDefinirStatusDespesa', () => {
  it('só financeiro e admin marcam como pago', () => {
    expect(podeDefinirStatusDespesa('financeiro', 'pago')).toBe(true);
    expect(podeDefinirStatusDespesa('admin', 'pago')).toBe(true);
    expect(podeDefinirStatusDespesa('gestor', 'pago')).toBe(false);
    expect(podeDefinirStatusDespesa('colaborador', 'pago')).toBe(false);
  });

  it('gestor aprova despesa; colaborador só lança pendente', () => {
    expect(podeDefinirStatusDespesa('gestor', 'aprovado')).toBe(true);
    expect(podeDefinirStatusDespesa('colaborador', 'aprovado')).toBe(false);
    expect(podeDefinirStatusDespesa('colaborador', 'pendente')).toBe(true);
  });
});

describe('podeVerPagina', () => {
  it('só o admin vê a página de usuários', () => {
    expect(podeVerPagina('admin', '/usuarios')).toBe(true);
    expect(podeVerPagina('gestor', '/usuarios')).toBe(false);
    expect(podeVerPagina('colaborador', '/viagens')).toBe(true);
  });
});

describe('visitante (modo demonstração)', () => {
  it('lê tudo', () => {
    for (const path of ['/api/viagens', '/api/despesas', '/api/dashboard-stats']) {
      expect(podeAcessarApi('visitante', 'GET', path)).toBe(true);
    }
  });

  it('não vê a lista de usuários (logins reais)', () => {
    expect(podeAcessarApi('visitante', 'GET', '/api/usuarios')).toBe(false);
  });

  it('não cria, edita nem apaga nada', () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      expect(podeAcessarApi('visitante', method, '/api/viagens')).toBe(false);
      expect(podeAcessarApi('visitante', method, '/api/despesas/3')).toBe(false);
    }
  });

  it('não vê a página de usuários nem define status', () => {
    expect(podeVerPagina('visitante', '/usuarios')).toBe(false);
    expect(podeVerPagina('visitante', '/viagens')).toBe(true);
    expect(podeDefinirStatusViagem('visitante', 'rascunho')).toBe(false);
    expect(podeDefinirStatusDespesa('visitante', 'pendente')).toBe(false);
  });
});
