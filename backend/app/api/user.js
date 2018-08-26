const api = {};


/*ДЛЯ ОТЛАДКИ - ЗАТЕМ НУЖНО УДАЛИТЬ */
api.createAdmin = (User) => (req, res) => {
    const admin = new User({
        username: 'admin',
        password: 'admin'
    });

    admin.save(err => {
        if(err) {
            return res.status(400).json({success: false, error: err});
        }
        res.json(({success: true,
             message: 'Учётная запись администратора успешно создана'}));
    })
}

api.getUsers = (User, token) => async (req, res) => {
    if(token) {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (err) {
            res.status(500).send(
                `Ошибка сервера при поиске всех пользователей: ${err}`);
        }
    } else {
        res.status(403).send({success: false, 
            message: 'Пользователь не авторизован'});
    }
}

api.createUser = (User) => (req, res) => {
    if(!req.body.username||req.body.username.length < 3) {
        return res.status(400).json({success: false,
        message: 'Имя пользователя должно быть не менее 3 символов'});                
    }
    if(!req.body.password || req.body.password.length < 6) {
        return res.status(400).json({success: false,
        message: 'Пароль должен быть не менее 6 символов'});      
    }
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    newUser.save((err) => {
        if(err) {
            return res.status(400).json({success: true, message: 
        `Данный пользователь уже присутсвует. Выберите другое имя пользователя`});
        }
        res.json({success: true, 
        message:'Новый пользователь успешно добавлен'});
    })
}

module.exports = api;