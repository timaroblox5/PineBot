const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: {
        name: 'givesubscriber',
        description: 'Gives the user a subscriber status that allows them to activate the Sponsor role.',
        category: 'Admin', // Установите категорию для организации команд
    },
    async execute(message) {
        // ID роли, которая необходима для выполнения команды
        const adminRoleId = 'YOUR_ADMIN_ROLE_ID'; // Замените на настоящий ID роли, необходимой для выполнения команды

        // Проверка наличия роли по ID
        if (!message.member.roles.cache.has(adminRoleId)) {
            return message.channel.send('❌ У вас нет прав для выполнения этой команды.');
        }

        // ID роли "Subscriber"
        const subscriberRoleId = 'YOUR_SUBSCRIBER_ROLE_ID'; // Замените на настоящий ID роли
        const subscriberRole = message.guild.roles.cache.get(subscriberRoleId);

        if (!subscriberRole) {
            return message.channel.send('❌ Роль "Subscriber" не найдена на сервере.');
        }

        const member = message.mentions.members.first() || message.member;

        // Логика выдачи "подписки"
        try {
            await member.roles.add(subscriberRole);
            message.channel.send(`✅ ${member.displayName} получил статус подписчика! Теперь он может активировать роль "Спонсор".`);
        } catch (error) {
            console.error('Ошибка при добавлении роли:', error);
            message.channel.send('❌ Произошла ошибка при выдаче статуса подписчика. Пожалуйста, попробуйте позже.');
        }
    },
};
