const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const mongoose = require('./src/database/mongoose');
const config = require('./config.json');
const Levels = require('discord-xp');
const User = require('./src/models/User');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const discordModals = require('discord-modals');
const express = require('express');
const axios = require('axios'); // Убедитесь, что axios установлен
const cheerio = require('cheerio'); // Убедитесь, что cheerio установлен

const app = express();
const port = process.env.PORT || 3000; // Укажите порт, если нужно

// Создаем клиента
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
discordModals(client);

client.commands = new Collection();

// Обработка входящего вебхука
app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    if (req.body.action === 'push') {
        console.log('Received a push event! Restarting bot...');
        // Логика для перезапуска бота, если нужно
        // Можно реализовать это через process.exit() или использовать PM2
    }
    res.status(200).send('Webhook received');
});

// Загрузка команд
const commandFiles = fs.readdirSync(path.join(__dirname, 'src/commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    
    // Проверка на структуру команды
    if (!command.data || !command.data.name) {
        console.error(`Команда в файле ${file} не имеет правильной структуры.`);
        continue; // Пропустить этот файл
    }

    client.commands.set(command.data.name, command);
}

const CHANNEL_ID = '1264719358563979325';
const CHECK_INTERVAL = 300000; // 5 минут

let lastContent = ''; // Переменная для хранения последнего контента

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(checkWebsite, CHECK_INTERVAL);

    // Отправляем сообщение в канал
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        channel.send('Привет, мир! Это сообщение от бота.').catch(console.error);
    } else {
        console.log('Канал не найден');
    }
});

async function checkWebsite() {
    try {
        const response = await axios.get('https://timaroblox5.github.io/PineBot/');
        const $ = cheerio.load(response.data);
        
        // Предположим, что вы хотите проверить текст в определенном элементе
        const newContent = $('#targetElementId').text(); // Замените на корректный селектор

        if (newContent !== lastContent) {
            lastContent = newContent;
            const channel = client.channels.cache.get(CHANNEL_ID);
            if (channel) {
                channel.send('Содержимое сайта обновилось!').catch(console.error);
            }
        }
    } catch (error) {
        console.error('Ошибка проверки сайта:', error);
    }
}

// Загрузка событий
const eventFiles = fs.readdirSync(path.join(__dirname, 'src/events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.on('ready', async () => {
    client.user.setActivity("!help", { type: "WATCHING" });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error executing this command!",
            ephemeral: true,
        });
    }
});

// Инициализация базы данных
mongoose.init();

const startBot = async () => {
    try {
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('Failed to login:', error);
        setTimeout(startBot, 5000); // Попытка перезапуска через 5 секунд
    }
};

startBot(); // Запуск бота


// Запуск сервера Express
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});