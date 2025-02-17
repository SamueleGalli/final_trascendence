import { navigate } from "../../main.js";
import { userName } from "../user_data.js";
import { current_user, change_name, update_image} from "../modes.js";

export function Forza4UserStats() {
    return `
        <img id="backImageButton" src="../game_engine/images/home.png" alt="Back" class="back-button">
        <h1 class="text h1_margin">
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
            <span class="letter letter-11">S</span>
            <span class="letter letter-12">t</span>
            <span class="letter letter-13">a</span>
            <span class="letter letter-14">t</span>
            <span class="letter letter-15">i</span>
            <span class="letter letter-16">s</span>
            <span class="letter letter-17">t</span>
            <span class="letter letter-18">i</span>
            <span class="letter letter-19">c</span>
            <span class="letter letter-20">s</span>
        </h1>
        <div id="forza4UserStats">
            <div class="stats-switcher">
                <button id="showGeneralStats" class="button-style active">General Statistics</button>
                <button id="showMatchHistory" class="button-style">Match History</button>
            </div>
            <div class="stats-content-container">
                <div class="stats-card visible" id="generalStatsSection">
                    <dl class="stats-grid">
                        <div class="stat-item">
                            <dt>Total matches played:</dt>
                            <dd id="totalMatches" aria-live="polite">-</dd>
                        </div>
                        <div class="stat-item">
                            <dt>Wins:</dt>
                            <dd id="totalWins" aria-live="polite">-</dd>
                        </div>
                        <div class="stat-item">
                            <dt>Losses:</dt>
                            <dd id="totalLosses" aria-live="polite">-</dd>
                        </div>
                        <div class="stat-item">
                            <dt>Ties:</dt>
                            <dd id="totalTies" aria-live="polite">-</dd>
                        </div>
                        <div class="stat-item">
                            <dt>Victory Rate:</dt>
                            <dd id="victoryRate" aria-live="polite">-</dd>
                        </div>
                        <div class="stat-item">
                            <dt>Average Moves:</dt>
                            <dd id="averageMoves" aria-live="polite">-</dd>
                        </div>
                        <div class="stat-item">
                            <dt>Average Time:</dt>
                            <dd id="averageTime" aria-live="polite"><time datetime="PT0M0S">-</time></dd>
                        </div>
                    </dl>
                </div>
                <div id="f4MatchDetailsContainer" class="hidden1">

                </div>
            </div>
        </div>
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
    const backImageButton = document.getElementById('backImageButton');
    const generalStatsBtn = document.getElementById('showGeneralStats');
    const matchHistoryBtn = document.getElementById('showMatchHistory');

    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
    });

    generalStatsBtn?.addEventListener('click', () => {
        document.getElementById('generalStatsSection').classList.remove('hidden1');
        document.getElementById('f4MatchDetailsContainer').classList.add('hidden1');
        generalStatsBtn.classList.add('active');
        matchHistoryBtn.classList.remove('active');
    });

    matchHistoryBtn?.addEventListener('click', () => {
        document.getElementById('generalStatsSection').classList.add('hidden1');
        document.getElementById('f4MatchDetailsContainer').classList.remove('hidden1');
        forza4ShowMatchDetails(); // Загружаем историю матчей при первом клике
        matchHistoryBtn.classList.add('active');
        generalStatsBtn.classList.remove('active');
    });
}

export function forza4ShowMatchDetails() {
    const f4MatchDetailsContainer = document.getElementById("f4MatchDetailsContainer");
    f4MatchDetailsContainer.innerHTML = "";
    const playerName = userName;
    const f4data = JSON.parse(localStorage.getItem('f4_game_data')) || { players: {} };
    const playerData = f4data.players[playerName];

    if (playerData.matches && playerData.matches.length > 0) {
        playerData.matches.forEach(match => {
            const opponent = match.player1 === playerName ? match.player2 : match.player1;
            const isWinner = match.winner === playerName;
            const resultText = isWinner ? "Victory" : "Defeat";
            const resultClass = isWinner ? "win" : "loss";
            const matchDate = new Date(match.date).toLocaleDateString();

            const matchHtml = `
                <div class="match-card collapsed">
                    <div class="match-summary ${resultClass}">
                        <div class="players">${playerName} vs ${opponent}</div>
                        <div class="match-info">
                            <span class="result">${resultText}</span>
                            <span class="date">${matchDate}</span>
                        </div>
                    </div>
                    <div class="match-details">
                        <div class="detail-item">
                            <span>Moves:</span>
                            <span>${match.moves}</span>
                        </div>
                        <div class="detail-item">
                            <span>Duration:</span>
                            <span>${match.matchTime}</span>
                        </div>
                        <div class="detail-item">
                            <span>Match ended:</span>
                            <span>${new Date(match.date).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
            f4MatchDetailsContainer.innerHTML += matchHtml;
        });

        document.querySelectorAll('.match-card').forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('collapsed');
            });
        });
    } 
    else
    {
        f4MatchDetailsContainer.innerHTML = `<p class="no-matches">No matches found</p>`;
    }
}