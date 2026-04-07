require('dotenv').config();
import express, { json, static as serveStatic } from 'express';
import { join } from 'path';
import { query } from './db';
const app = express();

app.use(json());
app.use(serveStatic('public'));

app.get('/', (req, res) => res.sendFile(join(__dirname, 'public', 'login.html')));

// --- LOGIN ---
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await query('SELECT usuario_id, nome FROM tbUsuarios WHERE login = ? AND senha = ?', [email, senha]);
        if (rows.length > 0) res.json({ success: true, user: rows[0] });
        else res.status(401).json({ success: false, message: 'Usuário ou senha incorretos' });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- CADASTRO ---
app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        await query('INSERT INTO tbUsuarios (nome, login, senha) VALUES (?, ?, ?)', [nome, email, senha]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- VIAGENS ---
app.get('/api/viagem-tipos', async (req, res) => {
    const [rows] = await query('SELECT * FROM tbViagemTipo');
    res.json(rows);
});

app.post('/api/solicitar-viagem', async (req, res) => {
    const { data_ida, data_volta, viagem_tipo_id, usuario_id } = req.body;
    try {
        await query('INSERT INTO tbViagem (data_ida, data_volta, viagem_tipo_id, atualizado_por) VALUES (?, ?, ?, ?)', [data_ida, data_volta, viagem_tipo_id, usuario_id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/viagens', async (req, res) => {
    const [rows] = await query('SELECT v.*, t.descricao as tipo FROM tbViagem v LEFT JOIN tbViagemTipo t ON v.viagem_tipo_id = t.viagem_tipo_id ORDER BY v.viagem_id DESC');
    res.json(rows);
});

// --- DESPESAS ---
app.get('/api/tipo-titulos', async (req, res) => {
    const [rows] = await query('SELECT * FROM tbTipoTitulo');
    res.json(rows);
});

app.post('/api/lancar-despesa', async (req, res) => {
    const { valor, data_vencimento, tipo_titulo_id, usuario_id } = req.body;
    try {
        // Conforme diagrama: funcionario_id e atualizado_por
        await query('INSERT INTO tbContasPagar (funcionario_id, valor, data_vencimento, tipo_titulo_id, atualizado_por) VALUES (?, ?, ?, ?, ?)', [usuario_id, valor, data_vencimento, tipo_titulo_id, usuario_id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));