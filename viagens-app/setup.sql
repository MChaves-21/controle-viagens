-- ============================================================
-- SETUP: Execute este script no seu banco MySQL da Aiven
-- Cria os schemas e tabelas necessários para o sistema
-- ============================================================

-- Criar schemas se não existirem
CREATE SCHEMA IF NOT EXISTS seguranca;
CREATE SCHEMA IF NOT EXISTS viagem;
CREATE SCHEMA IF NOT EXISTS financeiro;

-- ============================================================
-- SEGURANCA
-- ============================================================
CREATE TABLE IF NOT EXISTS seguranca.tbUsuarios (
  usuario_id   INT(10) NOT NULL AUTO_INCREMENT,
  nome         VARCHAR(200) NOT NULL,
  login        VARCHAR(50) NOT NULL UNIQUE,
  senha        VARCHAR(255) NOT NULL,
  perfil       ENUM('admin','gestor','colaborador','financeiro') DEFAULT 'colaborador',
  ativo        TINYINT(1) DEFAULT 1,
  atualizado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  atualizado_por INT(10),
  PRIMARY KEY (usuario_id)
);

-- Inserir usuário admin padrão (senha: admin123)
INSERT IGNORE INTO seguranca.tbUsuarios (nome, login, senha, perfil)
VALUES ('Administrador', 'admin', 'admin123', 'admin');

-- ============================================================
-- VIAGEM
-- ============================================================
CREATE TABLE IF NOT EXISTS viagem.tbViagemTipo (
  viagem_tipo_id INT(10) NOT NULL AUTO_INCREMENT,
  descricao      VARCHAR(200) NOT NULL UNIQUE,
  PRIMARY KEY (viagem_tipo_id)
);

INSERT IGNORE INTO viagem.tbViagemTipo (descricao) VALUES
  ('Nacional'),
  ('Internacional'),
  ('Estadual');

CREATE TABLE IF NOT EXISTS viagem.tbViagem (
  viagem_id      INT(10) NOT NULL AUTO_INCREMENT,
  funcionario_id INT(10) NOT NULL,
  destino        VARCHAR(200),
  objetivo       TEXT,
  status         ENUM('rascunho','pendente','aprovada','rejeitada','concluida') DEFAULT 'rascunho',
  data_ida       DATE NOT NULL,
  data_volta     DATE NOT NULL,
  viagem_tipo_id INT(10),
  valor_adiantamento DECIMAL(12,2) DEFAULT 0,
  observacoes    TEXT,
  aprovado_por   INT(10),
  aprovado_em    TIMESTAMP NULL,
  atualizado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  atualizado_por INT(10),
  PRIMARY KEY (viagem_id),
  FOREIGN KEY (funcionario_id) REFERENCES seguranca.tbUsuarios(usuario_id),
  FOREIGN KEY (viagem_tipo_id) REFERENCES viagem.tbViagemTipo(viagem_tipo_id)
);

-- ============================================================
-- FINANCEIRO
-- ============================================================
CREATE TABLE IF NOT EXISTS financeiro.tbTipoTitulo (
  tipo_titulo_id INT(11) NOT NULL AUTO_INCREMENT,
  descricao      VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (tipo_titulo_id)
);

INSERT IGNORE INTO financeiro.tbTipoTitulo (descricao) VALUES
  ('Transporte'),
  ('Hospedagem'),
  ('Alimentação'),
  ('Combustível'),
  ('Pedágio'),
  ('Outros');

CREATE TABLE IF NOT EXISTS financeiro.tbContasPagar (
  conta_pagar_id  INT(11) NOT NULL AUTO_INCREMENT,
  funcionario_id  INT(11) NOT NULL,
  viagem_id       INT(11),
  descricao       VARCHAR(300),
  valor           DECIMAL(12,2) NOT NULL,
  data_vencimento DATE,
  data_pagamento  DATE,
  status          ENUM('pendente','aprovado','pago','rejeitado') DEFAULT 'pendente',
  tipo_titulo_id  INT(11),
  comprovante_url VARCHAR(500),
  observacoes     TEXT,
  atualizado_por  INT(10),
  atualizado_em   INT(11),
  PRIMARY KEY (conta_pagar_id),
  FOREIGN KEY (tipo_titulo_id) REFERENCES financeiro.tbTipoTitulo(tipo_titulo_id)
);
