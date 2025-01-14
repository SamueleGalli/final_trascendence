import Login, { addLoginPageHandlers } from "./pages/login.js";
import Modes, { addModesPageHandlers } from "./pages/modes.js";
import Tournament, { addTournamentPageHandlers } from "./pages/tournament.js";
import Classic from "./pages/classic.js";
import AiWars from "./pages/ai.js";
import { Forza4Home, showForza4HomeScreen } from "./pages/forza4_home.js";
import { Forza4Customize, forza4Config } from "./pages/forza4_customize.js";
import { Forza4, startforza4Game } from "./game/forza4.js";
import Knockout, { addKnockoutPageHandlers } from "./pages/knockout.js";
import Customize, { addCustomizeGame } from "./pages/customize.js";
import Roundrobin, { addRoundbinPageHandlers } from "./pages/roundrobin.js";
import RobinRanking, { robinDraw } from "./pages/robindraw.js";
import Userstats from "./pages/userstats.js";
import { F4UserStats, F4ShowUserStats } from "./pages/forza4_statistics.js";
import Bracket, { addBracketPageHandlers, drawBracket } from "./pages/bracket.js";
import { initializeGameCanvas, destroyGameCanvas, addCanvas, removeCanvas } from "./handlingCanvas.js";
import profile from "./pages/profile.js";

// Mappa delle rotte
const routes = {
    "/": Login,
    "/modes": Modes,
    "/classic": Classic,
    "/aiWars": AiWars,
    "/tournament": Tournament,
    "/forza4": Forza4Home,
    "/forza4/customize": Forza4Customize,
    "/forza4/game": Forza4,
    "/forza4/userstats": F4UserStats,
    "/tournament/knockout": Knockout,
    "/tournament/roundrobin": Roundrobin,
    "/tournament/userstats": Userstats,
    "/tournament/knockout/bracket": Bracket,
    "/tournament/knockout/bracket/customize": Customize,
    "/tournament/roundrobin/robindraw": RobinRanking,
    "/profile": profile,
};

// Funzione universale per la navigazione
export const navigate = (path, title = "") => {
    history.pushState({ path }, title, path); // Aggiorna l'URL e la cronologia
    loadContent(); // Carica il nuovo contenuto
};

// Caricamento dinamico del contenuto
const loadContent = async () => {
    const path = window.location.pathname; // Ottieni il percorso attuale
    const app = document.getElementById("app");
    const component = routes[path];
    let players = ["Player 1", "Player 2", "Player 3", "Player 4"];
    let playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"];
    if (component) {
        app.innerHTML = await component(); // Carica dinamicamente il componente

        // Se è necessario aggiungere un canvas in altre pagine, lo facciamo qui
        if (path === "/classic" || path === "/aiWars") {
            removeCanvas();
            destroyGameCanvas();
            initializeGameCanvas(); // Rimuovi il canvas su queste pagine
        }
        else
        {
            destroyGameCanvas();
            removeCanvas();
            addCanvas();
        }

        if (path === "/") {
            addLoginPageHandlers(); // Aggiungi i gestori della pagina di login
        } 
        else if (path === "/modes")
        {
            addModesPageHandlers(); // Aggiungi i gestori della pagina delle modalità
        }
        else if (path === "/tournament")
        {
            addTournamentPageHandlers();
        }
        else if (path === "/tournament/knockout") {
            addKnockoutPageHandlers();
        }
        else if (path === "/tournament/knockout/bracket") {
            addBracketPageHandlers();
            drawBracket(players);
        }
        else if (path === "/tournament/roundrobin") {
            addRoundbinPageHandlers();
        }
        else if (path === "/tournament/roundrobin/robindraw") {
            robinDraw(playerNames);
        }
        /*else if (path === "/tournament/knockout/bracket") {
            players = JSON.parse(sessionStorage.getItem('players'));
            console.log('Players:', players);
            addDrawBracket(players);
        }
        else if (path === "/tournament/knockout/bracket/customize") {
            addCustomizeGame()
        }*/
        else if (path === "/forza4") {
            showForza4HomeScreen();
        }
        else if (path === "/forza4/customize") {
            forza4Config();
        }
        else if (path === "/forza4/game") {
            startforza4Game();
        }
        else if (path === "/forza4/userstats") {
            F4ShowUserStats();
        }
    }
    else
        app.innerHTML = "<h1>404 - Pagina non trovata</h1>"; // Pagina non trovata
};

// Gestione dei pulsanti "Indietro" e "Avanti" nel browser
window.addEventListener("popstate", loadContent);

// Inizializzazione dell'app
document.addEventListener("DOMContentLoaded", loadContent);