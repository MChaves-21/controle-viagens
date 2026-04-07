const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Necessário para Aiven
});

app.get('/teste-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: "Conectado ao Aiven!", time: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));