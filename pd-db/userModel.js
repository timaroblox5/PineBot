const mongoose = require('mongoose');

// Используем переменную окружения для пароля
const mongoURI = `mongodb+srv://BFFBOT:${process.env.MONGODB_PASSWORD}@bffbot.hr7tpgj.mongodb.net/test?retryWrites=true&w=majority&appName=BFFBOT`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB подключен'))
    .catch(err => console.error('Ошибка подключения:', err));

    // Определение схемы пользователя
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    coins: {
        type: Number,
        default: 0, // Начальное значение монет
    },
    level: {
        type: Number,
        default: 1, // Начальный уровень
    },
    experience: {
        type: Number,
        default: 0, // Начальное количество опыта
    },
});

// Создание модели на основе схемы
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;