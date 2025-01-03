import { navigate } from "../main.js";

const boxWidth = 100;
const boxHeight = 50;
const roundGap = 200; // space between tournament rounds
let boxColor = 'black';
let matchBoxPos = [];
let yOffset = 60;

let matchesPerRound = 8;
let matchesThisRound;
let rounds = 4;
let currentMatch = 0;
let currentRound = 0;
let firstDraw = true;
let bracketPlayers;
let bracketCanvas;
let bracketCtx;

export default function Bracket() {
    const html = `
    <h2 class="text">
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
    </h2>
    <div id="tournamentBracket" style="text-align:center;">
        <canvas id="bracketCanvas" width="800" height="600" style="border:1px solid #000; display:none;"></canvas>
        <div class="bracket-button-container">
            <button class="button-style" id="knockoutMatchButton">Play Match</button>
        </div>
        <div class="bracket-button-container">
            <button class="button-style" id="gameCustomizeButton">Customize</button>
        </div>
    </div>
   `;
   return html;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawLine(x1, y1, x2, y2, bracketCtx) {
    bracketCtx.beginPath();
    bracketCtx.moveTo(x1, y1);
    bracketCtx.lineTo(x2, y2);
    bracketCtx.strokeStyle = 'rgb(80, 80, 80)';
    bracketCtx.stroke();
}

function drawRectangle(x, y, width, height, player1, player2, boxColor, bracketCtx) {
    bracketCtx.strokeStyle = boxColor;
    bracketCtx.strokeRect(x, y, width, height);

    bracketCtx.fillStyle = 'white'; 
    bracketCtx.font = '14px Liberty';
    bracketCtx.textAlign = 'center';
    bracketCtx.textBaseline = 'top'; 
    if (player1)
        bracketCtx.fillText(player1, x + width / 2, y + 5); 

    bracketCtx.font = '10px Liberty'; 
    bracketCtx.textBaseline = 'middle'; 
    bracketCtx.fillText('vs', x + width / 2, y + height / 2);

    bracketCtx.font = '14px Liberty';
    bracketCtx.textBaseline = 'bottom';
    if (player2)
        bracketCtx.fillText(player2, x + width / 2, y + height - 5);
}

function initializeBracket() {
    bracketPlayers = new Array(rounds);
    for (let i = 0; i < rounds; i++) {
        bracketPlayers[i] = new Array(matchesPerRound * 2);
    }
}

export function addDrawBracket(players) {
    bracketCanvas = document.getElementById('bracketCanvas');
    bracketCtx = bracketCanvas.getContext('2d');

    bracketCanvas.style.display = 'block';
    bracketCtx.font = '14px Liberty';

    const knockoutMatchButton = document.getElementById('knockoutMatchButton');
    const backToMenuButton = document.getElementById('backToMenuButton');
    matchesPerRound = players.length / 2;

    rounds = Math.log2(players.length);
    matchBoxPos = []; 

    const totalWidth = (rounds - 1) * roundGap + boxWidth;
    const totalHeight = matchesPerRound * yOffset;

    let xOffset = (bracketCanvas.width - totalWidth) / 2;
    let yStart = (bracketCanvas.height - totalHeight) / 2; 

    if (firstDraw) {
        firstDraw = false;
        knockoutMatchButton.style.display = 'block';
        matchesThisRound = matchesPerRound;
        initializeBracket(rounds);
        bracketPlayers[0] = shuffleArray(players);
    }

    matchBoxPos[0] = [];
    for (let i = 0; i < matchesPerRound; i++) {
        let x = xOffset;
        let y = yStart + yOffset * i;
        let player1 = bracketPlayers[0][i * 2]; 
        let player2 =  bracketPlayers[0][i * 2 + 1]; 

        boxColor = (i === currentMatch && currentRound === 0) ? 'rgb(2 ,191 , 185)' : 'white';

        drawRectangle(x, y, boxWidth, boxHeight, player1, player2, boxColor, bracketCtx);
        matchBoxPos[0].push([x, y]);
    }

    xOffset += roundGap;

    for (let round = 1; round < rounds; round++) {
        matchesPerRound /= 2;
        matchBoxPos[round] = []; 

        for (let i = 0; i < matchesPerRound; i++) {
            let prevY1 = matchBoxPos[round - 1][i * 2][1];
            let prevY2 = matchBoxPos[round - 1][i * 2 + 1][1];
            let y = (prevY1 + prevY2) / 2;
            let x = xOffset;

            boxColor = (i === currentMatch && currentRound === round) ? 'rgb(2 ,191 , 185)' : 'white';

            drawRectangle(x, y, boxWidth, boxHeight, bracketPlayers[round][i * 2], bracketPlayers[round][i * 2 + 1], boxColor, bracketCtx);
            matchBoxPos[round].push([x, y]);

            let centerX = x;
            let centerY = y + boxHeight / 2; 
            let prevCenterX = x - roundGap + boxWidth; 
            let prevCenterY1 = prevY1 + boxHeight / 2;
            let prevCenterY2 = prevY2 + boxHeight / 2;
            let midY = (prevCenterY1 + prevCenterY2) / 2; 

            drawLine(prevCenterX, prevCenterY1, prevCenterX + roundGap / 2 - 20, prevCenterY1, bracketCtx); 
            drawLine(prevCenterX, prevCenterY2, prevCenterX + roundGap / 2 - 20, prevCenterY2, bracketCtx); 
            drawLine(prevCenterX + roundGap / 2 - 20, prevCenterY1, prevCenterX + roundGap / 2 - 20, prevCenterY2, bracketCtx);
            drawLine(prevCenterX + roundGap / 2, midY, centerX - 20, centerY, bracketCtx);
        }

        xOffset += roundGap;
    }

    knockoutMatchButton.addEventListener('click', (event) => {
        const path = '#game';
        const matchPlayers = [];

        matchPlayers.push(bracketPlayers[currentRound][currentMatch * 2]);
        matchPlayers.push(bracketPlayers[currentRound][currentMatch * 2 + 1]);
        sessionStorage.setItem('matchPlayers', JSON.stringify(matchPlayers));
        window.history.pushState({}, path, window.location.origin + path);
        navigate(path, event.target.id);
    });

    backToMenuButton.addEventListener('click', (event) => {
        const path = '';
        window.history.pushState({}, path, window.location.origin + path);
        resetBracketState();
        navigate(path, event.target.id);
    });

    gameCustomizeButton.addEventListener('click', (event) => {
        navigate("/tournament/knockout/bracket/customize", "Customize");
    });
}

function resetBracketState() {
    currentMatch = 0;
    currentRound = 0;
    firstDraw = true;
    matchBoxPos = [];
}

export function backToBracket(winner) {
    if (currentRound < rounds - 1) {
        bracketPlayers[currentRound + 1][currentMatch] = winner;
        currentMatch++;
        if (currentMatch > matchesThisRound - 1) {
            currentMatch = 0;
            currentRound++;
            matchesThisRound /= 2;
        }
        drawBracket(bracketPlayers[0]);
    } else {
        drawBracket(bracketPlayers[0]);

        knockoutMatchButton.hidden = true;
        knockoutMatchButton.style.display = 'none';
        backToMenuButton.hidden = false;
        backToMenuButton.style.display = 'block';

        bracketCtx.font = '30px Liberty';
        bracketCtx.fillStyle = 'white'; 
        bracketCtx.textAlign = 'center';
        bracketCtx.textBaseline = 'top';
        bracketCtx.fillText(winner + ' Wins the Tournament!', bracketCanvas.width / 2, bracketCanvas.height - 160);
    }
}