import { matchData } from './game_global.js';
import { formatTime } from '../other/timer.js';
import { calculateXpPlayers, calculateLevelPlayers } from '../other/xp_level.js';

export function saveMatchStatsData(p1Name, p2Name, scoreP1, scoreP2) {
    matchData.player1 = p1Name;
    matchData.player2 = p2Name;
    matchData.scorep1 = scoreP1;
    matchData.scorep2 = scoreP2;
    matchData.matchTime = formatTime(matchData.seconds);

    localStorage.setItem('match_data', JSON.stringify(matchData)); //TODO: Change with storage in db postgres
    saveUserStatsData(matchData);
    
}

function saveUserStatsData(matchData) {
    const player1 = matchData.player1;
    const player2 = matchData.player2;
    const score1 = matchData.scorep1;
    const score2 = matchData.scorep2;
    const matchTime = matchData.seconds;
    const longestRally = matchData.longestRally;
    const data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };


    // calculateXpPlayers(data, winner, loser);
    // calculateLevelPlayers(data, winner, loser);


    fetch("http://localhost:8008", {
        method: "save_pong_game",
        body: JSON.stringify({
            player1: player1,
            player2: player2,
            score1: score1,
            score2: score2,
            begin_time: matchTime,
            longest_rally: longestRally
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
        }
        return response.status === 204 ? {} : response.json();
    })
    .then(data => {
        console.log("saving...");
        console.log("Save Pong Game response: ", data);

        // Ora esegui la seconda chiamata fetch solo dopo che la prima ha avuto successo
        return fetch("http://localhost:8008", {
            method: "get_pong_games",
            body: JSON.stringify({
                realname: player1,
            }),
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log("Get Pong Game response: ", data);
    })
    .catch(error => console.error("Fetch error:", error));
}

export function resetMatchStatsData() {
    matchData.player1 = '';
    matchData.player2 = '';
    matchData.matchTime = '';
    matchData.scorep1 = 0;
    matchData.scorep2 = 0;
    matchData.seconds = 0;
    matchData.longestRally = 0;
}