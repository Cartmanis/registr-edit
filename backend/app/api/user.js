const auth = require('./auth.js');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const api = {};


/*ДЛЯ ОТЛАДКИ - ЗАТЕМ НУЖНО УДАЛИТЬ */
api.createAdmin = (User) => (req, res) => {
    const admin = new User({
        username: 'admin',
        password: 'p43ybu',
        isAdmin: true
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
  try {
    //тут получаем всего лишь секретный ключ, а не токен
    if(!token) {
      return res.status(401).json({success: false, 
        message: 'Пользователь не авторизован'})
    }
    //a вот тут уже получаем настоящий токен    
    const token2 =  auth.verify(req.headers);
    const extract = jwt.verify(token2, config.secret);
    console.log(extract);
    if(!extract.isAdmin) {
      return res.status(403).json({success: false,
        message: 'Нет прав для выполнения этой операции'});
    }
      const users = await User.find({});            
      res.status(200).json(users);  
  } catch (err) {
      res.status(500).send(
          `Ошибка сервера при поиске всех пользователей: ${err}`);
  }

}

api.createUser = (User) => async (req, res) => {
    try{
        if(!req.body.username||req.body.username.length < 3) {
            return res.status(400).json({success: false,
            message: 'Имя пользователя должно быть не менее 3 символов'});                
          }
          if(!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({success: false,
            message: 'Пароль должен быть не менее 6 символов'});      
          }
          
          const token =  auth.verify(req.headers);
          console.log(token);
          if(!token) {
            return res.status(401).json({success: false,
              message: 'Пользователь не авторизован'});
          }
          
          const extract = jwt.verify(token, config.secret);
          console.log(extract);
          if(!extract.isAdmin) {
              return res.status(403).json({success: false,
              message: 'Нет прав для выполнения этой операции'});
          }
            
          const newUser = new User({
              username: req.body.username,
              password: req.body.password
          });
        
          newUser.save((err) => {
              if(err) {
                  return res.status(400).json({success: false, message: 
              `Данный пользователь уже присутсвует. Выберите другое имя пользователя`});
              }
              res.json({success: true, 
              message:'Новый пользователь успешно добавлен'});
          })
    } catch (err) {
        return res.status(500).json({success: false, message: 
            `Ошибка сервера: ${err}`});
    }  
}

module.exports = api;