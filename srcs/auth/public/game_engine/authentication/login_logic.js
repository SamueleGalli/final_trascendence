export let success = localStorage.getItem('authenticated') === 'true'; // Recupera lo stato di autenticazione dal localStorage
import { navigate } from "../game_engine/js/main.js";

export function performLogin() {
    if (localStorage.getItem('authenticated') === 'true') {
        console.log("User already in");
        renderAuthenticatedPage();
        return;
    }

    fetch('/auth/login')
        .then(response => response.json())
        .then(data => {
            const popup = window.open(data.auth_url, 'Login', 'width=600,height=400');
            window.addEventListener('message', function(event) {
                if (event.data.authenticated) {
                    console.log("User logged in");
                    success = true;
                    localStorage.setItem('authenticated', 'true'); 
                    popup.close(); 
                    renderAuthenticatedPage(); 
                }
                else {
                    console.log("User not logged in");
                }
            });
        })
        .catch(error => {
            console.error("Errore di rete:", error);
        });
}

// Funzione per controllare lo stato di autenticazione
function checkAuthentication() {
    if (success)
        navigate("/modes", "Modalità di gioco");
}

// Esegui il controllo dello stato al caricamento della pagina
window.onload = () => {
    checkAuthentication(); // Verifica lo stato di autenticazione
};

