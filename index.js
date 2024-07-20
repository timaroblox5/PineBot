const { Client, GatewayIntentBits } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pd-db/pinoBotDatabase.db');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");
});

// Логин бота
client.once('ready', () => {
    console.log('PinoBot is online!');

    // Пример добавления пользователя (на ваше усмотрение)
    const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
    stmt.run("Pino");
    stmt.finalize();

    // Пример чтения пользователей
    db.each("SELECT id, name FROM users", (err, row) => {
        console.log(row.id + ": " + row.name);
    });
});

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
// Логинимся с токеном
client.login(TOKEN);