// Index.js
const { Client, GatewayIntentBits } = require('discord.js');

// Создаем клиент с необходимыми интентами
const client = new Client({intents: [32000] });

const TOKEN = process.env.DISCORD_TOKEN; // Берем токен из переменной окружения

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

client.login(TOKEN);