const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: {
        name: 'activateSponsor',
        description: 'Activates the Sponsor role for the user.',
        category: 'Roles',
    },
    async execute(message) {
        const member = message.member;

        // Поиск роли "Спонсор" на сервере
        const sponsorRole = message.guild.roles.cache.find(role => role.name === 'Sponsor');

        if (!sponsorRole) {
            return message.channel.send('❌ Роль "Спонсор" не найдена на сервере.');
        }

        // Проверка, уже есть ли у пользователя эта роль
        if (member.roles.cache.has(sponsorRole.id)) {
            return message.channel.send('❌ У вас уже есть роль "Спонсор".');
        }

        try {
            // Добавление роли пользователю
            await member.roles.add(sponsorRole);
            message.channel.send('✅ Ваша роль "Спонсор" активирована!');
        } catch (error) {
            console.error('Ошибка при добавлении роли:', error);
            message.channel.send('❌ Произошла ошибка при активации вашей роли. Пожалуйста, попробуйте позже.');
        }
    },
};
