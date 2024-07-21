const { Client, GatewayIntentBits, Collection } = require('discord.js'); // Добавьте Collection
const fs = require('fs');
const path = require('path');
const Config = require('./config.json'); // Импортируйте конфигурацию
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
client.commands = new Collection(); // Используйте импортированную Collection

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const loadEvents = (client) => {
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        const eventName = event.name;

        // Убедитесь, что event.execute — это функция
        if (typeof event.execute === 'function') {
            client.on(eventName, (...args) => event.execute(client, ...args));
        } else {
            console.error(`Event in file ${file} does not export an execute function.`);
        }
    }
};

const loadHandlers = (client) => {
    const handlerFiles = fs.readdirSync(path.join(__dirname, 'handlers')).filter(file => file.endsWith('.js'));

    for (const file of handlerFiles) {
        const handler = require(`./handlers/${file}`);
        const handlerName = file.split('.')[0];
        client.on(handlerName, handler.bind(null, client));
    }
};

const loadstructures = (client) => {
    const structureFiles = fs.readdirSync(path.join(__dirname, 'structures')).filter(file => file.endsWith('.js'));

    for (const file of structureFiles) {
        const structure = require(`./structures/${file}`);
        const structureName = file.split('.')[0];
        client.on(structureName, structure.bind(null, client));
    }
};

// Загружаем обработчики и структуры
loadEvents(client);
loadHandlers(client);
loadstructures(client);

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
client.login(TOKEN);