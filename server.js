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

// --- AUTENTICAÇÃO (Tabela: seguranca.tbUsuarios) ---
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await db.query('SELECT usuario_id, nome FROM seguranca.tbUsuarios WHERE login = ? AND senha = ?', [email, senha]);
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
        const sql = 'INSERT INTO seguranca.tbUsuarios (nome, login, senha, atualizado_por) VALUES (?, ?, ?, ?)';
        await db.query(sql, [nome, email, senha, 1]);
        console.log("Usuário cadastrado:", email);
        res.json({ success: true });
    } catch (err) {
        console.error("ERRO NO CADASTRO:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- VIAGENS (Esquema: viagem) ---
app.get('/api/viagens', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.viagem_id, v.data_ida, v.data_volta, t.descricao as tipo 
            FROM viagem.tbViagem v 
            LEFT JOIN viagem.tbViagemTipo t ON v.viagem_tipo_id = t.viagem_tipo_id 
            ORDER BY v.data_ida DESC`);
        res.json(rows);
    } catch (err) {
        console.error("ERRO AO BUSCAR VIAGENS:", err.message);
        res.status(500).json([]);
    }
});

app.get('/api/viagem-tipos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM viagem.tbViagemTipo');
        res.json(rows);
    } catch (err) {
        res.json([]);
    }
});

app.post('/api/solicitar-viagem', async (req, res) => {
    const { data_ida, data_volta, viagem_tipo_id, usuario_id } = req.body;
    try {
        await db.query('INSERT INTO viagem.tbViagem (data_ida, data_volta, viagem_tipo_id, atualizado_por) VALUES (?, ?, ?, ?)', [data_ida, data_volta, viagem_tipo_id, usuario_id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// --- DESPESAS (Esquema: financeiro) ---
app.get('/api/tipo-titulos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM financeiro.tbTipoTitulo');
        res.json(rows);
    } catch (err) {
        res.json([]);
    }
});

app.post('/api/lancar-despesa', async (req, res) => {
    const { valor, data_vencimento, tipo_titulo_id, usuario_id } = req.body;
    try {
        await db.query('INSERT INTO financeiro.tbContasPagar (funcionario_id, valor, data_vencimento, tipo_titulo_id, atualizado_por) VALUES (?, ?, ?, ?, ?)', [usuario_id, valor, data_vencimento, tipo_titulo_id, usuario_id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ON na porta ${PORT}`));