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
        setTimeout(startBot, 1000); // Попытка перезапуска через 5 секунд
    }
};

startBot(); // Запуск бота


// Запуск сервера Express
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});