const models = require('../setup');
const api = require('../api/auth');


module.exports = (app) => {    
    app.route('/').get((req, res) => res.send('Main page'));
    app.route('/auth').post(api.login(models.User));
}