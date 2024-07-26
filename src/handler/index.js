const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

function getAllJsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllJsFiles(filePath));
        } else if (file.endsWith('.js')) {
            results.push(filePath);
        }
    });

    return results;
}

module.exports = {
    registerEvents: (client) => {
        const eventFiles = getAllJsFiles(path.join(__dirname, '../events'));

        for (const filePath of eventFiles) {
            const event = require(filePath);
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    },

    registerCommands: async (client) => {
        const commands = [];
        const commandFiles = getAllJsFiles(path.join(__dirname, '../commands'));

        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

        for (const filePath of commandFiles) {
            const command = require(filePath);
            commands.push(command.data.toJSON());
        }

        try {
            console.log('Начинаю регистрацию глобальных команд.');

            await rest.put(
                Routes.applicationCommands(client.user.id), // Регистрация глобальных команд
                { body: commands },
            );

            console.log('Глобальные команды зарегистрированы!');
        } catch (error) {
            console.error(error);
        }
    }
};
