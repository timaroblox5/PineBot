const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: {
        name: 'help',
        description: 'Display list of available commands or get help on a specific command',
        usage: '[category]',
    },
    execute(message, args, client) {
        // Initialize an empty MessageEmbed
        const embed = new MessageEmbed()
            .setColor(config.EMBED_COLOR);

        const commands = client.commands;

        if (args.length > 0) {
            const category = args.join(' ').toLowerCase();

            // Filter commands by the provided category
            const commandsArray = Object.values(commands);
            const categoryCommands = commandsArray.filter(cmd => cmd.data.category && cmd.data.category.toLowerCase() === category);

            if (categoryCommands.size > 0) {
                embed.setTitle(`Commands in category: ${category}`)
                    .setDescription(categoryCommands.map(cmd => `\`${cmd.data.name}\`: ${cmd.data.description}`).join('\n'));
            } else {
                embed.setTitle('Category not found')
                    .setDescription(`No commands found for category: ${category}`);
            }
        } else {
            // Display all commands if no category is provided
            embed.setTitle('Available Commands')
                .setDescription(commands.map(cmd => `\`${cmd.data.name}\`: ${cmd.data.description}`).join('\n'));
        }

        // Send the embed
        message.channel.send({ embeds: [embed] });
    },
};
