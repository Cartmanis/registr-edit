const jwt = require('jsonwebtoken');
const config = require('../../config');

const api = {};

api.login = (User) => async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) {
            res.status(401).send({success: false, message:
                'Сбой авторизации: Пользователь не найден'});
        } else {
            comparePassword(user, req, res);
        }
    } catch (err) {
        res.status(500).send({success: false, message: 
        `Ошибка сервера при поиске пользователя: ${err}`});
    }
}

api.veify = (headers) => {
    if(headers && headers.autorization) {
        const arr = headers.autorization.split(' ');
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
        const result = await user.comparePassword(req.body.password);

        if(result) {
            //формируем токен для определенного пользователя по секретному ключу
            const token = jwt.sign({user}, config.secrect); 
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