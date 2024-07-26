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
const handler = require('./src/handler/index');

const app = express();
const port = process.env.PORT || 3000; // Укажите порт, если нужно

// Создаем клиента
const client = new Client({
    intents: [GatewayIntentBits.All], // Включить все интенты
});
discordModals(client);

client.commands = new Collection();

// Регистрация событий
handler.registerEvents(client);

// Регистрация текстовых команд
handler.registerCommands(client);


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

// Регистрация событий
handler.registerEvents(client);

// Регистрация команд при запуске бота
handler.registerCommands(client);


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