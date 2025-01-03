import Login, { addLoginPageHandlers } from "./pages/login.js";
import Modes, { addModesPageHandlers } from "./pages/modes.js";
import Tournament, { addTournamentPageHandlers } from "./pages/tournament.js";
import Classic from "./pages/classic.js";
import AiWars from "./pages/ai.js";
import Knockout, { addKnockoutPageHandlers } from "./pages/knockout.js";
import Customize, { addCustomizeGame } from "./pages/customize.js";
import Roundrobin from "./pages/roundrobin.js";
import Userstats from "./pages/userstats.js";
import Bracket, { addDrawBracket } from "./pages/bracket.js";
import { initializeGameCanvas, destroyGameCanvas, addCanvas, removeCanvas } from "./handlingCanvas.js";

// Mappa delle rotte
const routes = {
    "/": Login,
    "/modes": Modes,
    "/classic": Classic,
    "/aiWars": AiWars,
    "/tournament": Tournament,
    "/tournament/knockout": Knockout,
    "/tournament/roundrobin": Roundrobin,
    "/tournament/userstats": Userstats,
    "/tournament/knockout/bracket": Bracket,
    "/tournament/knockout/bracket/customize": Customize,
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
        /*else if (path === "/tournament/knockout/bracket") {
            players = JSON.parse(sessionStorage.getItem('players'));
            console.log('Players:', players);
            addDrawBracket(players);
        }
        else if (path === "/tournament/knockout/bracket/customize") {
            addCustomizeGame()
        }*/
        
    }
    else
        app.innerHTML = "<h1>404 - Pagina non trovata</h1>"; // Pagina non trovata
};

// Gestione dei pulsanti "Indietro" e "Avanti" nel browser
window.addEventListener("popstate", loadContent);

// Inizializzazione dell'app
document.addEventListener("DOMContentLoaded", loadContent);