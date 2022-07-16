const mysql = require('mysql');

const connect = mysql.createConnection({
    user: 'root',
    host: '127.0.0.1',
    password: 'admin',
    database: 'db_chat'
});

module.exports = connect;