// Используем сессии
app.use(session({
    secret: 'your-secret-key', // Замените на ваш секретный ключ
    resave: false,
    saveUninitialized: true
}));

// Подключаем статические файлы
app.use(express.static(path.join(__dirname, '../')));

// Route для главной страницы
app.get('/docs/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/docs/@me.html');
    }
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Route для диспетчеризации OAuth 2.0
app.get('/auth/discord', (req, res) => {
    const redirectUri = encodeURIComponent('http://127.0.0.1:5500/auth/discord/callback');
    const authUrl = `https://discord.com/oauth2/authorize?client_id=1263856580970152020&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
    res.redirect(authUrl);
});

// Route для обработки токена после авторизации Discord
app.get('/auth/discord/callback', async (req, res) => {
    const code = req.query.code;
    if (code) {
        try {
            const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'client_id': '1263856580970152020', // Ваш Client ID
                    'client_secret': 'ВАШ_CLIENT_SECRET', // Ваш Client Secret
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': 'http://127.0.0.1:5500/auth/discord/callback',
                })
            });

            const tokenData = await tokenResponse.json();

            if (!tokenResponse.ok) {
                console.error('Error fetching token:', tokenData);
                return res.redirect('/docs/');
            }

            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`
                }
            });

            const userData = await userResponse.json();
            if (!userResponse.ok) {
                console.error('Error fetching user data:', userData);
                return res.redirect('/docs/');
            }

            req.session.user = userData; // Сохраняем информацию о пользователе
            return res.redirect('/docs/@me.html');
        } catch (error) {
            console.error('Error during fetch:', error);
            return res.redirect('/docs/');
        }
    }
    res.redirect('/docs/');
});

// Route для @me.html
app.get('/docs/@me.html', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/docs/');
    }
    res.sendFile(path.join(__dirname, '../@me.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});
