const Database = require('better-sqlite3');
const db = new Database('punoBotDatabase.db');

// Создание таблицы, если она не существует
db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");

// Вставка данных
db.prepare("INSERT INTO users (name) VALUES (?)").run("Tima");

// Чтение данных
const rows = db.prepare("SELECT id, name FROM users").all();
rows.forEach(row => {
    console.log(row.id + ": " + row.name);
});