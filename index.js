const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = './users.json'; // Убедитесь, что путь правильный

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Убедитесь, что файл данных существует и инициализируйте его
let users = [];
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([])); // Создание пустого массива, если файла нет
} else {
    // Чтение и парсинг данных
    const rawData = fs.readFileSync(path, 'utf8'); // Чтение файла как UTF-8
    if (rawData) {
        try {
            users = JSON.parse(rawData); // Парсинг данных
        } catch (error) {
            console.error("Ошибка при парсинге JSON:", error);
            // Если возникла ошибка, инициализируем массив как пустой
            users = [];
        }
    }
}

client.once('ready', () => {
    console.log('PunoBot is online!');

    // Пример добавления пользователя
    users.push({ id: users.length + 1, name: 'Puno' });

    // Сохранение данных обратно в JSON-файл
    fs.writeFileSync(path, JSON.stringify(users, null, 2));

    // Чтение и вывод данных
    users.forEach(user => {
        console.log(user.id + ": " + user.name);
    });
});

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
client.login(TOKEN);