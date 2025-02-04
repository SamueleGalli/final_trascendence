import Login, { addLoginPageHandlers } from "./pages/login.js";
import Modes, { addModesPageHandlers, current_user } from "./pages/modes.js";
import Tournament, { addTournamentPageHandlers } from "./pages/tournament.js";
import PongGame from "./pages/ponggame.js";
import Knockout, { addKnockoutPageHandlers } from "./pages/knockout.js";
import Customize, { addCustomizeGame } from "./pages/customize.js";
import Roundrobin, { addRoundRobinPageHandlers } from "./pages/roundrobin.js";
import RobinRanking, { addRobinRankingPageHandlers, robinDraw, assignPointsToPlayer } from "./pages/robindraw.js";
import Userstats from "./pages/userstats.js";
import { Charts, addChartsPageHandlers,showCharts } from "./pages/charts.js";
import MatchDetails, {showMatchDetails } from "./pages/matchdetails.js";
import Bracket, { addBracketPageHandlers, drawBracket, backToBracket, resetBracketState } from "./pages/bracket.js";
import { initializeGameCanvas, destroyGameCanvas } from "./handlingCanvas.js"; //, addCanvas, removeCanvas
import Profile from "./pages/profile.js";
import Settings, { addSettingsPageHandlers } from "./pages/settings.js";
import Stats from "./pages/stats.js";
import { userName } from "./pages/user_data.js";
import { Forza4Home, showForza4HomeScreen, addForza4PageHandlers } from "./pages/forza4_home.js";
import { Forza4Customize, forza4Config } from "./pages/forza4_customize.js";
import { Forza4, startforza4Game } from "./game/forza4/forza4.js";
import { Forza4UserStats, forza4ShowUserStatistics, addForza4StatsPageHandlers } from "./pages/forza4_statistics.js";
import { Forza4MatchStats, forza4ShowMatchDetails } from "./pages/forza4_match_statistics.js";
import Friends from "./pages/friends.js";

let buttonTitle;
let winner;

// Mappa delle rotte
const routes = {
    "/": Login,
    "/modes": Modes,
    "/classic": PongGame,
    "/aiWars": PongGame,
    "/tournament": Tournament,
    "/forza4": Forza4Home,
    "/forza4/game": Forza4,
    "/forza4/userstats": Forza4UserStats,
    "/forza4/userstats/matchstats": Forza4MatchStats,
    "/settings": Settings,
    "/settings/customizepong": Customize,
    "/settings/customizeforza4": Forza4Customize,
    "/tournament/knockout": Knockout,
    "/tournament/roundrobin": Roundrobin,
    "/tournament/roundrobin/robinranking": RobinRanking,
    "/tournament/roundrobin/robinranking/game": PongGame,
    "/tournament/userstats": Charts,
    "/tournament/userstats/matchdetails": MatchDetails,
    "/tournament/knockout/bracket": Bracket,
    "/tournament/knockout/bracket/game": PongGame,
    "/profile": Profile,
    "/stats": Stats,
    "/friends": Friends
};

// Funzione universale per la navigazione
export const navigate = (path, title = "") => {
    history.pushState({ path }, title, path); // Aggiorna l'URL e la cronologia
    buttonTitle = title;
    loadContent(); // Carica il nuovo contenuto
};

function createPlayersArray(numPlayers) {
    let players = [];
    for (let i = 1; i <= numPlayers; i++) {
        if (i === 1)
            players.push(userName);
        else
            players.push(`Player ${i}`);
    }
    return players;
}

// Caricamento dinamico del contenuto
const loadContent = async () => {
    const path = window.location.pathname; // Ottieni il percorso attuale
    const app = document.getElementById("app");
    const component = routes[path];
    let players;
    let playerNames;
    let numPlayers = 4;


    if (buttonTitle === "4" || buttonTitle === "5" || buttonTitle === "6" || buttonTitle === "7" || buttonTitle === "8" || buttonTitle === "16")
        numPlayers = +buttonTitle;

    players = createPlayersArray(numPlayers);

    //console.log("Players? " +players);
    playerNames = players;  
    //console.log("path => " + path);
    if (component) {
        app.innerHTML = await component(); // Carica dinamicamente il componente
        // Se è necessario aggiungere un canvas in altre pagine, lo facciamo qui
        if (path === "/classic" || path === "/aiWars" || path === "/tournament/knockout/bracket/game" || path === "/tournament/roundrobin/robinranking/game") {
            //console.log("game start!!");
            //removeCanvas();
            destroyGameCanvas();
            initializeGameCanvas(); // Rimuovi il canvas su queste pagine
        }
        else
        {
            destroyGameCanvas();
            //removeCanvas();
            //addCanvas();
        }

        switch (path) {
            case "/":
                    addLoginPageHandlers();
                break;
            case "/modes":
                addModesPageHandlers();
                break;
            case "/tournament":
                addTournamentPageHandlers();
                break;
            case "/tournament/knockout":
                addKnockoutPageHandlers();
                resetBracketState();
                break;
            case "/tournament/knockout/bracket":
                addBracketPageHandlers();
                //players = JSON.parse(sessionStorage.getItem('players'));
                //console.log("title => " + buttonTitle);
                if (buttonTitle === "Return from Match") {
                    //console.log("return to bracket");
                    winner = sessionStorage.getItem('winner');
                    backToBracket(winner);
                }
                else
                    drawBracket(players);          
                break;
            case "/tournament/roundrobin":
                addRoundRobinPageHandlers();
                break;
            case "/tournament/roundrobin/robinranking":
                addRobinRankingPageHandlers();
                if (buttonTitle === "Return from Match") {
                    //console.log("return to bracket");
                    winner = sessionStorage.getItem('winner');
                    assignPointsToPlayer(winner);
                }
                robinDraw(playerNames);
                break;
            case "/settings":
                addSettingsPageHandlers();
                break;
            case "/settings/customizepong":
                addCustomizeGame();
                break;
            case "/tournament/userstats":
                addChartsPageHandlers();
                showCharts();
                break;
            case "/tournament/userstats/matchdetails":
                showMatchDetails();
                break;
            case "/forza4":
                showForza4HomeScreen();
                addForza4PageHandlers();
                break;
            case "/settings/customizeforza4":
                forza4Config();
                break;
            case "/forza4/userstats":
                addForza4StatsPageHandlers();
                forza4ShowUserStatistics()
                break;
            case "/forza4/userstats/matchstats":
                forza4ShowMatchDetails();
                break;
            case "/forza4/game":
                startforza4Game();
                break;
            default:
                break;
        }
    }
    else
        app.innerHTML = "<h1>404 - Pagina non trovata</h1>"; // Pagina non trovata
};

// Gestione dei pulsanti "Indietro" e "Avanti" nel browser
window.addEventListener("popstate", loadContent);

// Inizializzazione dell'app
document.addEventListener("DOMContentLoaded", loadContent);