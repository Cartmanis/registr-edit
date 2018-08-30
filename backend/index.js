const http = require('http');

const app = require('./config/app');
const Server = http.Server(app);
const PORT = process.env.PORT || 3001;
const LOCAL = '0.0.0.0';

Server.listen(PORT, LOCAL, () => {
    console.log(`Приложение запущенно на порту: ${PORT}`);
})

