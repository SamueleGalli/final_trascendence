import { token1Color, token2Color } from "../data/forza4_game_global.js";

export function highlightColumn(game, col, highlight) {
    for (let row = 0; row < game.rows; row++) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

        // Check if there's token in a cell
        if (game.board[row][col] === 'token1') 
            cell.style.backgroundColor = token1Color; 
        else if (game.board[row][col] === 'token2')
            cell.style.backgroundColor = token2Color; 
        else //empty cell
            cell.style.backgroundColor = highlight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(240, 240, 240, 0.5)';
    }
}
    
    
export function resetCellBorders() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.border = '1px solid #fff'; // Ripristina il bordo a quello iniziale
    });
}
