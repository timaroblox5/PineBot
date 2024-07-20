const { Client, GatewayIntentBits } = require('discord.js');

// Создаем клиент с необходимыми интентами
const client = new Client({ intents: [GatewayIntentBits.All] });

const TOKEN = process.env.TOKEN; // Берем токен из переменной окружения

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

client.login(TOKEN);