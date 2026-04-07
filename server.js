const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Rota inicial - Direciona para o login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- AUTENTICAÇÃO ---
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await db.query('SELECT usuario_id, nome FROM tbUsuarios WHERE login = ? AND senha = ?', [email, senha]);
        if (rows.length > 0) res.json({ success: true, user: rows[0] });
        else res.status(401).json({ success: false, message: 'E-mail ou senha incorretos' });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        await db.query('INSERT INTO tbUsuarios (nome, login, senha) VALUES (?, ?, ?)', [nome, email, senha]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Erro ao cadastrar' }); }
});

// --- VIAGENS ---
app.get('/api/viagens', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT v.*, t.descricao as tipo FROM tbViagem v LEFT JOIN tbViagemTipo t ON v.viagem_tipo_id = t.viagem_tipo_id ORDER BY v.data_ida DESC');
        res.json(rows);
    } catch (err) { res.status(500).json([]); }
});

app.get('/api/viagem-tipos', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM tbViagemTipo');
    res.json(rows);
});

app.post('/api/solicitar-viagem', async (req, res) => {
    const { data_ida, data_volta, viagem_tipo_id, usuario_id } = req.body;
    try {
        await db.query('INSERT INTO tbViagem (data_ida, data_volta, viagem_tipo_id, atualizado_por) VALUES (?, ?, ?, ?)', [data_ida, data_volta, viagem_tipo_id, usuario_id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- DESPESAS ---
app.get('/api/tipo-titulos', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM tbTipoTitulo');
    res.json(rows);
});

app.post('/api/lancar-despesa', async (req, res) => {
    const { valor, data_vencimento, tipo_titulo_id, usuario_id } = req.body;
    try {
        await db.query('INSERT INTO tbContasPagar (funcionario_id, valor, data_vencimento, tipo_titulo_id, atualizado_por) VALUES (?, ?, ?, ?, ?)', [usuario_id, valor, data_vencimento, tipo_titulo_id, usuario_id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.listen(3000, () => console.log('Servidor ON: http://localhost:3000'));