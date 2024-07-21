const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const mongoose = require('./src/database/mongoose');
const config = require('./config.json');
const Levels = require('discord-xp');
const User = require('./src/models/User'); // Adjust the path as per your project structure
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Импортируем нужные компоненты из discord-modals

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Инициализация discord-modals
const discordModals = require('discord-modals');
discordModals(client);

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'src/commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Load interaction events
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
    client.user.setActivity("f!help", { type: "WATCHING" });
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

mongoose.init();

client.login(process.env.DISCORD_TOKEN).catch(console.error);
