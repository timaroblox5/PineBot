const { MessageEmbed } = require('discord.js');
const User = require('../models/User'); // Adjust the path as per your project structure
const config = require('../../config.json');

module.exports = {
    data: {
        name: 'work',
        description: 'Work to earn currency',
    },
    async execute(message, args, client) {
        try {
            // Fetch user data from the database
            let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });

            if (!user) {
                user = await User.create({ userId: message.author.id, guildId: message.guild.id });
            }

            const now = Date.now();
            const cooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            const lastWorked = user.lastWorked || 0;

            if (now - lastWorked < cooldown) {
                const timeLeft = cooldown - (now - lastWorked);
                const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
                const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                const secondsLeft = Math.floor((timeLeft % (60 * 1000)) / 1000);

                const embedCooldown = new MessageEmbed()
                    .setTitle('Work Command')
                    .setDescription(`You can work again in ${hoursLeft} hours, ${minutesLeft} minutes, and ${secondsLeft} seconds.`)
                    .setColor('#FF0000') // Red color for cooldown
                    .setTimestamp();

                return message.channel.send({ embeds: [embedCooldown] });
            }

            // Simulate working and earning rewards (currency in this case)
            const earnedCurrency = Math.floor(Math.random() * 50) + 20; // Random currency between 20 and 70

            // Update user's default currency (BFF points) and lastWorked timestamp
            user.Points += earnedCurrency;
            user.lastWorked = now;

            // Save the user data to the database
            await user.save();

            // Create and send an embed to notify the user about their earnings
            const embed = new MessageEmbed()
                .setTitle('Work Command')
                .setDescription(`You worked and earned ${earnedCurrency} points!`)
                .setColor('#00FF00') // Green color
                .setTimestamp();

            message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error executing work command:', error);

            // Handle errors with an embed
            const embedError = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription('An error occurred while processing your work command.')
                .setTimestamp();

            message.channel.send({ embeds: [embedError] });
        }
    },
};
