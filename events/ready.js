const Config = require('..config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('PunoBot is online!');
    }
};