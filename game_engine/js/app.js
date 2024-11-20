// Importa la classe Game dal file start.js
import { Game } from './game/start.js';
import { AI } from './game/AI.js';

// Gestore del click sul pulsante START
document.getElementById('startButton').addEventListener('click', function() {
    this.style.display = 'none'; // Nasconde il pulsante START

    // Mostra i nuovi pulsanti
    const container = document.getElementById('newButtonsContainer');
    container.classList.remove('hidden');
    container.classList.add('show-new-buttons');
});

// Gestore del click sul pulsante OSPITE
document.getElementById('guestButton').addEventListener('click', function() {
    document.getElementById('authButtonsContainer').classList.add('hidden'); // Nasconde il pulsante OSPITE e LOGIN
    document.getElementById('startButton').classList.remove('hidden'); // Mostra pulsante START
});

export const game = new Game(); // Crea una nuova istanza di Game
// Gestore del click su "Modalità 1"
document.getElementById('mode1Button').addEventListener('click', function() {
    console.log('Modalità 1 attivata');

    // Nascondi l'app principale
    document.getElementById('app').style.display = 'none';

    // Mostra il contenitore del gioco
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = 'block'; // Mostra il contenitore
    gameContainer.classList.remove('hidden'); // Rimuovi la classe 'hidden'

    // Crea e avvia il gioco
    game.start(); // Avvia il gioco
});

export const ia = new AI(); // Crea una nuova istanza di Game
// Gestore del click su "Modalità 1"
document.getElementById('IA_wars').addEventListener('click', function()
{
    // Nascondi l'app principale
    document.getElementById('app').style.display = 'none';
    // Mostra il contenitore del gioco
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = 'block'; // Mostra il contenitore
    gameContainer.classList.remove('hidden'); // Rimuovi la classe 'hidden'
    ia.start();
});

