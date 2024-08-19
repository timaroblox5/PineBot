const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: {
        name: 'about',
        description: 'Display information about the bot.',
        category: 'general',
    },
    async execute(message, args, client) {
        try {
            const embed = new MessageEmbed()
                .setTitle('About This Bot')
                .setDescription('This is a bot built with discord.js!')
                .setColor(config.EMBED_COLOR);

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('An error occurred while executing the about command:', error);
        }
    }
};