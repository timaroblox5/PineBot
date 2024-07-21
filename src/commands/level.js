const { MessageEmbed } = require('discord.js');
const Levels = require('discord-xp');
const User = require('../models/User'); // Import the user model

module.exports = {
    data: {
        name: 'level',
        description: 'Generate a level card for a user',
        category: 'utility',
    },
    async execute(message, args, client) {
        try {
            const target = message.mentions.users.first() || message.author;
            
            // Fetch user's XP and level from discord-xp
            const xpData = await Levels.fetch(target.id, message.guild.id);
            if (!xpData) {
                return message.channel.send(`${target.username} has no XP yet.`);
            }

            // Fetch user's currency from your MongoDB database
            let user = await User.findOne({ userId: target.id, guildId: message.guild.id });
            if (!user) {
                // Create a new user if one doesn't exist
                user = new User({ userId: target.id, guildId: message.guild.id });
                await user.save();
            }

            const { level, xp } = xpData;
            const xpNeeded = Levels.xpFor(level + 1);

            const embed = new MessageEmbed()
                .setTitle(`${target.username}'s Level`)
                .setColor('#00FF00') // Example color
                .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                .addField('Level', level.toString(), true)
                .addField('XP', `${xp} / ${xpNeeded}`, true)
                .addField('BFF Points', (user.bffPoints || 0).toString(), true) // Display currency with default value
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing the level command:', error);

            const errorEmbed = new MessageEmbed()
                .setTitle('Error')
                .setDescription('There was an error while executing the command.')
                .setColor('#FF0000') // Red color for error
                .setTimestamp();

            message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
