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

// Функция для загрузки обработчиков событий
const loadEvents = (client) => {
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client)); // Передаем client в обработчик
    }
};

// Функция для загрузки обработчиков событий
const loadhandlers = (client) => {
    const handlersFiles = fs.readdirSync(path.join(__dirname, 'handlers')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const handlers = require(`./handlers/${file}`);
        const handlersFiles = file.split('.')[0];
        client.on(handlersFiles, handlers.bind(null, client)); // Передаем client в обработчик
    }
};

// Функция для загрузки обработчиков событий
const loadstructures = (client) => {
    const structuresFiles = fs.readdirSync(path.join(__dirname, 'structures')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const structures = require(`./structures/${file}`);
        const structuresFiles = file.split('.')[0];
        client.on(structuresFiles, structures.bind(null, client)); // Передаем client в обработчик
    }
};

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
client.login(TOKEN);