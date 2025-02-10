import { calculateXpF4Players, calculateLevelF4Players } from "../other/forza4_xp_level.js";
import { f4FormatTime } from "../other/forza4_timer.js";
export function savef4StatsData(game, isTie) {
    const f4data = JSON.parse(localStorage.getItem('f4_game_data')) || { players: {} };
    if (!f4data.players[game.p1]) {
        f4data.players[game.p1] = { wins: 0, losses: 0, tie: 0, moves: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100, matches: [] };
    }
    if (!f4data.players[game.p2]) {
        f4data.players[game.p2] = { wins: 0, losses: 0, tie: 0, moves: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100, matches: []};
    }
    // Tie
    if (isTie) {
        f4data.players[game.p1].tie += 1;
        f4data.players[game.p2].tie += 1;
    } 
    // No Tie (someone won the match)
    else {
        let winner;
        let loser;
        if (game.currentPlayer === 'token1') {
            winner = game.p1;
            loser = game.p2;
            f4data.players[game.p1].wins += 1;
            f4data.players[game.p2].losses += 1;
        } else {
            winner = game.p2;
            loser = game.p1;
            f4data.players[game.p2].wins += 1;
            f4data.players[game.p1].losses += 1;
        }
        calculateXpF4Players(f4data, winner, loser);
        calculateLevelF4Players(f4data, winner, loser);
    }

    f4data.players[game.p1].moves += game.moves;
    f4data.players[game.p2].moves += game.moves;

    const f4matchDetails = {
        player1: game.p1,
        player2: game.p2,
        winner: isTie ? null : (game.currentPlayer === 'token1' ? game.p1 : game.p2),
        moves: game.moves,
        seconds: game.elapsedTime,
        matchTime: f4FormatTime(game.elapsedTime),
        date: new Date().toISOString()
    };
    f4data.players[game.p1].matches.push(f4matchDetails);
    f4data.players[game.p2].matches.push(f4matchDetails);

    localStorage.setItem('f4_game_data', JSON.stringify(f4data));
    console.log("Dati aggiornati:", f4data);
}


