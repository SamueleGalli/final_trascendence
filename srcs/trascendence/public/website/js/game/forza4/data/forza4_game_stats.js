
import { userName } from "../../../pages/user_data.js";
export function savef4StatsData(game, isTie) {
    
    let winner;
    if (isTie) {
        winner = "tie";
    } 
    // No Tie (someone won the match)
    else {
        if (game.currentPlayer === 'token1') 
            winner = game.p1;
        else 
            winner = game.p2;
        // calculateXpF4Players(f4data, winner, loser);
        // calculateLevelF4Players(f4data, winner, loser);
     }
     console.log("elapsed time: " + game.elapsedTime);
    fetch("http://localhost:8008", {
        method: "save_f4_game",
        body: JSON.stringify({
            player1: game.p1,
            player2: game.p2,
            winner: winner,
            moves: game.moves,
            begin_time: game.elapsedTime
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
        }
        return response.status === 204 ? {} : response.json();
    })
    .then(data => {
        console.log("Save Forza4 Game response: ", data);

        // Ora esegui la seconda chiamata fetch solo dopo che la prima ha avuto successo
        return fetch("http://localhost:8008", {
            method: "get_f4_games",
            body: JSON.stringify({
                realname: userName,
            }),
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log("Get Forza4 Game response: ", data);
    })
    .catch(error => console.error("Fetch error:", error));
}


