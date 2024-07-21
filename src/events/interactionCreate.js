module.exports = {
    name: "interactionCreate",
    once: false, // Устанавливаем в true, если хотите, чтобы обработчик сработал только один раз
    execute(interaction) {

        client.on('interactionCreate', interaction => {
            if (!interaction.isUserContextMenu()) return;
            // Get the User's username from context menu
            const name = interaction.targetUser.username;
            console.log(name);
        });
    },
};