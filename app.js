const { Client, Collection, GatewayIntentBits } = require('discord.js'); // Импортируйте GatewayIntentBits
const fs = require('fs');
const mongoose = require('./src/database/mongoose');
const config = require('./config.json');
const Levels = require('discord-xp');
const User = require('./src/models/User');
const discordModals = require('discord-modals');
const express = require('express');
const axios = require('axios'); // Убедитесь, что axios установлен
const cheerio = require('cheerio'); // Убедитесь, что cheerio установлен

const app = express();
const port = process.env.PORT || 3000;

// Создаем клиента
const client = new Client({
    intents: [GatewayIntentBits.All], // Включить все интенты
});
discordModals(client);

// Создаем коллекции для команд и событий
client.commands = new Collection();
client.events = new Collection(); // Создайте коллекцию для событий

// Загружаем команды
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Загружаем события
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    client.events.set(event.name, event); // Используйте event.name
    client.on(event.name, (...args) => event.execute(...args, client)); // Регистрация события
}

// Обработка интеракций
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
        setTimeout(startBot, 1000); // Попытка перезапуска через 1 секунду
    }
};

startBot(); // Запуск бота

// Запуск сервера Express
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
