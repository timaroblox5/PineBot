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
