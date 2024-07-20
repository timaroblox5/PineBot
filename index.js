const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = './users.json';

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
    const rawData = fs.readFileSync(path, 'utf8');
    
    if (rawData.trim() === "") {
        users = [];
    } else {
        try {
            users = JSON.parse(rawData);
        } catch (error) {
            console.error("Ошибка при парсинге JSON:", error);
            users = [];
        }
    }
}

client.once('ready', () => {
    console.log('PunoBot is online!');
});

// Функция для сохранения пользователей в файл
function saveUsers() {
    try {
        fs.writeFileSync(path, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Ошибка при записи в файл:", error);
    }
}

// Команды бота
client.on('messageCreate', message => {
    if (message.author.bot) return; // Игнорируем сообщения от ботов

    const args = message.content.trim().split(' ');

    // Команда для добавления пользователя
    if (args[0] === '!adduser' && args[1]) {
        const newUser = { id: users.length + 1, name: args[1] };
        users.push(newUser);
        saveUsers();
        message.channel.send(`Пользователь ${args[1]} добавлен!`);
    }

    // Команда для вывода всех пользователей
    else if (args[0] === '!listusers') {
        if (users.length === 0) {
            message.channel.send('Нет пользователей.');
        } else {
            const userList = users.map(user => `${user.id}: ${user.name}`).join('\n');
            message.channel.send(`Список пользователей:\n${userList}`);
        }
    }
});

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
client.login(TOKEN);