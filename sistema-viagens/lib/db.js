import mysql from 'mysql2/promise';

let pool;

export async function getConnection() {
    if (!pool) {
        pool = mysql.createPool({
            uri: process.env.DATABASE_URL,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }
    return pool;
}