import { boardBackground } from "../data/forza4_game_global.js";
import { highlightColumn } from "./forza4_grid_visual.js";
import { checkWin } from "./forza4_check_win.js";
import { token1Color, token2Color } from "../data/forza4_game_global.js";
import { savef4StatsData } from "../data/forza4_game_stats.js";

export function createGrid(game) {
    console.log("Creo griglia Forza 4");

    const boardElement = document.getElementById('f4board');
    const forza4Game = document.getElementById('forza4Game');
    boardElement.innerHTML = '';

    const gap = window.innerWidth * 0.01; // Spazio tra le celle
    const maxWidth = window.innerWidth * 0.6; // Larghezza massima del board (80% della finestra)
    const maxHeight = window.innerHeight * 0.6; // Altezza massima del board (80% della finestra)
    
    // Calcolo della dimensione ottimale delle celle
    const cellSize = Math.min(
        Math.floor((maxWidth - game.cols * gap) / game.cols),
        Math.floor((maxHeight - game.rows * gap) / game.rows)
    );
    
    const boardWidth = game.cols * cellSize + (game.cols - 1) * gap;
    const boardHeight = game.rows * cellSize + (game.rows - 1) * gap;

    // Stile della board
    boardElement.style.display = 'grid';
    boardElement.style.gridTemplateRows = `repeat(${game.rows}, ${cellSize}px)`;
    boardElement.style.gridTemplateColumns = `repeat(${game.cols}, ${cellSize}px)`;
    boardElement.style.gap = `${gap}px`;
    boardElement.style.width = `${boardWidth}px`;
    boardElement.style.height = `${boardHeight}px`;
    boardElement.style.margin = 'auto';

    // Imposta il background dinamico
    if (boardBackground === 'bg1') 
    {
        document.getElementById("app").style.background = 
            "linear-gradient(35deg, #134946, #000000), radial-gradient(circle, rgba(255, 243, 255, 0.2) 30%, transparent 60%)";
        forza4Game.style.backgroundColor = '#134946';
    }  
    else if (boardBackground === 'bg2') 
    {
        document.getElementById("app").style.background = 
            "linear-gradient(35deg, #240046, #5a189a, #00f5d4), radial-gradient(circle, rgba(255, 243, 255, 0.2) 30%, transparent 60%)";
        forza4Game.style.backgroundColor = '#240046';
    }
    else if (boardBackground === 'bg3')
    {
        document.getElementById("app").style.background = 
            "linear-gradient(35deg, #8b4513, #c29d60, #d08a4d), radial-gradient(circle, rgba(255, 243, 255, 0.2) 30%, transparent 60%)";
        forza4Game.style.backgroundColor = '#8b4513';
    }

    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    // Creazione delle celle della griglia
    for (let row = 0; row < game.rows; row++) {
        for (let col = 0; col < game.cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.border = '1px solid #fff'; 
            cell.style.backgroundColor = 'rgba(240, 240, 240, 0.5)'; 
            
            cell.addEventListener('mouseover', () => highlightColumn(game, col, true));
            cell.addEventListener('mouseout', () => highlightColumn(game, col, false));
            cell.addEventListener('click', (event) => checkGrid(event, game));
            
            boardElement.appendChild(cell);
        }
    }
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.backgroundImage = 'none'; 
        cell.style.backgroundColor = 'rgba(240, 240, 240, 0.5)'; 
    });
}



function checkGrid(event,game) {
    if (game.gameEnded) return;
    const col = +event.target.dataset.col;
    for (let row = game.rows - 1; row >= 0; row--) {
        if (!game.board[row][col] && !game.powerUpActive) {
            console.log("row selected = " +row);
            game.board[row][col] = game.currentPlayer;
            updateGrid(game, row, col);
            if (checkWin(game, row, col)) {
                game.gameEnded = true;
                if (game.currentPlayer === 'token1') 
                    game.message.textContent = `${game.p1} vince!`;
                else
                    game.message.textContent = `${game.p2} vince!`;
                game.grid.removeEventListener('click', checkGrid, true);
                if (game.f4BackToMenuButton) {
                    game.f4BackToMenuButton.style.display = 'block';
                } else {
                    console.error("I pulsanti Replay e Back to Menu non sono stati trovati nel DOM.");
                }
                clearInterval(game.timerInterval); // Ferma il timer
                savef4StatsData(game, false);
                return;
            }
            if (isGridFull(game)) {
                game.gameEnded = true;
                game.message.textContent = "Tie!";
                game.grid.removeEventListener('click', checkGrid, true);
                if (game.f4BackToMenuButton) {
                    game.f4BackToMenuButton.style.display = 'block';
                } else {
                    console.error("I pulsanti Replay e Back to Menu non sono stati trovati nel DOM.");
                }
                clearInterval(game.timerInterval); // Ferma il timer
                savef4StatsData(game, true); // Passa true per indicare un pareggio
                return;
            }
            game.currentPlayer = game.currentPlayer === 'token1' ? 'token2' : 'token1';
            game.printPlayerTurnMessage();
            return;
        }
    }
}

function updateGrid(game, row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;
    cell.style.backgroundColor = game.currentPlayer === 'token1' ? token1Color : token2Color;
    game.moves++;
    //cell.classList.add(currentPlayer);
}


export function redrawGrid(game, rows, cols) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.backgroundColor = 'rgba(240, 240, 240, 0.5)';
    });

    for (let i = 0; i < game.rows; i++) {
        for (let j = 0; j < game.cols; j++) {
            if (game.board[i][j] === 'token1') {
                cells[i * game.cols + j].style.backgroundColor = token1Color;
            } else if (game.board[i][j] === 'token2') {
                cells[i * game.cols + j].style.backgroundColor = token2Color;
            }
        }
    }
}

function isGridFull(game) {
    for (let row = 0; row < game.rows; row++) {
        for (let col = 0; col < game.cols; col++) {
            if (!game.board[row][col]) {
                return false; // Se trovi una cella vuota, la griglia non è piena
            }
        }
    }
    return true; // Se tutte le celle sono occupate, la griglia è piena
}

