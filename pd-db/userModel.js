const mongoose = require('mongoose');

// Используем переменную окружения для пароля
const mongoURI = `mongodb+srv://BFFBOT:${process.env.MONGODB_PASSWORD}@bffbot.hr7tpgj.mongodb.net/test?retryWrites=true&w=majority&appName=BFFBOT`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB подключен'))
    .catch(err => console.error('Ошибка подключения:', err));