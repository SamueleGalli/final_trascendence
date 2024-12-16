
export function configureAvatar(success) {
    // Ottieni gli elementi
    const avatarContainer = document.querySelector('.avatar-container');
    const newButtonsContainer = document.getElementById('newButtonsContainer');    
    const avatarImage = document.getElementById('avatarImage'); // Ottieni l'elemento dell'avatar
    
    // Funzione per mostrare l'avatar
    function showAvatar() {
        avatarContainer.style.display = 'flex'; // Mostra l'avatar
    }
    
    // Funzione per nascondere l'avatar
    function hideAvatar() {
        avatarContainer.style.display = 'none'; // Nascondi l'avatar
    }
    
    // Controlla se il contenitore con i pulsanti è visibile
    function checkButtonsVisibility() {
        if (success) {
            avatarImage.src = 'game_engine/images/rbakhaye.jpg'; // Mostra l'avatar se autenticato
        }
        if (!newButtonsContainer.classList.contains('hidden')) {
            showAvatar(); // Mostra l'avatar se i pulsanti sono visibili
        } else {
            hideAvatar(); // Nascondi l'avatar se i pulsanti non sono visibili
        }
    }
    
    // Ascolta le modifiche nella classe "hidden" sul contenitore con i pulsanti
    newButtonsContainer.addEventListener('transitionend', checkButtonsVisibility);
    
    // Inizialmente, controlla se i pulsanti sono visibili
    checkButtonsVisibility();
    
    // Aggiungi un listener per il clic sull'immagine dell'avatar
    avatarImage.addEventListener('click', function() {
        const menu = document.querySelector('.menu-container');
        menu.classList.toggle('visible'); // Cambia la visibilità del menu
    });
}

export function revokeToken() {
    fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include' // Include i cookie nella richiesta
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.removeItem('authenticated');
            renderUnauthenticatedPage();
        } else {
            console.error('Errore durante il logout:', data.error);
        }
    })
    .catch(error => {
        console.error('Errore di rete durante il logout:', error);
    });
}

function renderUnauthenticatedPage() {
    // Mostra i pulsanti di login
    document.getElementById('authButtonsContainer').classList.remove('hidden');
    console.log("Logout updating UI");
    // Nasconde i pulsanti del gioco
    const container = document.getElementById('newButtonsContainer');
    container.classList.add('hidden');
    container.classList.remove('show-new-buttons');
}

document.getElementById('logout').addEventListener('click', revokeToken);