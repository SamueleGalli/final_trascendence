import { navigate } from "../../main.js";
import { token1Color, token2Color, boardBackground, f4matchData} from "./forza4_game_global.js";
import { current_user } from "../../pages/modes.js";

let f4ReplayButton;
let f4BackToMenuButton;
let rows;
let cols;
let currentPlayer;
let grid;
let message;
let board;
let gameEnded;
let f4Players = [];
let p1;
let p2;
let moves = 0;

let startTime;
let timerInterval;
let elapsedTime = 0;


export function Forza4() {
    return `
        <img id="backImageButton" src="../game_engine/images/home.png" alt="Back" class="back-button">
        <div id="forza4Game">
            <h1>Forza 4</h1>
            <div id="f4players">
                <div id="p1" class="f4player-info">
                    <span class="name" id="p1Name"></span>&nbsp<span class="color token1" id="p1Color"></span>
                </div>
                <div id="p2" class="f4player-info">
                    <span class="name" id="p2Name"></span>&nbsp<span class="color token2" id="p2Color"></span>
                </div>
            </div>
            <div id="f4timer" style="color: #fff; margin-top: 10px; font-size: 30px; font-family: 'Liberty';">00:00</div>
            <div id="f4grid-container">
                <div id="f4board"></div> <!-- Griglia di gioco -->
            </div>
            <div id="f4message" style="color: #fff; margin-top: 10px; font-size: 30px; font-family: 'Liberty';"></div>
            <button id="f4ReplayMatchButton" style="display: none; margin: 0 auto;">Replay Match</button>
            <button id="f4BackToMenuButton" class="button-style" style="display: none; margin: 20px auto;">Back to Menu</button>
        </div>
    `;
}

function createGrid() {
    console.log("Creo griglia Forza 4");

    const boardElement = document.getElementById('f4board');
    boardElement.innerHTML = '';

    const gap = 20; //gap between cells
    const cellSize = 50;
    const boardWidth = cols * cellSize + (cols) * gap; 
    const boardHeight = rows * cellSize + (rows) * gap;
    

    // Stile della board
    boardElement.style.display = 'grid';
    boardElement.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
    boardElement.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    boardElement.style.gap = `${gap + 1}px`;
    boardElement.style.width = `${boardWidth}px`;
    boardElement.style.height = `${boardHeight}px`;
    boardElement.style.border = '5px solid #000'; 

    if (boardBackground === 'classic')            
        boardElement.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url("https://fcit.usf.edu/matrix/wp-content/uploads/2019/03/CircuitBoard-Wide.jpg")';
    else if (boardBackground === '42')
        boardElement.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url("https://i.ytimg.com/vi/jmi9WXlHMOc/maxresdefault.jpg")';
    else if (boardBackground === 'cartoon')
        boardElement.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url("https://img.freepik.com/free-photo/artistic-background-wallpaper-with-color-halftone-effect_58702-9282.jpg?semt=ais_hybrid")';

    boardElement.style.backgroundSize = 'cover';
    boardElement.style.backgroundPosition = 'center';

    // Create board cells
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.style.border = '1px solid #fff'; 
            cell.style.backgroundColor = 'transparent';

            // When the mouse hovers over a cell, highlight the column
            cell.addEventListener('mouseover', () => highlightColumn(col, true));
            cell.addEventListener('mouseout', () => highlightColumn(col, false));
            cell.addEventListener('click', checkGrid);

            boardElement.appendChild(cell);
        }
    }
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.backgroundImage = 'none'; 
        cell.style.backgroundColor = 'rgba(240, 240, 240, 0.5)'; 
    });
}


function highlightColumn(col, highlight) {
    for (let row = 0; row < rows; row++) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

        // Check if there's token in a cell
        if (board[row][col] === 'token1') 
            cell.style.backgroundColor = token1Color; 
        else if (board[row][col] === 'token2')
            cell.style.backgroundColor = token2Color; 
        else //empty cell
            cell.style.backgroundColor = highlight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(240, 240, 240, 0.5)';
    }
}

function printPlayerTurnMessage() {
    if (currentPlayer === 'token1') {
        message.textContent = `Turno di ${p1}`;
    }
    else {
        message.textContent = `Turno di ${p2}`;
    }
}

function f4FormatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function savef4StatsData() {
    const f4data = JSON.parse(localStorage.getItem('f4_game_data')) || { players: {} };
    if (!f4data.players[p1]) {
        f4data.players[p1] = { wins: 0, losses: 0, tie: 0, moves: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100, matches: [] };
    }
    if (!f4data.players[p2]) {
        f4data.players[p2] = { wins: 0, losses: 0, tie: 0, moves: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100, matches: []};
    }

    let winner;
    let loser;
    // Increment wins counter and losses counter for both players
    if (currentPlayer === 'token1') {
        winner = p1;
        loser = p2;
        f4data.players[p1].wins += 1;
        f4data.players[p2].losses += 1;
    } else {
        winner = p2;
        loser = p1;
        f4data.players[p2].wins += 1;
        f4data.players[p1].losses += 1;
    }
    f4data.players[p1].moves += moves;
    f4data.players[p2].moves += moves;

    // Salva il tempo della partita
    const f4matchDetails = {
        player1: p1,
        player2: p2,
        winner: winner,
        moves: moves,
        seconds: elapsedTime,
        matchTime: f4FormatTime(elapsedTime),
        date: new Date().toISOString() // Data del match
    };
    f4data.players[p1].matches.push(f4matchDetails);
    f4data.players[p2].matches.push(f4matchDetails);
    //f4data.players[p1].matches.push({ opponent: p2, result: currentPlayer === 'token1' ? 'win' : 'loss', time: elapsedTime });
    //f4data.players[p2].matches.push({ opponent: p1, result: currentPlayer === 'token2' ? 'win' : 'loss', time: elapsedTime });
    
    console.log("moves = " + moves);
    console.log(f4data);
    calculateXpF4Players(f4data, winner, loser);
    calculateLevelF4Players(f4data, winner, loser);
    localStorage.setItem('f4_game_data', JSON.stringify(f4data));
    console.log("Dati aggiornati:", f4data);
}


function calculateXpF4Players(data, winner, loser) {
    // Winner gains xp
    if (data.players[loser].level <= data.players[winner].level)
        data.players[winner].xp += 20;
    else if (data.players[loser].level > data.players[winner].level)
        data.players[winner].xp += 20 * (data.players[loser].level - data.players[winner].level + 1);

    // Loser lost xp
    if (data.players[loser].level >= data.players[winner].level)
        data.players[loser].xp -= 20;
    else if (data.players[loser].level < data.players[winner].level)
        data.players[loser].xp -= 20 * (data.players[winner].level - data.players[loser].level + 1);

    if (data.players[loser].xp < 0)
        data.players[loser].xp = 0;
}


function calculateLevelF4Players(data, winner, loser) {
    if(data.players[winner].xp >= data.players[winner].pointsToNextLevel) {
        data.players[winner].level += 1;
        data.players[winner].pointsToLoseLevel = data.players[winner].pointsToNextLevel;
        data.players[winner].pointsToNextLevel *= 2;
    }

    if (data.players[loser].xp <= data.players[loser].pointsToLoseLevel) {
        if (data.players[loser].pointsToLoseLevel > 0) {
            data.players[loser].level -= 1;
            data.players[loser].pointsToNextLevel = data.players[winner].pointsToLoseLevel;
            if (data.players[loser].level == 1)
                data.players[loser].pointsToLoseLevel = 0;
            else 
                data.players[loser].pointsToLoseLevel /= 2; 
        }
    }
            
}

function checkGrid(event) {
    if (gameEnded) return;
    const col = +event.target.dataset.col;
    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            updateGrid(row, col);
            if (checkWin(row, col)) {
                gameEnded = true;
                if (currentPlayer === 'token1') 
                    message.textContent = `${p1} vince!`;
                else
                    message.textContent = `${p2} vince!`;
                grid.removeEventListener('click', checkGrid, true);
                if (f4ReplayButton && f4BackToMenuButton) {
                    //f4ReplayButton.style.display = 'block';
                    f4BackToMenuButton.style.display = 'block';
                } else {
                    console.error("I pulsanti Replay e Back to Menu non sono stati trovati nel DOM.");
                }
                clearInterval(timerInterval); // Ferma il timer
                savef4StatsData();

                return;
            }
            currentPlayer = currentPlayer === 'token1' ? 'token2' : 'token1';
            printPlayerTurnMessage();
            return;
        }
    }
}


function updateGrid(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;
    cell.style.backgroundColor = currentPlayer === 'token1' ? token1Color : token2Color;
    moves++;
    //cell.classList.add(currentPlayer);
}

function checkWin(row, col) {
    return checkDirection(row, col, 1, 0) || 
            checkDirection(row, col, 0, 1) || 
            checkDirection(row, col, 1, 1) || 
            checkDirection(row, col, 1, -1);
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
    const winningCells = [{ row, col }]; // Inizializziamo l'array con la cella di partenza
    count += countInDirection(row, col, rowDir, colDir, winningCells);
    count += countInDirection(row, col, -rowDir, -colDir, winningCells);

    if (count >= 4) {
        // A questo punto `winningCells` contiene tutte le celle della serie vincente
        highlightWinningCells(winningCells);
        return true;
    }
    return false;
}


function countInDirection(row, col, rowDir, colDir, winningCells) {
    let r = row + rowDir;
    let c = col + colDir;
    let count = 0;
    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
        winningCells.push({ row: r, col: c });  // Aggiungi la cella alla lista delle celle vincenti
        count++;
        r += rowDir;
        c += colDir;
    }
    return count;
}

function highlightWinningCells(winningCells) {
    winningCells.forEach(cell => {
        const cellElement = document.querySelector(`.cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
        if (cellElement) {
            cellElement.style.border = '5px solid #0fffcf';
        }
    });
}

function resetCellBorders() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.border = '1px solid #fff'; // Ripristina il bordo a quello iniziale
    });
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const timerElement = document.getElementById('f4timer');
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


export function startforza4Game() {
    const p1Name = document.getElementById('p1Name');
    const p2Name = document.getElementById('p2Name');
    const p1Color = document.getElementById('p1Color');
    const p2Color = document.getElementById('p2Color');
    const backImageButton = document.getElementById('backImageButton');
    
    f4ReplayButton = document.getElementById('f4ReplayMatchButton');
    f4BackToMenuButton = document.getElementById('f4BackToMenuButton');

    //Reset variables
    moves = 0;
    elapsedTime = 0;

    p1Color.style.backgroundColor = token1Color;
    p2Color.style.backgroundColor = token2Color;
    rows = 6;
    cols = 7;
    currentPlayer = 'token1';
    grid = document.getElementById('f4board');
    message = document.getElementById('f4message');
    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    gameEnded = false;

    f4Players = JSON.parse(sessionStorage.getItem('forza4players'));
    p1 = f4Players[0];
    p2 = f4Players[1];

    p1Name.textContent = p1 + ":";
    p2Name.textContent = p2 + ":";

    //console.log("token 1 color: ", token1Color);
    //console.log("token 2 color: ", token2Color);

    createGrid();
    printPlayerTurnMessage();

    // Avvia il timer
    startTime = Date.now() - elapsedTime * 1000;
    clearInterval(timerInterval); // Assicurati di cancellare qualsiasi intervallo precedente
    timerInterval = setInterval(updateTimer, 1000);

    f4ReplayButton.addEventListener('click', () => {
        gameEnded = false;
        board = Array.from({ length: rows }, () => Array(cols).fill(null));
        resetCellBorders();
        f4ReplayButton.style.display = 'none';
        f4BackToMenuButton.style.display = 'none';
        currentPlayer = 'token1';
        startforza4Game();
    });
    
    f4BackToMenuButton.addEventListener('click', (event) => {
        gameEnded = false;
        board = Array.from({ length: rows }, () => Array(cols).fill(null));
        resetCellBorders();
        navigate("/forza4", "Forza 4 Home");
    });

    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
        change_name(current_user.display_name);
        update_image(current_user.image);
    });
}