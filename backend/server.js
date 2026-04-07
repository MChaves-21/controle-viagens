const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão usando process.env (Vercel injeta esses valores automaticamente)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Obrigatório para bancos em nuvem como Aiven na Vercel
    }
});

db.connect((err) => {
    if (err) return console.error('Erro de conexão:', err);
    console.log('Conectado ao MySQL com sucesso!');
});

// Rota de Login (Lembre-se de criar a tabela tbUsuarios no banco)
app.post('/login', (req, res) => {
    const { login, senha } = req.body;
    const query = "SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?";

    db.query(query, [login, senha], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "Dados inválidos" });
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));