const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const User = require('./pd-db/userModel'); // Импортируйте модель пользователя

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Подключение к MongoDB
const mongoURI = 'mongodb+srv://BFFBOT:LLq-7NW-adG-e44@bffbot.hr7tpgj.mongodb.net/?retryWrites=true&w=majority&appName=BFFBOT'; // Замените на ваш URI MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB подключен'))
    .catch(err => console.log('Ошибка подключения к MongoDB:', err));

// Команды бота
client.once('ready', () => {
    console.log('PunoBot is online!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Игнорируем сообщения от ботов

    const args = message.content.trim().split(' ');

    // Команда для добавления пользователя
    if (args[0] === '!adduser' && args[1]) {
        const newUser = new User({ id: Date.now(), name: args[1] }); // ID можно генерировать, используя временные метки

        try {
            await newUser.save(); // Сохранение нового пользователя в базе данных
            message.channel.send(`Пользователь ${args[1]} добавлен!`);
        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
            message.channel.send('Ошибка при добавлении пользователя.');
        }
    }

    // Команда для вывода всех пользователей
    else if (args[0] === '!listusers') {
        try {
            const users = await User.find(); // Получение всех пользователей из базы данных
            if (users.length === 0) {
                message.channel.send('Нет пользователей.');
            } else {
                const userList = users.map(user => `${user.id}: ${user.name}`).join('\n');
                message.channel.send(`Список пользователей:\n${userList}`);
            }
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            message.channel.send('Ошибка при получении списка пользователей.');
        }
    }
});


const DB = process.env.MONGODB_PASSWORD; // Получаем токен из переменной окружения
client.login(DB);
const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения
client.login(TOKEN);