const Database = require('./Database');

const run_query = (query, parameter) => {
    return new Promise((resolve, reject) => {
        Database.query(query, parameter, (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        });
    });
}

const login = (username, password) => {
    return run_query('SELECT id, name FROM users WHERE username = ? AND password = ?', [username, password]);
}

const register = (name, username, password) => {
    return run_query('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', [name, username, password]);
}

const updateProfile = (namaFile, nama, password, id) => {
    return run_query('UPDATE users SET namaFile = ?, name = ?, password = ? WHERE id = ?', [namaFile, nama, password, id]);
}

const checkUsername = username => {
    return run_query('SELECT id FROM users WHERE username = ?', [username]);
}

module.exports = {
    login,
    register,
    updateProfile,
    checkUsername
};