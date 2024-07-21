const { InteractionType, EmbedBuilder } = require("discord.js");
const cooldown = new Map();

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        await Log.init(client);

        // Кулдаун на команды
        if (![InteractionType.ApplicationCommandAutocomplete, InteractionType.ModalSubmit].includes(interaction?.type)) {
            const _cooldown = cooldown.get(interaction.user.id) ?? 0;
            if (Date.now() - _cooldown < 2000) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`На команды бота установлен кулдаун :/`)
                            .setColor(Config.embed_color)
                    ],
                    ephemeral: true
                });
            }
            cooldown.set(interaction.user.id, Date.now());
        }

        // Slash команды и Autocomplete
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand() || interaction?.type == InteractionType.ApplicationCommandAutocomplete) {
            const cmd = client.commands.get(interaction.commandName);
            if (cmd) {
                handleCommandExecution(cmd, client, interaction);
            }
        } else {
            handleComponentInteraction(client, interaction);
        }
    }
};

// Обработчик выполнения команд
async function handleCommandExecution(cmd, client, interaction) {
    const _catch = (e) => {
        Log.error(`[EVENT/INTERACTIONCREATE] Ошибка выполнения команды ${cmd.name}: ${e}`);
        return interaction.reply({
            embeds: [
                new EmbedBuilder()                                
                    .setDescription(`Ошибка выполнения команды ${cmd.name}`)
                    .setColor(Config.embed_color)
            ],
            ephemeral: true
        });
    };

    if (interaction?.type == InteractionType.ApplicationCommandAutocomplete) {
        cmd.autocomplete(client, interaction).catch(_catch);
    } else {
        cmd.exec(client, interaction).catch(_catch);
    }
}

// Обработчик взаимодействий с компонентами
async function handleComponentInteraction(client, interaction) {
    let found = false;
    for (let cmdkey of client.commands.keys()) {
        const cmd = client.commands.get(cmdkey);
        let regexName = cmd.componentsNames.some(name => name.includes('...') && interaction.customId.includes(name.replace('...', '')));

        if ((cmd.componentsNames.includes(interaction.customId) || regexName) && await cmd.componentListener(client, interaction)
        ) {
            found = true;
            break; // Если нашли, можно выйти из цикла
        }
    }

    if (!found && !interaction.replied) {
        interaction.deferUpdate(); // Отложенный ответ, если ничего не нашлось
    }
}