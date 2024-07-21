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

// Функция для загрузки обработчиков
const loadevents = (client) => {
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (typeof event === 'function') {
            event(client);
            console.log(`Loaded event: ${file}`);
        } else {
            console.error(`event in file ${file} is not a function.`);
        }
    }
};

// Функция для загрузки обработчиков
const loadstructures = (client) => {
    const structureFiles = fs.readdirSync(path.join(__dirname, 'structures')).filter(file => file.endsWith('.js'));

    for (const file of structureFiles) {
        const structure = require(`./structures/${file}`);
        if (typeof structure === 'function') {
            structure(client);
            console.log(`Loaded structure: ${file}`);
        } else {
            console.error(`structure in file ${file} is not a function.`);
        }
    }
};

// Загрузка обработчиков
loadevents(client);
loadstructures(client);

const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN);