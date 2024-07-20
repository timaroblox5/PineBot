const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { QuickDB } = require('quick.db');
const Logger = require('./structures/Logger'); // Импортируем модуль логирования
const ConfigUtil = require('./structures/ConfigUtil'); // Импортируем конфигурацию
global.Config = new ConfigUtil(); // Глобальная конфигурация
global.Log = new Logger(); // Глобальный логгер
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages // Добавьте, если нужно
    ],
});

client.commands = new Collection(); // Хранение команд
client.db = new QuickDB(); // Инициализация базы данных

client.once('ready', () => {
    console.log('PunoBot is online!');
    Log.send(`[INDEX] Инициализация бота`);
});

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
client.login(TOKEN)
    .then(async () => {
        await Log.init(client); // Инициализация логирования
        // Инициализация обработчиков событий и команд
        require('./handlers/events.js').init(client);
        require('./handlers/commands.js').init(client);
    })
    .catch(error => console.error('Ошибка входа в Discord:', error));

// Обработка ошибок
client.on('error', Log.error);
client.on('warn', Log.error);
process.on('uncaughtException', Log.error);
process.on('unhandledRejection', Log.error);

module.exports = client; // Экспортируем клиент