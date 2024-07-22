const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/servers', async (req, res) => {
    const code = req.query.code;

    // Получение токена
    const { data } = await axios.post(`https://discord.com/api/oauth2/token`, new URLSearchParams({
        client_id: '1263856580970152020',
        client_secret: 'YOUR_CLIENT_SECRET', // Ваш клиентский секрет
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://timaroblox5.github.io/PineBot/servers', // Убедитесь, что этот URI совпадает с тем, что вы указали в Discord
        scope: 'identify guilds'
    }));

    // Получение информации о пользователе
    const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `Bearer ${data.access_token}`
        }
    });

    res.json(userResponse.data); // Вернуть данные пользователя
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
