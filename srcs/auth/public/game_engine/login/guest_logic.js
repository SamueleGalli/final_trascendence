import { navigate } from "../game_engine/js/main.js";

let guestName = null; // Nome temporaneo dell'ospite

// Pulsante per accedere come ospite
export function guest_login()
{
    const name = prompt("Enter your guest name:").trim();

    if (!name) {
        alert('Please enter a valid name.');
        return;
    }
    
    // Invio del nome dell'ospite al server tramite fetch
    fetch('/guest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Utilizza questo header per inviare il corpo in formato URL encoded
        },
        body: `guest_name=${encodeURIComponent(name)}`, // Passa il nome dell'ospite come parametro
    })
    .then(response => {
        // Verifica se la risposta è OK
        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }
        return response.json(); // Parso della risposta JSON
    })
    .then(data => {
        // Controlla se il nome dell'ospite è stato correttamente settato
        if (data.success && data.guest_name) {
            guestName = data.guest_name; // Salva il nome dell'ospite
            updateUIForGuest(); // Funzione per aggiornare l'interfaccia utente
        } else {
            alert('Error: Unable to set guest name.');
        }
    })
    .catch(error => {
        console.error('Error caught in .catch():', error); // Aggiungi questo per diagnosticare l'errore
        alert('Network error. Please try again later.');
    });
}

// Funzione per aggiornare l'interfaccia utente in base al nome dell'ospite
function updateUIForGuest() {
    navigate("/modes", "Modalità di gioco");
    console.log("Guest name:", guestName);
}
