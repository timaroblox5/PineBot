document.addEventListener('DOMContentLoaded', () => {
    const profile = document.getElementById('profile');
    const profilePic = document.getElementById('profile-pic');
    const username = document.getElementById('username');
    const loginBtn = document.getElementById('login-btn');

    // Проверяем, есть ли данные пользователя в localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // Если данные есть, отображаем аватар и имя
        profilePic.src = user.avatar_url;
        profilePic.alt = user.username;
        username.textContent = user.username;
        profile.classList.remove('hidden');
        loginBtn.classList.add('hidden'); // Скрываем кнопку "Войти"
    }

    // Обработчик события нажатия кнопки "Войти"
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        // Перенаправляем пользователя на страницу авторизации Discord
        window.location.href = `https://discord.com/oauth2/authorize?client_id=1263856580970152020&response_type=code&redirect_uri=https%3A%2F%2Ftimaroblox5.github.io%2FPineBot%2Fservers&scope=identify+guilds`;
    });

    // Проверяем наличие кода в URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        // Отправляем запрос на сервер для обмена кода на токен и получения информации о пользователе
        fetch(`/servers?code=${code}`)
            .then(response => response.json())
            .then(data => {
                // Сохраняем информацию о пользователе в localStorage
                const userInfo = {
                    username: data.username,
                    avatar_url: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
                };
                localStorage.setItem('user', JSON.stringify(userInfo));

                // Обновляем интерфейс
                profilePic.src = userInfo.avatar_url;
                profilePic.alt = userInfo.username;
                username.textContent = userInfo.username;
                profile.classList.remove('hidden');
                loginBtn.classList.add('hidden'); // Скрываем кнопку "Войти"

                // Скрываем параметр code из URL
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: newUrl }, '', newUrl);
            })
            .catch(error => {
                console.error('Ошибка при получении данных пользователя:', error);
            });
    }
});
//.