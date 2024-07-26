const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
    registerEvents: (client) => {
        const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    },

    registerCommands: async (clientId, guildId, token) => {
        const commands = [];
        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }


        try {
            console.log('Начинаю регистрацию команд.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );

            console.log('Команды зарегистрированы!');
        } catch (error) {
            console.error(error);
        }
    }
};
