const { EmbedBuilder } = require("discord.js");
const Config = require('..config.json');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        await Log.init(client);
        message.content = message.content.replace(`<@!${client.user.id}>`, ``).trim();
        const prefix = Config.prefix;
        if (!message.content.startsWith(prefix)) return;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift();
        const cmd = client.commands.get(command);

        if (cmd && cmd.type.includes(Config.CommandType.CHAT)) {
            // Вызываем
            cmd.exec(client, message)
                .catch((e) => {
                    // Сообщаем об ошибке
                    Log.error(`[EVENT/MESSAGECREATE] Ошибка выполнения команды ${cmd.name}: ${e}`);
                    message.reply({
                        embeds: [
                            new EmbedBuilder()                                
                                .setDescription(`Ошибка выполнения команды ${cmd.name}: ${e}`)
                                .setColor(Config.embed_color)
                        ],
                        ephemeral: true // Это может быть проблемой, так как ephemeral работает только для интеракций
                    });
                });
        }
    }
}