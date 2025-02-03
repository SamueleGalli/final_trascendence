import { navigate } from "../main.js";
import { userName } from "./user_data.js";

export function Forza4UserStats() {
    return `
    <div id="forza4UserStats">   
        <h1 class="text">
                <span class="letter letter-1">F</span>
                <span class="letter letter-2">o</span>
                <span class="letter letter-3">r</span>
                <span class="letter letter-4">z</span>
                <span class="letter letter-5">a</span>
                <span class="letter letter-6"> </span>
                <span class="letter letter-7"> </span>
                <span class="letter letter-8">4</span>
                <span class="letter letter-9"> </span>
                <span class="letter letter-10"> </span>
                <span class="letter letter-11">U</span>
                <span class="letter letter-12">s</span>
                <span class="letter letter-13">e</span>
                <span class="letter letter-14">r</span>
                <span class="letter letter-15"> </span>
                <span class="letter letter-16"> </span>
                <span class="letter letter-17">S</span>
                <span class="letter letter-18">t</span>
                <span class="letter letter-19">a</span>
                <span class="letter letter-20">t</span>
                <span class="letter letter-21">i</span>
                <span class="letter letter-22">s</span>
                <span class="letter letter-23">t</span>
                <span class="letter letter-24">i</span>
                <span class="letter letter-25">c</span>
                <span class="letter letter-26">s</span>
            </h1>
         <div id="forza4StatsContainer">
                <p>Total matches played: <span id="totalMatches"></span></p>
                <p>Wins: <span id="totalWins"></span></p>
                <p>Losses: <span id="totalLosses"></span></p>
                <p>Ties: <span id="totalTies"></span></p>
                <p>Victory Rate: <span id="victoryRate"></span></p>
                <p>Average Player Moves: <span id="averageMoves"></span></p>
                <p>Average Match Time: <span id="averageTime"></span></p>
        </div>
       
            
        <div class="avatar-container">
            <img id="backImageButton" src="game_engine/images/home.png" alt="Back" class="back-button">
        </div>
    </div>
     <button id="f4StatsBackToMenuButton" class="button-style">Back to Menu</button>
     <button id="f4ShowMatchSatisticsButton" class="button-style">Match Statistics</button>
    <style>
        #forza4UserStats {
        text-align: center;
        font-family: 'Liberty', sans-serif;
        color: #fff;
        padding: 30px;
        }

        #forza4StatsContainer p {
            font-size: 40px;
            margin: 5px 0;
        }
    </style>
    `;
}

function forza4CalculateUserStatistics(name) {

    console.log("player name is " +name);
    const f4data = JSON.parse(localStorage.getItem('f4_game_data')) || { players: {} };
    const playerData = f4data.players[name];

    if (!playerData) {
        return null; // Se il giocatore non ha dati, restituisci null
    }

    const totalMatches = playerData.wins + playerData.losses + playerData.tie;
    const totalWins = playerData.wins || 0;
    const totalLosses = playerData.losses || 0;
    const totalTies = playerData.tie || 0;

    // Calcola la vittoria rate (percentuale di vittorie)
    const victoryRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(2) + "%" : "0%";

    // Calcola la media delle mosse per partita
    const averageMoves = totalMatches > 0 ? (playerData.moves / totalMatches).toFixed(2) : 0;

    // Calcola la media del tempo di gioco per partita
    let totalTime = 0;
    if (playerData.matches && playerData.matches.length > 0) {
        
        for (const match of playerData.matches) {
            console.log("match seconds = " +match.seconds);
            totalTime += match.seconds;
        }
    }
    console.log("total time = " +totalTime);
    const averageTime = totalMatches > 0 ? (totalTime / totalMatches).toFixed(2) + " seconds" : "0 seconds";
    console.log("average time = " + averageTime);

    return {
        totalMatches,
        totalWins,
        totalLosses,
        totalTies,
        victoryRate,
        averageMoves,
        averageTime,
    };
}


export function forza4ShowUserStatistics() {
    const stats = forza4CalculateUserStatistics(userName);

    if (!stats) {
        alert("No statistics available for this player.");
        return;
    }

    // Popola il template con i dati
    document.getElementById('totalMatches').textContent = stats.totalMatches;
    document.getElementById('totalWins').textContent = stats.totalWins;
    document.getElementById('totalLosses').textContent = stats.totalLosses;
    document.getElementById('totalTies').textContent = stats.totalTies;
    document.getElementById('victoryRate').textContent = stats.victoryRate;
    document.getElementById('averageMoves').textContent = stats.averageMoves;
    document.getElementById('averageTime').textContent = stats.averageTime;

  
}

export function addForza4StatsPageHandlers() {
    const forza4StatsBackToMenuButton = document.getElementById('f4StatsBackToMenuButton');
    const forza4ShowMatchSatisticsButton = document.getElementById('f4ShowMatchSatisticsButton');
      
      
    forza4StatsBackToMenuButton?.addEventListener('click', () => {
        navigate("/forza4", "Forza 4 Home");
    });

    forza4ShowMatchSatisticsButton?.addEventListener('click', () => {
        navigate("/forza4/userstats/matchstats", "Match Statistics");
    });


}
