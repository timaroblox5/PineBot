const { Client, GatewayIntentBits } = require('discord.js');

// Создаем клиента с необходимыми интентами
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

const TOKEN = process.env.DISCORD_TOKEN; // Получаем токен из переменной окружения

client.once('ready', () => {
    console.log('Bot is online!');

    // Устанавливаем статус активности
    try {
        client.user.setPresence({
            activities: [{ name: 'By Tima_Games', type: 'WATCHING' }],
            status: 'online',
        });
    } catch (error) {
        console.error('Error setting presence:', error);  // Обработка ошибок
    }
});

// Логинимся с токеном
client.login(TOKEN);