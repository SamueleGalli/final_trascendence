// Importa le classi Game e AI
import { game } from './game/start.js';
import { ai } from './game/AI.js';

// Funzione per avviare il gioco o la modalità IA
function handleModeSelection(mode) {
    // Nascondi l'app principale
    document.getElementById('app').style.display = 'none';
    // Mostra il contenitore del gioco
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = 'block'; // Mostra il contenitore
    gameContainer.classList.remove('hidden'); // Rimuovi la classe 'hidden'

    // Avvia il gioco o l'IA in base al mode
    if (mode === 'game')
        game.start();
    else if (mode === 'ia')
        ai.start();
}

// Gestore del click su "Modalità 1" e "IA Wars"
document.getElementById('mode1Button').addEventListener('click', function() {
    handleModeSelection('game'); // Avvia la modalità di gioco
});

document.getElementById('IA_wars').addEventListener('click', function() {
    handleModeSelection('ia'); // Avvia la modalità IA
});

// Ottieni gli elementi
const avatarContainer = document.querySelector('.avatar-container');
const newButtonsContainer = document.getElementById('newButtonsContainer');

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
document.getElementById('avatarImage').addEventListener('click', function() {
    const menu = document.querySelector('.menu-container');
    menu.classList.toggle('visible'); // Cambia la visibilità del menu
});

// auth.js

// Gestore del click sul pulsante LOGIN
document.getElementById('loginButton').addEventListener('click', function() {
    // Chiamata al backend per ottenere il link di autorizzazione OAuth2
    fetch('/auth/login')
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                window.location.href = data.url; // Reindirizza alla pagina di login OAuth2
            }
        })
        .catch(error => console.error('Error fetching login URL:', error));
});