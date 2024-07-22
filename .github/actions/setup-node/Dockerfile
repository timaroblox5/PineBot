# Используем базовый образ Node.js
FROM node:20

# Задаём рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Запускаем бота и веб-сервер с помощью PM2
RUN npm install -g pm2

# Запускаем процессы
CMD ["pm2-runtime", "start", "app.js", "--name", "pinebot", "--watch", "--ignore-watch", "node_modules", "--max-restarts", "30"]
