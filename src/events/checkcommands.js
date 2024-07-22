const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'checkcommands',
    once: true,
    execute(client) {
        const commandsDir = path.join(__dirname, '../commands');

        fs.readdir(commandsDir, (err, files) => {
            if (err) {
                console.error('Ошибка при чтении директории с командами:', err);
                return;
            }

            files.forEach(file => {
                try {
                    const command = require(path.join(commandsDir, file));
                    console.log(`🟢 ${file} работает`);
                } catch (error) {
                    console.log(`🔴 ${file} не работает: ${error}`);
                }
            });
        });
    },
};
