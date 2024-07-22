const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Levels = require('discord-xp');
const config = require('../../config.json');
let currentPage = 1;

module.exports = {
    data: {
        name: 'leaderboard',
        description: 'Display the XP leaderboard.',
    },
    async execute(message, args, client) {
        if (!client) {
            console.error('Discord client is not provided.');
            return;
        }

        try {
            const leaderboardData = await Levels.fetchLeaderboard(message.guild.id, 10);
            if (!Array.isArray(leaderboardData)) {
                throw new Error('Leaderboard data is not an array.');
            }

            const embeddedFields = leaderboardData.map((user, position) => {
                let placeEmoji;
                switch (position) {
                    case 0:
                        placeEmoji = '🥇';
                        break;
                    case 1:
                        placeEmoji = '🥈';
                        break;
                    case 2:
                        placeEmoji = '🥉';
                        break;
                }
                const username = client.users.cache.get(user.userID)?.username || 'Unknown User';
                return {
                    name: `${placeEmoji} ${username}`,
                    value: `Level: ${user.level} | XP: ${user.xp}`,
                    inline: false,
                };
            });

            // Добавление счетчика страниц
            embeddedFields.push({
                name: 'Page',
                value: `Page: ${currentPage}`,
                inline: true,
            });

            const leaderboardEmbed = new MessageEmbed()
                .setColor(config.EMBED_COLOR)
                .setTitle('XP Leaderboard')
                .addFields(embeddedFields);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('previous')
                        .setLabel('⬅️ Left')
                        .setStyle('PRIMARY')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('close')
                        .setLabel('❌ Close')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('next')
                        .setLabel('➡️ Right')
                        .setStyle('PRIMARY')
                );

            const sentMessage = await message.channel.send({
                embeds: [leaderboardEmbed],
                components: [row],
            });

            const filter = i => i.user.id === message.author.id;
            const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'previous' && currentPage > 1) {
                    currentPage--;
                    // Обработка перемещения на предыдущую страницу и обновление встроенного сообщения
                } else if (i.customId === 'next' && currentPage > 1) {
                    currentPage++;
                    // Обработка перемещения на следующую страницу и обновление встроенного сообщения
                } else if (i.customId === 'close') {
                    sentMessage.edit({
                        components: [],
                    }).catch(console.error);
                    collector.stop();
                }
            });

        } catch (error) {
            console.error('Error processing leaderboard command:', error);

            const embedError = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription('An error occurred while processing the leaderboard command.')
                .setTimestamp();

            message.channel.send({ embeds: [embedError] }).catch(console.error);
        }
    },
};