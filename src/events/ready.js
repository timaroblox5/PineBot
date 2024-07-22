module.exports = {
    name: 'ready',
    once: true, // Событие будет вызвано только один раз
    execute(client) {
        console.log(`Бот ${client.user.tag} готов к работе!`);
        const CHANNEL_ID = '1264719358563979325';
         // Находим канал по ID
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        // Отправляем сообщение
        channel.send('Привет, мир! Это сообщение от бота.').catch(console.error);
    } else {
        console.log('Канал не найден');
    }
    },
};