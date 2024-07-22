// Функция для установки cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Преобразуем дни в миллисекунды
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"; // Сохраняем cookie в корневом пути
}

// Функция для получения cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';'); // Разбиваем cookie на массив
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Убираем пробелы
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length); // Возвращаем значение cookie
    }
    return null; // Если cookie не найдено
}

// Функция для удаления cookie
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;'; // Удаляем cookie
}

// Пример использования
setCookie('username', 'JohnDoe', 7); // Устанавливаем cookie на 7 дней
console.log(getCookie('username')); // Получаем значение cookie
eraseCookie('username'); // Удаляем cookie
