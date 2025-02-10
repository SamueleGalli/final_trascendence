import { boardBackground } from "../data/forza4_game_global.js";
import { highlightColumn } from "./forza4_grid_visual.js";
import { checkWin } from "./forza4_check_win.js";
import { token1Color, token2Color } from "../data/forza4_game_global.js";
import { savef4StatsData } from "../data/forza4_game_stats.js";
export function createGrid(game) {
    console.log("Creo griglia Forza 4");

    const boardElement = document.getElementById('f4board');
    boardElement.innerHTML = '';

    const gap = 20; //gap between cells
    const cellSize = 50;
    const boardWidth = game.cols * cellSize + (game.cols) * gap; 
    const boardHeight = game.rows * cellSize + (game.rows) * gap;
    

    // Stile della board
    boardElement.style.display = 'grid';
    boardElement.style.gridTemplateRows = `repeat(${game.rows}, ${cellSize}px)`;
    boardElement.style.gridTemplateColumns = `repeat(${game.cols}, ${cellSize}px)`;
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
    for (let row = 0; row < game.rows; row++) {
        for (let col = 0; col < game.cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

           
            cell.style.border = '1px solid #fff'; 
            cell.style.backgroundColor = 'transparent';

            // When the mouse hovers over a cell, highlight the column
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

