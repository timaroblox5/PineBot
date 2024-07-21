const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Config = require('./config.json');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Загружаем команды
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const loadhandlers = (client) => {
    const handlerFiles = fs.readdirSync(path.join(__dirname, 'handlers')).filter(file => file.endsWith('.js'));

    for (const file of handlerFiles) {
        const handler = require(`./handlers/${file}`);
        const handlerName = file.split('.')[0];

        // Убедитесь, что handler — это функция
        if (typeof handler === 'function') {
            client.on(handlerName, handler.bind(null, client));
        } else {
            console.error(`Handler in file ${file} is not a function.`);
        }
    }
};

// Загружаем обработчики
loadhandlers(client);

const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN);