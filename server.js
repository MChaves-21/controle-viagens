require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db.js');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- AUTENTICAÇÃO ---
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        // Ajustado para seguranca.tbUsuarios conforme seu diagrama
        const [rows] = await db.query('SELECT usuario_id, nome FROM tbUsuarios WHERE login = ? AND senha = ?', [email, senha]);
        if (rows.length > 0) res.json({ success: true, user: rows[0] });
        else res.status(401).json({ success: false, message: 'E-mail ou senha incorretos' });
    } catch (err) {
        console.error("ERRO NO LOGIN:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        // O campo atualizado_por é obrigatório no seu diagrama. 
        // No primeiro cadastro, enviamos 1 como valor padrão.
        const sql = 'INSERT INTO tbUsuarios (nome, login, senha, atualizado_por) VALUES (?, ?, ?, ?)';
        await db.query(sql, [nome, email, senha, 1]);

        res.json({ success: true });
    } catch (err) {
        console.error("ERRO NO CADASTRO:", err.message); // Isso vai aparecer no seu terminal
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- VIAGENS ---
app.get('/api/viagens', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.viagem_id, v.data_ida, v.data_volta, t.descricao as tipo 
            FROM tbViagem v 
            LEFT JOIN tbViagemTipo t ON v.viagem_tipo_id = t.viagem_tipo_id 
            ORDER BY v.data_ida DESC`);
        res.json(rows);
    } catch (err) {
        console.error("ERRO AO BUSCAR VIAGENS:", err.message);
        res.status(500).json([]);
    }
});

app.get('/api/viagem-tipos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbViagemTipo');
        res.json(rows);
    } catch (err) {
        console.error("ERRO AO BUSCAR TIPOS DE VIAGEM:", err.message);
        res.json([]);
    }
});

app.post('/api/solicitar-viagem', async (req, res) => {
    const { data_ida, data_volta, viagem_tipo_id, usuario_id } = req.body;
    try {
        await db.query('INSERT INTO tbViagem (data_ida, data_volta, viagem_tipo_id, atualizado_por) VALUES (?, ?, ?, ?)', [data_ida, data_volta, viagem_tipo_id, usuario_id]);
        res.json({ success: true });
    } catch (err) {
        console.error("ERRO AO SOLICITAR VIAGEM:", err.message);
        res.status(500).json({ success: false });
    }
});

// --- DESPESAS ---
app.get('/api/tipo-titulos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbTipoTitulo');
        res.json(rows);
    } catch (err) {
        console.error("ERRO AO BUSCAR TIPOS DE TITULO:", err.message);
        res.json([]);
    }
});

// Localize a rota /cadastrar no seu server.js e substitua por esta:
app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // No seu diagrama: tbUsuarios tem (nome, login, senha, atualizado_por)
        // Se o seu banco tiver o prefixo 'seguranca', mude para: seguranca.tbUsuarios
        const sql = 'INSERT INTO tbUsuarios (nome, login, senha, atualizado_por) VALUES (?, ?, ?, ?)';

        await db.query(sql, [nome, email, senha, 1]); // '1' preenche o campo atualizado_por

        console.log("Usuário cadastrado com sucesso:", email);
        res.json({ success: true });
    } catch (err) {
        // Isso vai mostrar o erro REAL no seu terminal do VS Code (embaixo)
        console.error("ERRO NO BANCO DE DADOS:", err.sqlMessage || err.message);

        res.status(500).json({
            success: false,
            message: 'Erro no banco: ' + (err.sqlMessage || err.message)
        });
    }
});

app.listen(3000, () => console.log('Servidor ON: http://localhost:3000'));