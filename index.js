const { Client, GatewayIntentBits } = require('discord.js');
const db = require('./pb-db/index');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Логин бота
client.once('ready', () => {
    console.log('PinoBot is online!');

});

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
// Логинимся с токеном
client.login(TOKEN);