// commands/help.js
module.exports = {
    name: 'help',
    description: 'Показать список доступных команд',
    execute(message, args) {
        const commands = [
            { name: '!help', description: 'Показать список доступных команд' },
            { name: '!profile', description: 'Показать ваш профиль (монеты и уровень)' },
            // Добавьте другие команды здесь
        ];

        const commandList = commands
            .map(cmd => `${cmd.name}: ${cmd.description}`)
            .join('\n');

        message.channel.send(`Вот список доступных команд:\n${commandList}`);
    },
};