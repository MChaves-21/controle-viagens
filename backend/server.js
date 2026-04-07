const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuração da conexão com os dados do seu print
const db = mysql.createConnection({
    host: 'mysql-2953ee28-murilochaves211105-7941.k.aivencloud.com',
    port: 12154,
    user: 'avnadmin',
    password: 'AVNS_hYCwTyygzY73ZSDv4BC', // Senha do seu print
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false }
});

db.connect(err => {
    if (err) console.error('Erro ao conectar ao MySQL:', err);
    else console.log('Conectado ao Aiven MySQL!');
});

// Rota de Login
app.post('/login', (req, res) => {
    const { login, senha } = req.body;
    const query = "SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?";

    db.query(query, [login, senha], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            res.json({ message: "Sucesso", user: results[0] });
        } else {
            res.status(401).json({ message: "Credenciais inválidas" });
        }
    });
});

// Rota para listar viagens
app.get('/viagens', (req, res) => {
    db.query("SELECT * FROM tbViagem", (err, results) => {
        if (err) res.status(500).send(err);
        else res.json(results);
    });
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));