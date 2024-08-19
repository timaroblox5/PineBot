const { MessageEmbed } = require('discord.js');
const Ranks = require('discord-xp');
const User = require('../../models/User'); // Import the user model
const config = require('../../../config.json');

module.exports = {
    data: {
        name: 'rank',
        description: 'Generate a rank card for a user',
        category: 'utility',
    },
    async execute(message, args, client) {
        try {
            const target = message.mentions.users.first() || message.author;
            
            // Fetch user's XP and rank from discord-xp
            const xpData = await Ranks.fetch(target.id, message.guild.id);
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

            const { rank, xp } = xpData;
            const xpNeeded = Ranks.xpFor(rank + 1);

            const embed = new MessageEmbed()
                .setTitle(`${target.username}'s Level`)
                .setColor('#00FF00') // Example color
                .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                .addField('Level', rank.toString(), true)
                .addField('XP', `${xp} / ${xpNeeded}`, true)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing the rank command:', error);

            const errorEmbed = new MessageEmbed()
                .setTitle('Error')
                .setDescription('There was an error while executing the command.')
                .setColor('#FF0000') // Red color for error
                .setTimestamp();

            message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
