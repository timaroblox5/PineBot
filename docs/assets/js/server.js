const express = require('express');
const session = require('express-session');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Настройка сессий
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Простая база данных для хранения пользователей
const users = {}; // { discordId: { ...userData } }

app.get('/auth', (req, res) => {
    if (req.query.code) {
        // Здесь должна быть логика для обмена кода на токен
        // Получите данные на основе токена и сохраните их в users
        const discordId = 'user_id'; // Из полученных данных
        users[discordId] = { ... }; // Сохранить данные пользователя
        req.session.userId = discordId; // Сохранить в сессии
        return res.redirect('/@me');
    }
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=ВАШ_CLIENT_ID&redirect_uri=http://localhost:${PORT}/auth&response_type=code&scope=identify%20email`);
});

// Проверка авторизации
app.get('/@me', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth');
    }
    const userData = users[req.session.userId];
    res.send(`<h1>Добро пожаловать, ${userData.username}</h1><p>Email: ${userData.email}</p>`);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
