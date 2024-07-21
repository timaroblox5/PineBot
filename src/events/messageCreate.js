const { MessageEmbed } = require('discord.js');
const Levels = require('discord-xp');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        try {
            if (!message || !message.author || message.author.bot) return;

            // Проверяем, является ли сообщение командой
            if (message.content.startsWith(config.PREFIX)) {
                // Это команда, поэтому обрабатываем её
                const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();

                const command = client.commands.get(commandName);
                if (command) {
                    await command.execute(message, args, client);
                }
                return; // Возвращаемся, чтобы не добавлять XP за команду
            }

            // Добавляем XP для обычных сообщений
            const xpToAdd = Math.floor(Math.random() * 5) + 1;
            const xpData = await Levels.appendXp(message.author.id, message.guild.id, xpToAdd);

            if (xpData && xpData.levelUp) {
                let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
                if (!user) {
                    user = new User({ userId: message.author.id, guildId: message.guild.id });
                }
                user.level = xpData.level;
                await user.save();
            }
        } catch (error) {
            console.error('Error processing message event:', error);

            if (message.channel) {
                const embedError = new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('An error occurred while processing your message.')
                    .setTimestamp();

                message.channel.send({ embeds: [embedError] }).catch(console.error);
            }
        }
    },
};