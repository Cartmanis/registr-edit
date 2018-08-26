const models = require('../setup');
const api = require('../api/login');


module.exports = (app) => {    
    app.route('/').get((req, res) => res.send('Main page'));
    app.route('/login').post(api.login(models.User));
}