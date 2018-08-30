const passport = require('passport');
const config = require('../../config');
const models = require('../setup');
const api = require('../api/user');

module.exports = (app) => {
    app.route('/setup').get(api.createAdmin(models.User));

    app.route('/users').get(passport.authenticate('jwt', config.session),
    api.getUsers(models.User, app.get(config.secret)));

    app.route('/newuser').post(api.createUser(models.User));   
    
}