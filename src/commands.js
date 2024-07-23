const commands = [
    {
        command: "!about",
        description: "Информация о боте."
    },
    {
        command: "!help",
        description: "Показать список доступных команд."
    },
    {
        command: "!leaderboard",
        description: "Показать таблицу лидеров."
    },
    {
        command: "!level",
        description: "Показать ваш уровень."
    },
    {
        command: "!work",
        description: "Выполнить работу и получить награду."
    }
];

// Функция для отображения команд на странице
function displayCommands() {
    const tableBody = document.querySelector("#commands-table tbody");
    commands.forEach(cmd => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cmd.command}</td>
            <td>${cmd.description}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Вызываем функцию при загрузке страницы
document.addEventListener("DOMContentLoaded", displayCommands);
