const mongoose = require('mongoose');
//по сути тут выполняем  mongoose.model('User', Schema);
require('../models/user'); 

const models = {
    User: mongoose.model('User') //а тут используем mongoose.model('User')
}

module.exports = models;