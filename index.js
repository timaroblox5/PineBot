// Index.js
const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.DISCORD_TOKEN; // Берем токен из переменной окружения

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('message', message => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

client.login(process.env.DISCORD_TOKEN);