# ViagemPro

Sistema web de gestão de despesas de viagens corporativas, desenvolvido com Next.js e MySQL. Permite que colaboradores registrem e acompanhem viagens de negócio, submetam despesas para aprovação e gerem relatórios financeiros — tudo em uma interface centralizada e responsiva.

---

## Funcionalidades

- **Autenticação** — login e cadastro com sessão JWT via cookie httpOnly, proteção de rotas por middleware
- **Dashboard** — visão geral com KPIs, gráfico de despesas mensais e distribuição por categoria
- **Viagens** — cadastro, edição e exclusão de viagens com controle de status (rascunho → pendente → aprovada → concluída)
- **Despesas** — lançamento de despesas vinculadas a viagens, com categorização, status de pagamento e URL de comprovante
- **Usuários** — gerenciamento de usuários com quatro perfis de acesso: Administrador, Gestor, Financeiro e Colaborador
- **Relatórios** — gráficos analíticos e exportação de dados em CSV

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend + API | Next.js 15 (App Router) |
| Banco de dados | MySQL 8 — Aiven Cloud |
| Autenticação | JWT com `jose` (edge-compatible) |
| Gráficos | Recharts |
| Deploy | Vercel |

---

## Estrutura do banco

O banco é dividido em três schemas:

```
seguranca
  └── tbUsuarios          — usuários e perfis de acesso

viagem
  ├── tbViagemTipo        — tipos (Nacional, Internacional, Estadual...)
  └── tbViagem            — viagens com status, adiantamento e aprovação

financeiro
  ├── tbTipoTitulo        — categorias de despesa (Transporte, Hospedagem...)
  └── tbContasPagar       — despesas e reembolsos vinculados às viagens
```

Para criar toda a estrutura, execute o arquivo `setup.sql` no banco:

```bash
mysql -h <DB_HOST> -P <DB_PORT> -u avnadmin -p --ssl-mode=REQUIRED < setup.sql
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz da pasta `viagens-app`:

```env
DB_HOST=<host-do-banco>
DB_PORT=<porta>
DB_USER=avnadmin
DB_PASSWORD=<senha>
DB_NAME=defaultdb
JWT_SECRET=<string-longa-e-aleatoria>
```

Na Vercel, configure as mesmas variáveis em **Settings → Environment Variables**.

---

## Rodando localmente

```bash
cd viagens-app
npm install
npm run dev
# Acesse http://localhost:3000
```

---

## Deploy

1. Suba o repositório no GitHub
2. Importe o projeto na [Vercel](https://vercel.com) apontando para a pasta `viagens-app` como diretório raiz
3. Configure as variáveis de ambiente no painel
4. Clique em **Deploy**

---

## Acesso padrão

Após executar o `setup.sql`, utilize as credenciais abaixo para o primeiro acesso:

| Campo | Valor |
|-------|-------|
| Login | `admin` |
| Senha | `admin123` |

> Recomenda-se alterar a senha do administrador imediatamente após o primeiro login.

---

## Estrutura de pastas

```
viagens-app/
├── app/
│   ├── api/              — rotas de API (auth, viagens, despesas, usuários)
│   ├── login/            — tela de login e cadastro
│   ├── viagens/          — módulo de viagens
│   ├── despesas/         — módulo de despesas
│   ├── usuarios/         — módulo de usuários
│   ├── relatorios/       — relatórios e gráficos
│   ├── layout.js         — layout global com sidebar e autenticação
│   └── page.js           — dashboard principal
├── lib/
│   ├── db.js             — pool de conexão MySQL
│   └── auth.js           — utilitários JWT
├── middleware.js          — proteção de rotas
├── setup.sql             — script de criação do banco
└── .env.local            — variáveis de ambiente (não versionar)
```
