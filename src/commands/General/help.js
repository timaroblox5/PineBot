const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

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
            const categoryCommands = Array.from(commands.values()).filter(cmd => cmd.data.category && cmd.data.category.toLowerCase() === category);

            if (categoryCommands.length > 0) {
                embed.setTitle(`Commands in category: ${category.charAt(0).toUpperCase() + category.slice(1)}`)
                    .setDescription(categoryCommands.map(cmd => `\`${cmd.data.name}\`: ${cmd.data.description}`).join('\n'));
            } else {
                embed.setTitle('Category not found')
                    .setDescription(`No commands found for category: ${category}`);
            }
        } else {
            // Display all commands if no category is provided
            const allCommands = Array.from(commands.values());
            const groupedCommands = allCommands.reduce((acc, cmd) => {
                const category = cmd.data.category || 'Uncategorized';
                if (!acc[category]) acc[category] = [];
                acc[category].push(`\`${cmd.data.name}\`: ${cmd.data.description}`);
                return acc;
            }, {});

            embed.setTitle('Available Commands');
            Object.entries(groupedCommands).forEach(([category, cmds]) => {
                embed.addField(category, cmds.join('\n'), false);
            });
        }

        // Send the embed
        message.channel.send({ embeds: [embed] });
    },
};
