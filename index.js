const { Client, GatewayIntentBits } = require('discord.js');
const User = require('./pd-db/userModel'); // Импортируйте модель пользователя

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
// Команды бота
client.once('ready', () => {
    console.log('PunoBot is online!');
});
const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
client.login(TOKEN);