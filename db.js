const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'a7co1v.h.filess.io',
    user: 'Banco_Murilo_flatbegun',
    password: 'a07f0f72c0dddc3a60557786c1e1c2c9ec238465',
    database: 'Banco_Murilo_flatbegun',
    port: 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();