module.exports = {
    name: 'ready',
    once: true, // Событие будет вызвано только один раз
    execute(client) {
        console.log(`Бот ${client.user.tag} готов к работе!`);
    },
};
