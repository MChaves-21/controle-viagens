-- Dados FICTÍCIOS para a demonstração (pessoas, valores e viagens inventados).
-- Os usuários fictícios têm senha aleatória descartada: ninguém entra com eles (use o modo visitante).
-- Rode depois do setup.sql. Datas relativas a hoje, para o dashboard sempre ter os últimos 6 meses.
INSERT IGNORE INTO seguranca.tbUsuarios (nome, login, senha, perfil) VALUES
  ('Mariana Albuquerque', 'mariana.gestora', '$2a$10$lUn51gHEZDhw6zVDVPt2UuKTmWZ6qQHejAXWhSfmnJS.xExDYiM4S', 'gestor'),
  ('Rafael Teixeira', 'rafael.financeiro', '$2a$10$lUn51gHEZDhw6zVDVPt2UuKTmWZ6qQHejAXWhSfmnJS.xExDYiM4S', 'financeiro'),
  ('Camila Rocha', 'camila.rocha', '$2a$10$lUn51gHEZDhw6zVDVPt2UuKTmWZ6qQHejAXWhSfmnJS.xExDYiM4S', 'colaborador'),
  ('Bruno Linhares', 'bruno.linhares', '$2a$10$lUn51gHEZDhw6zVDVPt2UuKTmWZ6qQHejAXWhSfmnJS.xExDYiM4S', 'colaborador'),
  ('Larissa Monteiro', 'larissa.monteiro', '$2a$10$lUn51gHEZDhw6zVDVPt2UuKTmWZ6qQHejAXWhSfmnJS.xExDYiM4S', 'colaborador'),
  ('Diego Farias', 'diego.farias', '$2a$10$lUn51gHEZDhw6zVDVPt2UuKTmWZ6qQHejAXWhSfmnJS.xExDYiM4S', 'colaborador');

INSERT INTO viagem.tbViagem (funcionario_id, destino, objetivo, status, data_ida, data_volta, viagem_tipo_id, valor_adiantamento) VALUES
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), 'Recife - PE', 'Visita técnica ao cliente Nordeste Logística', 'concluida', DATE_SUB(CURDATE(), INTERVAL 170 DAY), DATE_SUB(CURDATE(), INTERVAL 167 DAY), 1, 800.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), 'São Paulo - SP', 'Feira de tecnologia e reuniões com fornecedores', 'concluida', DATE_SUB(CURDATE(), INTERVAL 156 DAY), DATE_SUB(CURDATE(), INTERVAL 153 DAY), 1, 1500.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), 'Sobral - CE', 'Implantação do sistema na filial', 'concluida', DATE_SUB(CURDATE(), INTERVAL 142 DAY), DATE_SUB(CURDATE(), INTERVAL 139 DAY), 3, 400.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), 'Juazeiro do Norte - CE', 'Treinamento da equipe regional', 'aprovada', DATE_SUB(CURDATE(), INTERVAL 128 DAY), DATE_SUB(CURDATE(), INTERVAL 125 DAY), 3, 350.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), 'Lisboa - Portugal', 'Congresso internacional de gestão', 'concluida', DATE_SUB(CURDATE(), INTERVAL 114 DAY), DATE_SUB(CURDATE(), INTERVAL 111 DAY), 2, 4200.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), 'Natal - RN', 'Auditoria de contratos', 'aprovada', DATE_SUB(CURDATE(), INTERVAL 100 DAY), DATE_SUB(CURDATE(), INTERVAL 97 DAY), 1, 900.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), 'Teresina - PI', 'Reunião comercial com parceiro', 'pendente', DATE_SUB(CURDATE(), INTERVAL 86 DAY), DATE_SUB(CURDATE(), INTERVAL 83 DAY), 1, 700.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), 'Quixadá - CE', 'Suporte presencial na unidade', 'concluida', DATE_SUB(CURDATE(), INTERVAL 72 DAY), DATE_SUB(CURDATE(), INTERVAL 69 DAY), 3, 300.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), 'Brasília - DF', 'Reunião com órgão regulador', 'rejeitada', DATE_SUB(CURDATE(), INTERVAL 58 DAY), DATE_SUB(CURDATE(), INTERVAL 55 DAY), 1, 1100.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), 'Salvador - BA', 'Workshop de processos', 'pendente', DATE_SUB(CURDATE(), INTERVAL 44 DAY), DATE_SUB(CURDATE(), INTERVAL 41 DAY), 1, 1200.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), 'Crato - CE', 'Visita a cliente', 'rascunho', DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 27 DAY), 3, 250.00),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), 'Belo Horizonte - MG', 'Homologação de fornecedor', 'aprovada', DATE_SUB(CURDATE(), INTERVAL 16 DAY), DATE_SUB(CURDATE(), INTERVAL 13 DAY), 1, 1300.00);

-- Despesas ligadas às viagens (as 12 primeiras viagens inseridas acima)
INSERT INTO financeiro.tbContasPagar (funcionario_id, viagem_id, descricao, valor, data_vencimento, data_pagamento, status, tipo_titulo_id) VALUES
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), (SELECT MAX(viagem_id) - 11 FROM viagem.tbViagem), 'Refeições', 68.69, DATE_SUB(CURDATE(), INTERVAL 165 DAY), DATE_SUB(CURDATE(), INTERVAL 160 DAY), 'pago', 3),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), (SELECT MAX(viagem_id) - 11 FROM viagem.tbViagem), 'Hotel', 789.19, DATE_SUB(CURDATE(), INTERVAL 165 DAY), DATE_SUB(CURDATE(), INTERVAL 160 DAY), 'pago', 2),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), (SELECT MAX(viagem_id) - 11 FROM viagem.tbViagem), 'Combustível', 144.47, DATE_SUB(CURDATE(), INTERVAL 165 DAY), DATE_SUB(CURDATE(), INTERVAL 160 DAY), 'pago', 4),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), (SELECT MAX(viagem_id) - 11 FROM viagem.tbViagem), 'Táxi e aplicativo', 99.93, DATE_SUB(CURDATE(), INTERVAL 165 DAY), DATE_SUB(CURDATE(), INTERVAL 160 DAY), 'pago', 6),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 10 FROM viagem.tbViagem), 'Pedágio', 18.87, DATE_SUB(CURDATE(), INTERVAL 151 DAY), DATE_SUB(CURDATE(), INTERVAL 146 DAY), 'pago', 5),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 10 FROM viagem.tbViagem), 'Hotel', 539.27, DATE_SUB(CURDATE(), INTERVAL 151 DAY), DATE_SUB(CURDATE(), INTERVAL 146 DAY), 'pago', 2),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 10 FROM viagem.tbViagem), 'Passagem aérea', 798.96, DATE_SUB(CURDATE(), INTERVAL 151 DAY), DATE_SUB(CURDATE(), INTERVAL 146 DAY), 'pago', 1),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), (SELECT MAX(viagem_id) - 9 FROM viagem.tbViagem), 'Pedágio', 20.57, DATE_SUB(CURDATE(), INTERVAL 137 DAY), DATE_SUB(CURDATE(), INTERVAL 132 DAY), 'pago', 5),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), (SELECT MAX(viagem_id) - 9 FROM viagem.tbViagem), 'Combustível', 178.04, DATE_SUB(CURDATE(), INTERVAL 137 DAY), DATE_SUB(CURDATE(), INTERVAL 132 DAY), 'pago', 4),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), (SELECT MAX(viagem_id) - 9 FROM viagem.tbViagem), 'Passagem aérea', 1359.78, DATE_SUB(CURDATE(), INTERVAL 137 DAY), DATE_SUB(CURDATE(), INTERVAL 132 DAY), 'pago', 1),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), (SELECT MAX(viagem_id) - 9 FROM viagem.tbViagem), 'Refeições', 230.59, DATE_SUB(CURDATE(), INTERVAL 137 DAY), DATE_SUB(CURDATE(), INTERVAL 132 DAY), 'pago', 3),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 8 FROM viagem.tbViagem), 'Pedágio', 17.23, DATE_SUB(CURDATE(), INTERVAL 123 DAY), NULL, 'aprovado', 5),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 8 FROM viagem.tbViagem), 'Táxi e aplicativo', 56.53, DATE_SUB(CURDATE(), INTERVAL 123 DAY), NULL, 'aprovado', 6),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 8 FROM viagem.tbViagem), 'Combustível', 264.73, DATE_SUB(CURDATE(), INTERVAL 123 DAY), NULL, 'aprovado', 4),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), (SELECT MAX(viagem_id) - 7 FROM viagem.tbViagem), 'Hotel', 615.23, DATE_SUB(CURDATE(), INTERVAL 109 DAY), DATE_SUB(CURDATE(), INTERVAL 104 DAY), 'pago', 2),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), (SELECT MAX(viagem_id) - 7 FROM viagem.tbViagem), 'Refeições', 162.76, DATE_SUB(CURDATE(), INTERVAL 109 DAY), DATE_SUB(CURDATE(), INTERVAL 104 DAY), 'pago', 3),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), (SELECT MAX(viagem_id) - 7 FROM viagem.tbViagem), 'Combustível', 265.67, DATE_SUB(CURDATE(), INTERVAL 109 DAY), DATE_SUB(CURDATE(), INTERVAL 104 DAY), 'pago', 4),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='camila.rocha'), (SELECT MAX(viagem_id) - 7 FROM viagem.tbViagem), 'Passagem aérea', 1438.90, DATE_SUB(CURDATE(), INTERVAL 109 DAY), DATE_SUB(CURDATE(), INTERVAL 104 DAY), 'pago', 1),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 6 FROM viagem.tbViagem), 'Passagem aérea', 989.98, DATE_SUB(CURDATE(), INTERVAL 95 DAY), NULL, 'aprovado', 1),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 6 FROM viagem.tbViagem), 'Pedágio', 39.65, DATE_SUB(CURDATE(), INTERVAL 95 DAY), NULL, 'aprovado', 5),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 6 FROM viagem.tbViagem), 'Hotel', 318.93, DATE_SUB(CURDATE(), INTERVAL 95 DAY), NULL, 'aprovado', 2),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), (SELECT MAX(viagem_id) - 5 FROM viagem.tbViagem), 'Passagem aérea', 1436.58, DATE_SUB(CURDATE(), INTERVAL 81 DAY), NULL, 'pendente', 1),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), (SELECT MAX(viagem_id) - 5 FROM viagem.tbViagem), 'Pedágio', 34.24, DATE_SUB(CURDATE(), INTERVAL 81 DAY), NULL, 'pendente', 5),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), (SELECT MAX(viagem_id) - 5 FROM viagem.tbViagem), 'Hotel', 474.77, DATE_SUB(CURDATE(), INTERVAL 81 DAY), NULL, 'pendente', 2),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='larissa.monteiro'), (SELECT MAX(viagem_id) - 5 FROM viagem.tbViagem), 'Combustível', 272.25, DATE_SUB(CURDATE(), INTERVAL 81 DAY), NULL, 'pendente', 4),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 4 FROM viagem.tbViagem), 'Combustível', 184.59, DATE_SUB(CURDATE(), INTERVAL 67 DAY), DATE_SUB(CURDATE(), INTERVAL 62 DAY), 'pago', 4),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 4 FROM viagem.tbViagem), 'Refeições', 92.36, DATE_SUB(CURDATE(), INTERVAL 67 DAY), DATE_SUB(CURDATE(), INTERVAL 62 DAY), 'pago', 3),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 4 FROM viagem.tbViagem), 'Pedágio', 50.09, DATE_SUB(CURDATE(), INTERVAL 67 DAY), DATE_SUB(CURDATE(), INTERVAL 62 DAY), 'pago', 5),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 2 FROM viagem.tbViagem), 'Passagem aérea', 1211.53, DATE_SUB(CURDATE(), INTERVAL 39 DAY), NULL, 'pendente', 1),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 2 FROM viagem.tbViagem), 'Pedágio', 54.38, DATE_SUB(CURDATE(), INTERVAL 39 DAY), NULL, 'pendente', 5),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='bruno.linhares'), (SELECT MAX(viagem_id) - 2 FROM viagem.tbViagem), 'Refeições', 191.30, DATE_SUB(CURDATE(), INTERVAL 39 DAY), NULL, 'pendente', 3),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 0 FROM viagem.tbViagem), 'Refeições', 81.25, DATE_SUB(CURDATE(), INTERVAL 11 DAY), NULL, 'aprovado', 3),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 0 FROM viagem.tbViagem), 'Pedágio', 33.82, DATE_SUB(CURDATE(), INTERVAL 11 DAY), NULL, 'aprovado', 5),
  ((SELECT usuario_id FROM seguranca.tbUsuarios WHERE login='diego.farias'), (SELECT MAX(viagem_id) - 0 FROM viagem.tbViagem), 'Passagem aérea', 1547.85, DATE_SUB(CURDATE(), INTERVAL 11 DAY), NULL, 'aprovado', 1);
