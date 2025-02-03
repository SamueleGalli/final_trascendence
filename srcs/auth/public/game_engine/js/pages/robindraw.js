import { navigate } from "../main.js";

let playerList;
let playerNames = [];
let matchesListRobin = [];
let firstMatch = true;
let nextMatch = null;
let lastMatch = null;  
let playRobinMatchButton;
let robinBackToMenuButton

export default function RobinRanking() {
    return `  
        <h1 class="text">
            <span class="letter letter-1">R</span>
            <span class="letter letter-2">a</span>
            <span class="letter letter-3">n</span>
            <span class="letter letter-4">k</span>
            <span class="letter letter-5">i</span>
            <span class="letter letter-6">n</span>
            <span class="letter letter-7">g</span>
        </h1>
        <div id="robinRanking">
            <canvas id="rankingRobinCanvas" width="800" height="600"></canvas>
        </div>
        <div>
            <button class="button-style" id="playRobinMatchButton">Play Match</button>
            <button class="button-style" id="robinBackToMenuButton" style="display:none; margin: 0 auto;">Back to Menu</button>
        </div>
        <div class="avatar-container">
            <img id="backImageButton" src="../../game_engine/images/home.png" alt="Back" class="back-button">
        </div>
    `;
}

// Fisher-Yates shuffle
function shuffleMatchesArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializePlayers(players) {
    return players.map(playerName => ({
        name: playerName,
        points: 0
    }));
}

function findPlayersWithSameScore() {
    let playersEqualScore = [];

    for (let i = 0; i < playerList.length; i++) {
        if (playerList[0].points == playerList[i].points)
            playersEqualScore.push({name: playerList[i].name, points: playerList[i].points});
    }
    return playersEqualScore;
}

function findNextMatch(rankingRobinCtx) {
    let attempts;
    let tiebreaker;
    attempts = 0;


    //console.log("find the next match");
    if (matchesListRobin.length === 0) {
        if (playerList[0].points == playerList[1].points)
        {
            let playersWithSameScore = findPlayersWithSameScore();
            populateMatchesList(playersWithSameScore);
            //console.log("matchesListRobin: " + matchesListRobin);
            nextMatch = matchesListRobin.shift();
            tiebreaker = true;
        }
        else if (!nextMatch) //No more matches (Tournament finished)
        {
            rankingRobinCtx.font = '30px Liberty';
            rankingRobinCtx.textAlign = 'left';
            rankingRobinCtx.fillStyle = 'white';
            rankingRobinCtx.fillText(playerList[0].name + " Win the Tournament!", 80, 500);
            rankingRobinCtx.fillText("Congratulations!", 150, 540);
            playRobinMatchButton.style.display = "none";
            robinBackToMenuButton.style.display = "block";
            tiebreaker = false;
            return;
        }
    }
    
    if (playerNames.length > 4)
    {
        // Search until you find a match to play
        while (matchesListRobin.length > 0 && attempts < matchesListRobin.length) {
            nextMatch = matchesListRobin.shift();  // Estrai il primo match

                // Check if the players already played the match or no
                if (!lastMatch || (nextMatch.player1 !== lastMatch.player1 && nextMatch.player1 !== lastMatch.player2 && 
                                nextMatch.player2 !== lastMatch.player1 && nextMatch.player2 !== lastMatch.player2)) {
                    break;  // Break if match found
                }

                // If match was not valid try again
                matchesListRobin.push(nextMatch);
                nextMatch = null;
                attempts++;     
        }
    }

    if (!nextMatch)
        nextMatch = matchesListRobin.shift(); 

    if (nextMatch) {
        // Draw the next match to play
        rankingRobinCtx.font = '30px Liberty';
        rankingRobinCtx.textAlign = 'left';
        rankingRobinCtx.fillStyle = 'white';
        if (!tiebreaker)
            rankingRobinCtx.fillText("Next match: " + nextMatch.player1 + "  vs  " + nextMatch.player2, 50, 500);
        else 
            rankingRobinCtx.fillText("Next Match (t): " + nextMatch.player1 + "  vs  " + nextMatch.player2, 50, 500);
        
        // Update last match played
        lastMatch = nextMatch;
    }
}

export function assignPointsToPlayer(winner) {
    for (let i = 0; i < playerNames.length; i++) {
        if (playerList[i].name === winner)
            playerList[i].points += 3;
    }
}

function populateMatchesList(playerList) {
    matchesListRobin = [];
    for (let i = 0; i < playerList.length; i++) {
        for (let j = i + 1; j < playerList.length; j++) {
            matchesListRobin.push({player1: playerList[i].name, player2: playerList[j].name});
            console.log(playerList[i].name + " vs " + playerList[j].name);
        }
    }
    shuffleMatchesArray(matchesListRobin);
}


export function robinDraw(players) {
    
    const rankingRobinCanvas = document.getElementById("rankingRobinCanvas");
    const rankingRobinCtx = rankingRobinCanvas.getContext("2d");
    playRobinMatchButton = document.getElementById("playRobinMatchButton");
    robinBackToMenuButton = document.getElementById("robinBackToMenuButton");

    playRobinMatchButton.style.display = "block";
    rankingRobinCanvas.style.display = "block";


    if (!playerList)
        playerList = initializePlayers(players);

    playerList.sort((a, b) => b.points - a.points);
    

    // Ranking (Player name and points)
    for (var i = 0; i < playerList.length; i++) {
        rankingRobinCtx.font = '30px Liberty';
        rankingRobinCtx.fillStyle = 'white';

        // Player name
        rankingRobinCtx.textAlign = 'left';
        rankingRobinCtx.fillText(i + 1 + ". " + playerList[i].name, 50, 100 + i * 40);
        // Player points
        rankingRobinCtx.textAlign = 'right';
        rankingRobinCtx.fillText(playerList[i].points + " points", 750, 100 + i * 40);
    }

    if (firstMatch) {
        firstMatch = false;
        playerNames = players;
        populateMatchesList(playerList);
    }

    // Check next match to play
    findNextMatch(rankingRobinCtx);
}

export const addRobinRankingPageHandlers = () => {
    const playRobinMatchButton = document.getElementById('playRobinMatchButton');
    const robinBackToMenuButton = document.getElementById('robinBackToMenuButton');
    const backImageButton = document.getElementById('backImageButton');


    playRobinMatchButton?.addEventListener('click', () => {
        const players = [];
        players.push(nextMatch.player1);
        players.push(nextMatch.player2);
        sessionStorage.setItem('matchPlayers', JSON.stringify(players));
        nextMatch = null;
        navigate("/tournament/roundrobin/robinranking/game", "RoundRobin Pong Game");
    });

    robinBackToMenuButton?.addEventListener('click', () => {
        playerList = [];
        robinBackToMenuButton.style.display = "none";
        navigate("/modes", "Return to Game Mode");
    });

    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
    });
};