// boosty.js

const axios = require('axios');

const BOOSTY_API_URL = 'https://api.boosty.io/v1'; // Примерный адрес API
const BOOSTY_API_TOKEN = 'your_boosty_api_token'; // Замените на токен вашего API

// Функция для проверки подписки пользователя на Boosty
async function checkBoostySubscription(userId) {
    try {
        const response = await axios.get(`${BOOSTY_API_URL}/users/${userId}/subscriptions`, {
            headers: {
                'Authorization': `Bearer ${BOOSTY_API_TOKEN}`
            }
        });

        // Проверяем, есть ли у пользователя активная подписка
        const subscriptions = response.data.subscriptions || [];
        return subscriptions.some(subscription => subscription.active); // Предполагается, что есть свойство "active"
    } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        return false; // В случае ошибки считаем, что доступ не предоставляется
    }
}

module.exports = {
    checkBoostySubscription,
};
