const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
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

// Загружаем команды
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Функция для загрузки обработчиков событий
const loadEvents = (client) => {
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client)); // Передаем client в обработчик
    }
};

// Функция для загрузки обработчиков
const loadHandlers = (client) => {
    const handlerFiles = fs.readdirSync(path.join(__dirname, 'handlers')).filter(file => file.endsWith('.js'));

    for (const file of handlerFiles) {
        const handler = require(`./handlers/${file}`);
        const handlerName = file.split('.')[0];
        client.on(handlerName, handler.bind(null, client)); // Передаем client в обработчик
    }
};

// Функция для загрузки структур (если вы это планируете)
const loadStructures = (client) => {
    const structureFiles = fs.readdirSync(path.join(__dirname, 'structures')).filter(file => file.endsWith('.js'));

    for (const file of structureFiles) {
        const structure = require(`./structures/${file}`);
        const structureName = file.split('.')[0];
        client.on(structureName, structure.bind(null, client)); // Передаем client в обработчик
    }
};

// Загрузка событий, обработчиков и структур
loadEvents(client);
loadHandlers(client);
loadStructures(client);

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
client.login(TOKEN);