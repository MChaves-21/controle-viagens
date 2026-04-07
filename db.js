const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql-2953ee28-murilochaves211105-7941.k.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_hYCwTyygzY73ZSDv4BC', // Note o 'Y' maiúsculo
    database: 'defaultdb',
    port: 12154,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool.promise();