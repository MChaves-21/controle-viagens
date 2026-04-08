# ViagemPro — Sistema de Gestão de Despesas de Viagem

Sistema completo de controle de despesas corporativas de viagem com Next.js + MySQL (Aiven).

## Stack
- **Frontend + Backend:** Next.js 14 (App Router)
- **Banco de dados:** MySQL via Aiven (SSL obrigatório)
- **Deploy:** Vercel
- **Charts:** Recharts
- **Ícones:** Lucide React

---

## 1. Preparar o banco de dados

Execute o arquivo `setup.sql` no seu banco MySQL da Aiven para criar os schemas e tabelas.

> No terminal com mysql-client:
```bash
mysql -h mysql-2953ee28-murilochaves211105-7941.k.aivencloud.com \
      -P 12154 \
      -u avnadmin \
      -p'AVNS_hYCwTyygzY73ZSDv4BC' \
      --ssl-mode=REQUIRED \
      < setup.sql
```

Ou copie e execute diretamente no painel de query da Aiven.

---

## 2. Rodar localmente

```bash
npm install
# Crie o .env.local com as variáveis abaixo
npm run dev
```

**.env.local:**
```
DB_HOST=mysql-2953ee28-murilochaves211105-7941.k.aivencloud.com
DB_PORT=12154
DB_USER=avnadmin
DB_PASSWORD=AVNS_hYCwTyygzY73ZSDv4BC
DB_NAME=defaultdb
```

Acesse: http://localhost:3000

---

## 3. Deploy na Vercel

### Via CLI:
```bash
npm i -g vercel
vercel login
vercel

# Adicione as variáveis de ambiente:
vercel env add DB_HOST
vercel env add DB_PORT
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME

vercel --prod
```

### Via painel da Vercel:
1. Importe o repositório GitHub em vercel.com
2. Em **Settings > Environment Variables**, adicione:
   - `DB_HOST` = `mysql-2953ee28-murilochaves211105-7941.k.aivencloud.com`
   - `DB_PORT` = `12154`
   - `DB_USER` = `avnadmin`
   - `DB_PASSWORD` = `AVNS_hYCwTyygzY73ZSDv4BC`
   - `DB_NAME` = `defaultdb`
3. Clique em **Deploy**

---

## Funcionalidades

| Módulo | Funcionalidades |
|--------|----------------|
| Dashboard | KPIs, gráficos de despesas mensais e por categoria, últimas viagens |
| Viagens | CRUD completo, filtros por status/busca, aprovação/rejeição |
| Despesas | CRUD completo, vínculo com viagens, categorias, status de pagamento |
| Usuários | CRUD completo, perfis (admin/gestor/financeiro/colaborador) |
| Relatórios | Gráficos analíticos, exportação CSV de viagens e despesas |

## Estrutura de banco

- `seguranca.tbUsuarios` — Usuários do sistema
- `viagem.tbViagemTipo` — Tipos de viagem (Nacional, Internacional...)
- `viagem.tbViagem` — Viagens de negócios
- `financeiro.tbTipoTitulo` — Categorias de despesa
- `financeiro.tbContasPagar` — Despesas e reembolsos

## Usuário padrão
- **Login:** admin
- **Senha:** admin123
