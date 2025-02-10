export function activatePowerup(game, player) {
    if (game.gameEnded) return;

    console.log("game board = " + game.board);

    if ((game.currentPlayer === 'token1' && player === 'token2') || (game.currentPlayer === 'token2' && player === 'token1')) {
        alert("Not your turn!");
        return;
    }
    else if (game.moves === 0) {
        alert("No tokens to remove!");
        return;
    }

    game.f4PowerupInfo.textContent = "Select an opponent token to remove";
       
    game.powerUpActive = true;
    // Disabilita il pulsante del power-up dopo l'uso
    if (player === 'token1') {
        game.p1PowerupUsed = true;
        document.getElementById('p1PowerupButton').disabled = true;
    } else {
        game.p2PowerupUsed = true;
        document.getElementById('p2PowerupButton').disabled = true;
    }

    // Abilita la selezione della pedina da eliminare
    const cells = document.querySelectorAll('.cell');
    const handlePowerupClick = (event) => handlePowerupSelection(event, game, player);

    cells.forEach(cell => {
        cell.addEventListener('click', handlePowerupClick);
    });


    
    // Funzione per gestire la selezione della pedina
    function handlePowerupSelection(event, game, player) {
        const row = +event.target.dataset.row;
        const col = +event.target.dataset.col;

        // Verifica che la cella selezionata contenga una pedina dell'avversario
        const opponentToken = player === 'token1' ? 'token2' : 'token1';
        console.log("row == " + row + " col == " + col);
        console.log("game board after deleting");
        console.log("whats in?  => " + game.board[row][col]);
        if (game.board[row][col] === opponentToken) {
            // Elimina la pedina
            game.board[row][col] = null;
            if (row > 0)
                moveDownUpperTokens(game, row, col);
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.style.backgroundColor = 'rgba(240, 240, 240, 0.5)'; // Ripristina il colore della cella
            

            // Rimuovi i listener di selezione dalle altre celle
            cells.forEach(cell => {
                cell.removeEventListener('click', handlePowerupClick);
            });

            // Passa il turno all'avversario
            game.currentPlayer = opponentToken;
            game.printPlayerTurnMessage();
            game.powerUpActive = false;
            game.f4PowerupInfo.textContent = "";
        } else {
            alert("Select an opponent token!");
        }
    }
}

function moveDownUpperTokens(game, row, col) {
    console.log("moving down...");
    for (let r = row - 1; r >= 0; r--) {
        if (game.board[r][col] !== null) {
            console.log("sposta giù")
            game.board[r + 1][col] = game.board[r][col];
            game.board[r][col] = null;
        }
    }
}