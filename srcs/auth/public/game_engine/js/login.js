let success = localStorage.getItem('authenticated') === 'true'; // Recupera lo stato di autenticazione dal localStorage

function performLogin() {
    // Se l'utente è già autenticato, non fare nulla
    if (success) {
        renderAuthenticatedPage(); // Mostra la UI autenticata
        return;
    }

    // Procedura di login se l'utente non è autenticato
    fetch('/auth/login')
        .then(response => response.json()) // Parsing della risposta
        .then(data => {
            const popup = window.open(data.auth_url, 'Login', 'width=600,height=400');

            // Aggiungi un listener per il messaggio dalla popup quando "Continua" viene premuto
            window.addEventListener('message', function(event) {
                if (event.data.authenticated) {
                    success = true;
                    localStorage.setItem('authenticated', 'true'); // Salva lo stato di autenticazione
                    renderAuthenticatedPage(); // Aggiorna la UI principale
                    popup.close(); // Chiudi la popup
                }
            });
        })
        .catch(error => {
            console.error('Errore nella richiesta di login:', error);
        });
}

// Funzione per aggiornare la UI dopo l'autenticazione
function renderAuthenticatedPage() {
    // Nasconde il contenitore con i pulsanti di login
    document.getElementById('authButtonsContainer').classList.add('hidden');

    // Mostra il contenitore con i nuovi pulsanti di gioco
    const container = document.getElementById('newButtonsContainer');
    container.classList.remove('hidden');
    container.classList.add('show-new-buttons');
}

// Funzione per controllare lo stato di autenticazione
function checkAuthentication() {
    if (success) {
        renderAuthenticatedPage(); // Mostra la pagina autenticata se il token esiste
    }
}

// Esegui il controllo dello stato al caricamento della pagina
window.onload = () => {
    checkAuthentication(); // Verifica lo stato di autenticazione
};

document.getElementById('loginButton').addEventListener('click', performLogin);
