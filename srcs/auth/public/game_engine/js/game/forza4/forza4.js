import { navigate } from "../../main.js";
import { token1Color, token2Color, boardBackground } from "./forza4_game_global.js";

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


export function Forza4() {
    return `
    <h1>Forza 4</h1>
    <div id="forza4Game">
        <div id="f4players">
            <div id="p1" class="f4player-info">
                <span id="p1Name"></span>&nbsp<span class="color token1" id="p1Color"></span>
            </div>
            <div id="p2" class="f4player-info">
                <span id="p2Name"></span>&nbsp<span class="color token2" id="p2Color"></span>
            </div>
        </div>
        <div id="f4grid-container">
            <div id="f4board"></div> <!-- Aggiunto per rappresentare la board -->
        </div>
        <div id="f4message"></div>
        <button id="f4ReplayMatchButton" style="display: none; margin: 0 auto;">Replay Match</button>
        <button id="f4BackToMenuButton" style="display: none; margin: 0 auto;">Back to Menu</button>
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
            cell.addEventListener('click', handleClick);

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
    message.className = 'text word';
    if (currentPlayer === 'token1') {
        message.textContent = `Turno di ${p1}`;
    }
    else {
        message.textContent = `Turno di ${p2}`;
    }
}

function savef4StatsData() {
    const f4data = JSON.parse(localStorage.getItem('f4_game_data')) || { players: {} };
    if (!f4data.players[p1]) {
        f4data.players[p1] = { wins: 0, losses: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100 };
    }
    if (!f4data.players[p2]) {
        f4data.players[p2] = { wins: 0, losses: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100 };
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

function handleClick(event) {
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
                grid.removeEventListener('click', handleClick, true);
                if (f4ReplayButton && f4BackToMenuButton) {
                    //f4ReplayButton.style.display = 'block';
                    f4BackToMenuButton.style.display = 'block';
                } else {
                    console.error("I pulsanti Replay e Back to Menu non sono stati trovati nel DOM.");
                }
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
    count += countInDirection(row, col, rowDir, colDir);
    count += countInDirection(row, col, -rowDir, -colDir);
    return count >= 4;
}

function countInDirection(row, col, rowDir, colDir) {
    let r = row + rowDir;
    let c = col + colDir;
    let count = 0;
    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
        count++;
        r += rowDir;
        c += colDir;
    }
    return count;
}

export function startforza4Game() {
    const p1Name = document.getElementById('p1Name');
    const p2Name = document.getElementById('p2Name');
    const p1Color = document.getElementById('p1Color');
    const p2Color = document.getElementById('p2Color');
    
    f4ReplayButton = document.getElementById('f4ReplayMatchButton');
    f4BackToMenuButton = document.getElementById('f4BackToMenuButton');

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

    console.log("token 1 color: ", token1Color);
    console.log("token 2 color: ", token2Color);

    createGrid();
    printPlayerTurnMessage();

    f4ReplayButton.addEventListener('click', () => {
        gameEnded = false;
        board = Array.from({ length: rows }, () => Array(cols).fill(null));
        f4ReplayButton.style.display = 'none';
        f4BackToMenuButton.style.display = 'none';
        currentPlayer = 'token1';
        startforza4Game();
    });
    
    f4BackToMenuButton.addEventListener('click', (event) => {
        gameEnded = false;
        board = Array.from({ length: rows }, () => Array(cols).fill(null));
        navigate("/forza4", "Forza 4 Home");
    });
}