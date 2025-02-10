import { navigate } from "../../main.js";
import { current_user, change_name, update_image} from "../modes.js";

// Funzione che restituisce la struttura HTML del torneo con un canvas per disegnare il tabellone
export default function Bracket() {
    return `
        <img id="backImageButton" src="../../game_engine/images/home.png" alt="Back" class="back-button">
        <h1 class="text">
            <span class="letter letter-1">T</span>
            <span class="letter letter-2">o</span>
            <span class="letter letter-3">u</span>
            <span class="letter letter-4">r</span>
            <span class="letter letter-5">n</span>
            <span class="letter letter-6">a</span>
            <span class="letter letter-7">m</span>
            <span class="letter letter-8">e</span>
            <span class="letter letter-9">n</span>
            <span class="letter letter-10">t</span>
            <span class="letter letter-11"> </span>
            <span class="letter letter-12"> </span>
            <span class="letter letter-13">B</span>
            <span class="letter letter-14">r</span>
            <span class="letter letter-15">a</span>
            <span class="letter letter-16">c</span>
            <span class="letter letter-17">k</span>
            <span class="letter letter-18">e</span>
            <span class="letter letter-19">t</span>
        </h1>
        <div id="tournamentBracket">
            <canvas id="bracketCanvas"></canvas>
        </div>
        <div class="bracket-button-container">
                <button class="button-style" id="knockoutMatchButton">Play Match</button>
        </div>
    `;
}

// Dimensioni delle caselle
const boxWidth = 100; 
const boxHeight = 50; 
const roundGap = 200; // Distanza tra i round
let boxColor = 'black'; // Colore della casella
let matchBoxPos = []; // Posizioni delle caselle
let yOffset = 60; // Offset verticale

let matchesPerRound = 8; // Numero di partite per round
let matchesThisRound;
let rounds = 4; // Numero di round
let currentMatch = 0;
let currentRound = 0;
let firstDraw = true; // Controllo per il primo disegno
let bracketPlayers; // Giocatori nel torneo
let bracketCanvas; // Canvas per il disegno
let bracketCtx; // Contesto del canvas

// Funzione per mescolare l'array dei giocatori
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Scambia gli elementi
    }
    return array;
}

// Funzione per disegnare una linea tra due punti
function drawLine(x1, y1, x2, y2, bracketCtx) {
    bracketCtx.beginPath();
    bracketCtx.moveTo(x1, y1);
    bracketCtx.lineTo(x2, y2);
    bracketCtx.strokeStyle = 'rgb(80, 80, 80)';
    bracketCtx.stroke();
}

// Funzione per disegnare una casella con i nomi dei giocatori
function drawRectangle(x, y, width, height, player1, player2, boxColor, bracketCtx) {
    bracketCtx.strokeStyle = boxColor; // Colore del bordo
    bracketCtx.strokeRect(x, y, width, height); // Disegna il rettangolo

    bracketCtx.fillStyle = 'white'; 
    bracketCtx.textAlign = 'center';

    const vsOffset = 1;
    const playerOffset = 15;

    bracketCtx.font = '14px Liberty'; // Font per il primo giocatore
    bracketCtx.textBaseline = 'bottom'; 
    if (player1) 
        bracketCtx.fillText(player1, x + width / 2, y + height / 2 - playerOffset); 

    bracketCtx.font = '12px Liberty'; // Font per il "vs"
    bracketCtx.textBaseline = 'middle';
    bracketCtx.fillText('vs', x + width / 2, y + height / 2 - vsOffset);

    bracketCtx.font = '14px Liberty'; // Font per il secondo giocatore
    bracketCtx.textBaseline = 'top';
    if (player2) 
        bracketCtx.fillText(player2, x + width / 2, y + height / 2 + playerOffset); 
}

// Funzione per inizializzare i giocatori del torneo
function initializeBracket() {
    bracketPlayers = new Array(rounds);
    for (let i = 0; i < rounds; i++) {
        bracketPlayers[i] = new Array(matchesPerRound * 2); // Ogni round avrà due volte il numero di partite
    }
}

// Funzione per disegnare il tabellone
export function drawBracket(players) {
    bracketCanvas = document.getElementById('bracketCanvas');
    bracketCtx = bracketCanvas.getContext('2d');

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    //console.log("giocatori: " + players); 
    // Impostazioni di scaling in base alla larghezza e altezza dello schermo
    const boxWidth = screenWidth * 0.12;  // Larghezza casella
    const boxHeight = screenHeight * 0.07;  // Altezza casella
    const roundGap = screenWidth * 0.2;  // Distanza tra i round
    const yOffset = boxHeight + 10;  // Offset verticale per le partite
    const dynamicOffset = roundGap * 0.25;

    // Calcoliamo il numero di partite e round
    matchesPerRound = players.length / 2;
    rounds = Math.log2(players.length);
    matchBoxPos = [];

    // Calcoliamo le dimensioni del canvas
    const padding = 120; // Padding
    const totalWidth = (rounds - 1) * roundGap + boxWidth + 2 * padding;  // Larghezza totale del canvas
    const totalHeight = matchesPerRound * yOffset + 2 * padding;  // Altezza totale del canvas

    bracketCanvas.width = totalWidth;  // Imposta la larghezza del canvas
    bracketCanvas.height = totalHeight;  // Imposta l'altezza del canvas

    bracketCanvas.style.display = 'block';
    bracketCtx.font = '14px Liberty';

    let xOffset = padding;  // Posizione iniziale per il primo round
    let yStart = padding;

    if (firstDraw) {
        firstDraw = false;
        knockoutMatchButton.style.display = 'block';
        matchesThisRound = matchesPerRound;
        initializeBracket(rounds);
        bracketPlayers[0] = shuffleArray(players);  // Mescola i giocatori
    }
    //console.log("bracket players => " + bracketPlayers)
    matchBoxPos[0] = [];
    // Disegna le partite del primo round
    for (let i = 0; i < matchesPerRound; i++) {
        let x = xOffset;
        let y = yStart + yOffset * i;
        let player1 = bracketPlayers[0][i * 2];
        let player2 = bracketPlayers[0][i * 2 + 1];

        if (i == currentMatch && currentRound == 0)
            boxColor = 'rgb(2 ,191 , 185)';
        else
            boxColor = 'white';

        drawRectangle(x, y, boxWidth, boxHeight, player1, player2, boxColor, bracketCtx);
        matchBoxPos[0].push([x, y]);
    }

    xOffset += roundGap;

    // Disegna i round successivi
    for (let round = 1; round < rounds; round++) {
        matchesPerRound /= 2;
        matchBoxPos[round] = [];

        for (let i = 0; i < matchesPerRound; i++) {
            let prevY1 = matchBoxPos[round - 1][i * 2][1];
            let prevY2 = matchBoxPos[round - 1][i * 2 + 1][1];
            let y = (prevY1 + prevY2) / 2;
            let x = xOffset;

            if (i == currentMatch && currentRound == round)
                boxColor = 'rgb(2 ,191 , 185)';
            else
                boxColor = 'white';

            drawRectangle(x, y, boxWidth, boxHeight, bracketPlayers[round][i * 2], bracketPlayers[round][i * 2 + 1], boxColor, bracketCtx);
            matchBoxPos[round].push([x, y]);

            let centerX = x;
            let centerY = y + boxHeight / 2;
            let prevCenterX = x - roundGap + boxWidth;
            let prevCenterY1 = prevY1 + boxHeight / 2;
            let prevCenterY2 = prevY2 + boxHeight / 2;
            let midY = (prevCenterY1 + prevCenterY2) / 2;

            // Disegna le linee tra le partite
            drawLine(prevCenterX, prevCenterY1, prevCenterX + roundGap / 4, prevCenterY1, bracketCtx);
            drawLine(prevCenterX, prevCenterY2, prevCenterX + roundGap / 4, prevCenterY2, bracketCtx);
            drawLine(prevCenterX + roundGap / 4, prevCenterY1, prevCenterX + roundGap / 4, prevCenterY2, bracketCtx);
            drawLine(prevCenterX + roundGap / 2 - dynamicOffset, midY, centerX, centerY, bracketCtx);
        }

        // Per ogni round successivo, sposta xOffset verso destra
        xOffset += roundGap;
    }
}

// Funzione per resettare lo stato del torneo
export function resetBracketState() {
    //console.log("reset bracket state");
    currentMatch = 0;
    currentRound = 0;
    firstDraw = true;
    matchBoxPos = [];
}

export function backToBracket(winner) {
    console.log("winz: ", winner);
    if (winner === null){
        drawBracket(bracketPlayers[0]);
        return;
    }
        
    if (currentRound < rounds - 1) {
        bracketPlayers[currentRound + 1][currentMatch] = winner;
        currentMatch++;
        if (currentMatch > matchesThisRound - 1) {
            currentMatch = 0;
            currentRound++;
            matchesThisRound /= 2;
        }
        drawBracket(bracketPlayers[0]);
    }
    else {
        //console.log("winner: " + winner);
        drawBracket(bracketPlayers[0]);

        knockoutMatchButton.hidden = true;
        knockoutMatchButton.style.display = 'none';
        //gameCustomizeButton.hidden = true;
        //gameCustomizeButton.style.display = 'none';

        bracketCtx.font = '30px Liberty';
        bracketCtx.fillStyle = 'white'; 
        bracketCtx.textAlign = 'center';
        bracketCtx.textBaseline = 'top';
        bracketCtx.fillText(winner + ' Win the Tournament!', bracketCanvas.width / 2, bracketCanvas.height - 110);
    }
}

// Aggiunge gli eventi per il pulsante di personalizzazione
export const addBracketPageHandlers = () => {
    const backImageButton = document.getElementById('backImageButton');

    knockoutMatchButton?.addEventListener('click', () => {
        const matchPlayers = [];
        matchPlayers.push(bracketPlayers[currentRound][currentMatch * 2]);
        matchPlayers.push(bracketPlayers[currentRound][currentMatch * 2 + 1]);
        sessionStorage.setItem('matchPlayers', JSON.stringify(matchPlayers)); // Salva i giocatori della partita
        navigate("/tournament/knockout/bracket/game", "Bracket Pong Game");
    });

    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
        change_name(current_user.display_name);
        update_image(current_user.image);
    });
};