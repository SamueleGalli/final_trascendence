export function checkWin(game, row, col) {
    return checkDirection(game, row, col, 1, 0) || 
           checkDirection(game, row, col, 0, 1) || 
           checkDirection(game, row, col, 1, 1) || 
           checkDirection(game, row, col, 1, -1);
}

function checkDirection(game, row, col, rowDir, colDir) {
    let count = 1;
    const winningCells = [{ row, col }]; // Inizializziamo l'array con la cella di partenza
    count += countInDirection(game, row, col, rowDir, colDir, winningCells);
    count += countInDirection(game, row, col, -rowDir, -colDir, winningCells);

    if (count >= 4) {
        // A questo punto `winningCells` contiene tutte le celle della serie vincente
        highlightWinningCells(winningCells);
        return true;
    }
    return false;
}


function countInDirection(game, row, col, rowDir, colDir, winningCells) {
    let r = row + rowDir;
    let c = col + colDir;
    let count = 0;
    while (r >= 0 && r < game.rows && c >= 0 && c < game.cols && game.board[r][c] === game.currentPlayer) {
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