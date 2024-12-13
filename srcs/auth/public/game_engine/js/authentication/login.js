import { configureAvatar } from './authenticated.js';

let success = localStorage.getItem('authenticated') === 'true'; // Recupera lo stato di autenticazione dal localStorage

function performLogin() {
    if (success) {
        console.log("Gia autenticato");
        renderAuthenticatedPage();
        return;
    }

    fetch('/auth/login')
        .then(response => response.json())
        .then(data => {
            const popup = window.open(data.auth_url, 'Login', 'width=600,height=400');

            window.addEventListener('message', function(event) {
                console.log("Messaggio ricevuto: " + event.data.authenticated);
                if (event.data.authenticated) {
                    success = true;
                    localStorage.setItem('authenticated', 'true'); 
                    popup.close(); 
                    renderAuthenticatedPage(); 
                }
            });
        })
        .catch(error => {
            console.error("Errore di rete:", error);
        });
}


// Funzione per aggiornare la UI dopo l'autenticazione
function renderAuthenticatedPage() {
    // Nasconde il contenitore con i pulsanti di login
    const authButtonsContainer = document.getElementById('authButtonsContainer');
    authButtonsContainer.classList.add('hidden');
    
    // Attendi un breve periodo per far sì che il browser elabori il cambiamento, quindi mostra i nuovi pulsanti
    setTimeout(() => {
        // Mostra il contenitore con i nuovi pulsanti di gioco
        const container = document.getElementById('newButtonsContainer');
        container.classList.remove('hidden');
        container.classList.add('show-new-buttons');
        configureAvatar(true);
    }, 300);  // Imposta il ritardo a 100 ms (puoi aumentarlo se necessario)
}


// Funzione per controllare lo stato di autenticazione
function checkAuthentication() {
    if (success)
        renderAuthenticatedPage(); // Mostra la pagina autenticata se il token esiste
}

// Esegui il controllo dello stato al caricamento della pagina
window.onload = () => {
    checkAuthentication(); // Verifica lo stato di autenticazione
};

document.getElementById('loginButton').addEventListener('click', performLogin);