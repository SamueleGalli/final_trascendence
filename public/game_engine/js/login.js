// Funzione che gestisce il login tramite popup
function openAuthPopup(url) {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const popup = window.open(url, 'login_popup', `width=${width},height=${height},top=${top},left=${left}`);

    // Monitorare la finestra popup per ottenere il codice di autorizzazione
    const interval = setInterval(function() {
        if (popup.closed) {
            clearInterval(interval);
            // La finestra è stata chiusa, recupera il codice dalla URL
            const urlParams = new URLSearchParams(popup.location.search);
            const code = urlParams.get('code');
            if (code) {
                // Processa il codice di autorizzazione
                getAccessToken(code, popup); // Passiamo anche il popup per chiuderlo successivamente
            }
        }
    }, 1000);
}

// Gestione del click sul pulsante di login
document.getElementById('loginButton').addEventListener('click', function() {
    fetch('/auth/login')
        .then(response => response.json())
        .then(data => {
            if (data.auth_url) {
                openAuthPopup(data.auth_url); // Usa il popup per il login
            }
        })
        .catch(error => console.error('Errore durante la richiesta di login:', error));
});

// Funzione per il rendering della UI quando l'utente è autenticato
function renderAuthenticatedPage() {
    const authButtonsContainer = document.getElementById('authButtonsContainer');
    const newButtonsContainer = document.getElementById('newButtonsContainer');

    // Aggiungi log per debug
    console.log("Token trovato, aggiornando la UI");

    if (authButtonsContainer && newButtonsContainer) {
        authButtonsContainer.style.display = 'none'; // Nascondi i pulsanti di login
        newButtonsContainer.style.display = 'block';  // Mostra i pulsanti del gioco
    } else {
        console.error("Gli elementi per la UI non sono stati trovati.");
    }
}

// Funzione per ottenere il token di accesso utilizzando il codice
function getAccessToken(code, popup) {
    if (code) {
        fetch('/callback?code=' + code)
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                console.log('Access token:', data.access_token);
                // Salva il token nel sessionStorage
                sessionStorage.setItem('access_token', data.access_token);

                // Chiudi la finestra del popup e aggiorna la UI
                if (popup && !popup.closed) {
                    popup.close();
                }

                // Aggiorna la UI principale
                renderAuthenticatedPage();
            }
        })
        .catch(error => console.error('Errore nella callback:', error));    
    }
}

// Funzione per controllare lo stato di autenticazione
function checkAuthentication() {
    const token = sessionStorage.getItem('access_token');
    if (token) {
        console.log("Token trovato nel sessionStorage:", token);
        renderAuthenticatedPage();  // Se c'è un token, aggiorna la UI
    } else {
        console.log("Token non trovato nel sessionStorage.");
    }
}

// Gestione del caricamento della pagina
window.onload = function() {
    console.log("Pagina caricata");  // Verifica che l'onload venga eseguito
    checkAuthentication();

    const code = new URLSearchParams(window.location.search).get('code');
    console.log("Codice ottenuto:", code);  // Verifica che il codice venga estratto correttamente
    if (code) {
        getAccessToken(code, null); // Non è necessario chiudere il popup qui
    }
};
