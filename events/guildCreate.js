const Config = require('..config.json');

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        await Log.init(client);

        // Логируем, что бот присоединился к новой гильдии
        console.log(`Бот присоединился к новому серверу: ${guild.name} (ID: ${guild.id})`);

        // Выбор канала для отправки приветственного сообщения
        const generalChannel = guild.channels.cache.find(channel => channel.name === 'general' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));

        if (generalChannel) {
            generalChannel.send(`Привет, я ваш новый бот! Спасибо, что добавили меня на сервер! 🎉`);
        }

        // Здесь вы можете инициализировать базу данных или другую конфигурацию
        // await Database.initializeGuild(guild.id);
    }
}