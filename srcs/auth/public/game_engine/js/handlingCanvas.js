import { MainPageEffect } from "./main_effect/MainPageEffect.js";
import { Game } from './game/classic.js';
import { AI } from './game/AI.js';
import { startPongGame, TournamentGame } from "./game/tournament.js";

let mainPageEffect;
let gameInstance;

// Funzione per aggiungere il canvas di gioco
export function initializeGameCanvas() {
    //console.log("inizializzo game canvas");
    let players = ["Player 1", "Player 2", "Player 3", "Player 4"];
    const path = window.location.pathname;
    const gameCanvas = document.createElement('canvas');
    gameCanvas.id = "gameCanvas";
    document.getElementById("app").appendChild(gameCanvas);

    // Imposta le dimensioni del canvas
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    const ctx = gameCanvas.getContext("2d");

    // Determina quale istanza di gioco creare
    if (path === "/aiWars") {
        gameInstance = new AI(ctx);
    }
    else if (path === "/classic")
    {
        gameInstance = new Game(ctx);
    }
    else if (path === "/tournament/knockout/bracket/game" || path === "/tournament/roundrobin/robinranking/game")
    {
        players = JSON.parse(sessionStorage.getItem('matchPlayers'));
        if (path === "/tournament/knockout/bracket/game")
            startPongGame(players, "knockout");
        else
            startPongGame(players, "roundrobin");
        gameInstance = new TournamentGame(ctx);
    }

    // Avvia l'istanza di gioco selezionata
    gameInstance.start();
}

// Funzione per distruggere il canvas di gioco
export function destroyGameCanvas() {
    const gameCanvas = document.getElementById("gameCanvas");

    if (gameCanvas) {
        // Pulisce il canvas e lo rimuove dal DOM
        const ctx = gameCanvas.getContext("2d");
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCanvas.remove();
    }
        // Distrugge l'istanza di gioco
    if (gameInstance) {
        gameInstance.stop();
        gameInstance = null;
    }
}

// Funzione per aggiungere il canvas principale
export function addCanvas() {
    // Aggiungi il main_pageCanvas nelle altre pagine
    const canvas = document.getElementById("main_pageCanvas");
    if (!canvas) {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = "main_pageCanvas";
        document.getElementById("app").appendChild(newCanvas);

        newCanvas.width = window.innerWidth;
        newCanvas.height = window.innerHeight;

        const mainPageCtx = newCanvas.getContext('2d');
        mainPageEffect = new MainPageEffect(mainPageCtx); 
        mainPageEffect.start();
    }
}  

// Funzione per rimuovere il canvas
export function removeCanvas() {
    const canvas = document.getElementById("main_pageCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove();
    }
    if (mainPageEffect) {
        mainPageEffect.stop(); // Ferma l'effetto per main_pageCanvas
        mainPageEffect = null;
    }
}