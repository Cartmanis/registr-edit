const jwt = require('jsonwebtoken');
const config = require('../../config');

const api = {};

api.login = (User) => async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) {
            res.status(401).send({success: false, message:
                'Сбой авторизации: Пользователь не найден'});
            return;
        }
        comparePassword(user, req, res);
    } catch (err) {
        res.status(500).send({success: false, message: 
        `Ошибка сервера при поиске пользователя: ${err}`});
    }
}

api.verify = (headers) => {
    if(headers && headers.authorization) {
        const arr = headers.authorization.split(' ');
        if(arr.length === 2){
            return arr[1];
        }
        return null;
    }
    return null;
}

//Вспомогательные функции
const comparePassword = async (user, req, res) => {
    try {
        const compare = await user.comparePassword(req.body.password);
        if(compare) {
            //не храним password в токене в целях безопасности, хотя он в виде хеша...
            const payload = {
                username: user.username,
                isAdmin: user.isAdmin
            }
            //формируем токен для определенного пользователя по секретному ключу, сроком годности 24 часа
            const token = jwt.sign(payload, config.secret, {expiresIn: 86400});                        
            res.json({success: true, message: 'Token granted', token});
        } else {
            res.status(401).send({success: false, 
            message: 'Сбой авторизации: Неверный пароль'});
        }
    } catch (err) {
        res.status(500).send({success: false, 
        message:`Ошибка сервера при сравнении паролей: ${err}`});
    }
}

module.exports = api;