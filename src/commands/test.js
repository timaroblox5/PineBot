const { MessageAttachment } = require('discord.js');
const { createCanvas } = require('canvas');

module.exports = {
    name: 'card',
    description: 'Создает карточку пользователя',
    async execute(message) {
        // Создаем холст
        const width = 400;
        const height = 200;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Рисуем фон (градиент)
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#3498db');
        gradient.addColorStop(1, '#2980b9');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Добавляем текст
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(message.author.username, 50, 50);
        
        ctx.font = '20px sans-serif';
        ctx.fillText(`ID: ${message.author.id}`, 50, 100);

        // Рисуем границу
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Конвертируем холст в буфер
        const buffer = canvas.toBuffer();

        // Создаем вложение (attachment) и отправляем его
        const attachment = new MessageAttachment(buffer, 'card.png');
        await message.channel.send({ files: [attachment] });
    },
};