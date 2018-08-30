module.exports = (mongoose, config) => {
    const database = mongoose.connection;
    mongoose.Promise = Promise;
    mongoose.connect(config.database, {useNewUrlParser: true});

    database.on('error', err => 
    console.log(`Ошибка подключения к базе данных: ${err}`));
    database.on('connected', () => console.log('Соединение с базой данных'));
    database.on('disconnected', () => console.log('Отключение от базы данных'));

    process.on('STING', () => {
        database.close(() => {
            console.log('Процесс завершён. Соединение с базой данных закрыто');
            process.exit(0);
        })
    })
}