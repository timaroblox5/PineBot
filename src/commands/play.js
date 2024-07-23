const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'play',
        description: 'Plays a song from YouTube.',
        options: [
            {
                type: 'STRING',
                name: 'url',
                description: 'The URL of the YouTube video',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        // Проверка если interaction доступен 
        if (!interaction || !interaction.options) {
            return interaction.reply('❌ Произошла ошибка, попробуйте снова!');
        }

        const url = interaction.options.getString('url');
        const member = interaction.member;

        const voiceChannel = member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('❌ Вы должны быть в голосовом канале для использования этой команды!');
        }

        const videoInfo = await ytdl.getInfo(url);
        const title = videoInfo.videoDetails.title;

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: member.guild.id,
            adapterCreator: member.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        connection.subscribe(player);

        const stream = ytdl(url, { filter: 'audioonly' });

        const resource = createAudioResource(stream, {
            inlineVolume: true,
        });

        player.play(resource);

        await interaction.reply(`▶️ Воспроизведение песни: **${title}**`);

        let timeout = null;

        const checkVoiceState = () => {
            const members = voiceChannel.members;
            if (members.size === 0) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    connection.destroy();
                    console.log('Бот покинул голосовой канал - никого не было в течение 5 минут');
                }, 5 * 60 * 1000);
            } else {
                clearTimeout(timeout);
                timeout = null;
            }
        };

        checkVoiceState();

        connection.on(VoiceConnectionStatus.Disconnected, () => {
            clearTimeout(timeout);
            console.log('Бот отключен от голосового канала.');
        });

        setInterval(checkVoiceState, 30 * 1000);
    },
};
