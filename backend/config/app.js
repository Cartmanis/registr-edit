const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const consign = require('consign');
const passport = require('passport');

const passportConfig = require('./passport')(passport);
const jwt = require('jsonwebtoken');
const config = require('./index');
const database = require('./database')(mongoose, config);

app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(passport.initialize());

app.set('dU$f82kf%HL2&ll@s2#', config.secrect);

consign({cwd: 'backend'})
    .include('app/setup')
    .then('app/api')
    .then('app/routes')
    .into(app);
    
module.exports = app;