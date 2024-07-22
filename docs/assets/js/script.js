document.getElementById('login-btn').addEventListener('click', function() {
    // Здесь можно добавить логику для авторизации пользователя
    // Например, используйте oAuth для Discord

    // Пример: после успешной авторизации
    const user = {
        avatar: 'https://example.com/avatar.png' // URL профиля пользователя
    };
    
    // Обновляем интерфейс
    document.getElementById('login-btn').classList.add('hidden');
    const profilePic = document.getElementById('profile-pic');
    profilePic.src = user.avatar;
    profilePic.alt = user.name;
    document.getElementById('profile').classList.remove('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    const profile = document.getElementById('profile');
    const profilePic = document.getElementById('profile-pic');

    // Проверяем, есть ли данные пользователя в localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // Если данные есть, отображаем аватар и скрываем кнопку входа
        profilePic.src = user.avatar_url;
        profilePic.alt = user.username;
        profile.classList.remove('hidden');
        document.getElementById('login-btn').classList.add('hidden');
    }

    // Если есть код и была завершена авторизация
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
                profile.classList.remove('hidden');
                document.getElementById('login-btn').classList.add('hidden');

                // Скрываем параметр code из URL
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: newUrl }, '', newUrl);
            });
    }
});
