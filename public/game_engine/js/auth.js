document.getElementById('loginButton').addEventListener('click', function() {
    // Quando il pulsante di login viene cliccato, redirige l'utente alla route di login
    window.location.href = '/auth/login';
});

document.getElementById('guestButton').addEventListener('click', function() {
    // Quando il pulsante "guest" viene cliccato, mostra i nuovi bottoni
    document.getElementById('authButtonsContainer').classList.add('hidden');
    const container = document.getElementById('newButtonsContainer');
    container.classList.remove('hidden');
    container.classList.add('show-new-buttons');
});

window.onload = function() {
    // Quando la pagina è caricata, controlla se l'utente è già autenticato
    fetch('/check_auth')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                // Se autenticato, mostra i nuovi bottoni
                document.getElementById('authButtonsContainer').classList.add('hidden');
                const container = document.getElementById('newButtonsContainer');
                container.classList.remove('hidden');
                container.classList.add('show-new-buttons');
            }
        })
        .catch(error => console.error('Error checking authentication:', error));
};
