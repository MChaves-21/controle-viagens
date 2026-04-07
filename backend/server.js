const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuração usando as variáveis que você preencheu na Vercel
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // IMPORTANTE: Aiven exige SSL. Na Vercel, use rejectUnauthorized: false
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao Aiven:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

// Exemplo de rota de login
app.post('/login', (req, res) => {
    const { login, senha } = req.body;
    const query = "SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?";

    db.query(query, [login, senha], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "Login ou senha inválidos" });
        }
    });
});

// A Vercel Services espera que o app ouça em uma porta
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));