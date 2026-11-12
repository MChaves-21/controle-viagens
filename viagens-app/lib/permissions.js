// Regras de acesso por perfil, aplicadas no servidor.
// Ficam aqui, sem dependência do Next.js, para serem testadas isoladamente.

export const PERFIS = ['admin', 'gestor', 'financeiro', 'colaborador'];

// Quem pode levar uma viagem para cada status
const STATUS_VIAGEM = {
  rascunho: PERFIS,
  pendente: PERFIS,
  aprovada: ['admin', 'gestor'],
  rejeitada: ['admin', 'gestor'],
  concluida: ['admin', 'gestor', 'financeiro'],
};

// Quem pode levar uma despesa para cada status
const STATUS_DESPESA = {
  pendente: PERFIS,
  aprovado: ['admin', 'gestor'],
  rejeitado: ['admin', 'gestor'],
  pago: ['admin', 'financeiro'],
};

const MUTATING = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function podeDefinirStatusViagem(perfil, status) {
  if (!status) return true; // sem status, o banco usa o padrão (rascunho)
  return (STATUS_VIAGEM[status] || []).includes(perfil);
}

export function podeDefinirStatusDespesa(perfil, status) {
  if (!status) return true; // sem status, o banco usa o padrão (pendente)
  return (STATUS_DESPESA[status] || []).includes(perfil);
}

// Acesso às rotas de API por perfil, checado no middleware.
// Retorna true quando o perfil pode chamar o método na rota.
export function podeAcessarApi(perfil, method, pathname) {
  if (!PERFIS.includes(perfil)) return false;

  // Cadastro, edição e exclusão de usuários: só administrador.
  // A listagem continua aberta porque alimenta os seletores de funcionário.
  if (pathname.startsWith('/api/usuarios') && MUTATING.includes(method)) {
    return perfil === 'admin';
  }

  return true;
}

// Itens do menu que cada perfil vê
export function podeVerPagina(perfil, href) {
  if (href === '/usuarios') return perfil === 'admin';
  return PERFIS.includes(perfil);
}
