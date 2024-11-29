let guestName = null; // Nome temporaneo dell'ospite

// Pulsante per accedere come ospite
document.getElementById('guestButton').addEventListener('click', function () {
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
});

// Funzione per aggiornare l'interfaccia utente in base al nome dell'ospite
function updateUIForGuest() {
    // Nascondi i pulsanti di autenticazione
    document.getElementById('authButtonsContainer').classList.add('hidden');

    // Mostra i pulsanti del gioco
    const container = document.getElementById('newButtonsContainer');
    container.classList.remove('hidden');
    container.classList.add('show-new-buttons');

    // Mostra un messaggio generico di accesso
    const message = document.createElement('p');
    message.textContent = `Welcome, ${guestName}! Enjoy your time in guest mode.`;

    // Verifica che il container esista prima di inserire il messaggio
    const parent = container && container.parentNode;
    if (parent) {
        // Se il container esiste, inseriamo il messaggio prima del container
        parent.insertBefore(message, container);
    } else {
        // Se il container non esiste, inserisci il messaggio direttamente nel body
        document.body.appendChild(message);
    }
}
