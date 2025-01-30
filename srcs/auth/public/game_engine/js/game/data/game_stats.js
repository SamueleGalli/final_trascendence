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

    //console.log("matchdata player 1: " +player1);
    //console.log("matchdata player 2: " + player2);
    
    // Initialize data if no players
    if (!data.players[player1]) {
        data.players[player1] = { wins: 0, losses: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100, xpHistory: [], matches: [] };
    }
    if (!data.players[player2]) {
        data.players[player2] = { wins: 0, losses: 0, xp: 0, level: 1, pointsToLoseLevel: 0, pointsToNextLevel: 100, xpHistory: [], matches: [] };
    }

    // Who wins?
    let winner;
    let loser;
    if (score1 > score2) {
        winner = player1;
        loser = player2;
        data.players[player1].wins += 1;
        data.players[player2].losses += 1;
    } else {
        winner = player2;
        loser = player1;
        data.players[player2].wins += 1;
        data.players[player1].losses += 1;
    }
    
    // Calculate XP Points gained by match players
    calculateXpPlayers(data, winner, loser);
    calculateLevelPlayers(data, winner, loser);

    // Create match details to store on player's data
    const matchDetails = {
        player1,
        player2,
        score1,
        score2,
        winner,
        longestRally,
        matchTime,
        date: new Date().toISOString() // Data del match
    };
    data.players[player1].matches.push(matchDetails);
    data.players[player2].matches.push(matchDetails);

    console.log(data.players[player1].matches);
    // Save in local (TODO -> Change with storage in Postgres DB)
    localStorage.setItem('game_data', JSON.stringify(data));
    //console.log("Dati aggiornati:", data);
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