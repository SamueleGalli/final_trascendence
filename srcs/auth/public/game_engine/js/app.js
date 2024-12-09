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