import { navigate } from "../js/main.js";

let guestName = null; // Nome temporaneo dell'ospite

// Pulsante per accedere come ospite
export function guest_login() {
    const name = prompt("Enter your guest name:").trim();

    if (!name) {
        alert('Please enter a valid name.');
        return;
    }
    guestName = name;
    updateUIForGuest();
}

// Funzione per aggiornare l'interfaccia utente in base al nome dell'ospite
function updateUIForGuest() {
    navigate("/modes", "Modalità di gioco");
    console.log("Guest name:", guestName);  // Mostra il nome dell'ospite nel log
}