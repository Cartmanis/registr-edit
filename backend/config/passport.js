const passportJWT = require('passport-jwt');
const config = require('./index.js');
const models = require('../app/setup');
const extractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

module.exports = (passport) => {
    const User = models.User;
    const tokenAndSecret = {
        secretOrKey: config.secrect,
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken()
    };

    passport.use(new Strategy(tokenAndSecret, async (payload, done) => {
        try {
            const  user = await User.findOne({id: payload.id});
            if(user) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    }));
}