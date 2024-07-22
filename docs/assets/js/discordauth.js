const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/servers', async (req, res) => {
    const code = req.query.code;

    try {
        // Получение токена
        const { data } = await axios.post(`https://discord.com/api/oauth2/token`, new URLSearchParams({
            client_id: '1263856580970152020',
            client_secret: process.env.CLIENT_SECRET, // Ваш клиентский секрет
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://timaroblox5.github.io/PineBot/servers', // URI должен совпадать с тем, что вы указали в Discord
            scope: 'identify guilds'
        }));

        // Получение информации о пользователе
        const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${data.access_token}`
            }
        });

        res.json(userResponse.data); // Вернуть данные пользователя
    } catch (error) {
        console.error('Error during Discord OAuth:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//.