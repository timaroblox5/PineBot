const { Client, GatewayIntentBits } = require('discord.js');

// Создаем клиент с необходимыми интентами
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

// Логинимся с токеном
client.login(TOKEN);