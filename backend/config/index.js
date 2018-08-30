const secret = require('./secret');
module.exports = {
    secret: secret.key,
    session: {session: false},
    database: 'mongodb://127.0.0.1:27017/formats'
}