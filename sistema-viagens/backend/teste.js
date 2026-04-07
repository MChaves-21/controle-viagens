import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    // Configurações usando Variáveis de Ambiente (Vercel)
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
        ssl: {
            rejectUnauthorized: false // Necessário para conexões seguras no Aiven
        }
    });

    try {
        const [rows] = await connection.execute('SELECT "Conexão com Aiven OK!" as resultado');
        res.status(200).json({ status: "Sucesso", data: rows[0] });
    } catch (error) {
        res.status(500).json({ status: "Erro", error: error.message });
    } finally {
        await connection.end();
    }
}