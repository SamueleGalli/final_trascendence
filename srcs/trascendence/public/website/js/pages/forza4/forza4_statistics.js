import { navigate } from "../../main.js";
import { userName } from "../user_data.js";
import { formatTime } from "../../game/pong/other/timer.js";
import { current_user, change_name, update_image } from "../modes.js";

let wins = 0;
let losses = 0;
let ties = 0;
let userData;

export function Forza4UserStats() {
    return `
        <img id="backImageButton" src="../website/images/home.png" alt="Back" class="back-button">
        <h1 class="text h1_margin">
            <span class="letter letter-1">F</span>
            <span class="letter letter-2">o</span>
            <span class="letter letter-3">r</span>
            <span class="letter letter-4">z</span>
            <span class="letter letter-5">a</span>
            <span class="letter letter-6">4</span>
            <span class="letter letter-7"> </span>
            <span class="letter letter-8">S</span>
            <span class="letter letter-9">t</span>
            <span class="letter letter-10">a</span>
            <span class="letter letter-11">t</span>
            <span class="letter letter-12">i</span>
            <span class="letter letter-13">s</span>
            <span class="letter letter-14">t</span>
            <span class="letter letter-15">i</span>
            <span class="letter letter-16">c</span>
            <span class="letter letter-17">s</span>
        </h1>
        <div id="forza4UserStats">
            <div class="stats-switcher">
                <button id="showGeneralStats" class="button-style active">Forza4</button>
                <button id="showPingPongStats" class="button-style">Ping Pong</button>
                <button id="showMatchHistory" class="button-style">Match History</button>
            </div>
            <div class="stats-content-container">
                <!-- Sezione statistiche Forza4 -->
                <div class="stats-card visible" id="forza4StatsSection">
                    <dl class="stats-grid">
                        <div class="stat-item">
                            <dt>Total matches played:</dt>
                            <dd id="totalMatches" aria-live="polite">-</dd>
                        </div>
                         <div class="stat-item">
                            <dt>Points:</dt>
                            <dd id="points" aria-live="polite">-</dd>
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
                <!-- Sezione test per Ping Pong -->
                <div class="stats-card hidden1" id="pingPongTestSection">
                    <div class="stat-item">
                            <dt>Testo field</dt>
                            <dd id="totalMatches" aria-live="polite">-</dd>
                    </div>
                </div>
                <!-- Sezione Match History -->
                <div id="f4MatchDetailsContainer" class="hidden1">
                    <!-- I dettagli delle partite verranno inseriti qui -->
                </div>
            </div>
        </div>
    `;
}

async function forza4CalculateUserStatistics() {

    let totalMoves;
    let totalTime;
    wins = 0;
    losses = 0;
    ties = 0;


     try {
            const response = await fetch("http://localhost:8008", {
              method: "get_f4_games",
              body: JSON.stringify({
                realname: userName,
              }),
            });
            const data = await response.json();
            console.log("Get Pong Game response: ", data);
            if (data.games) {
              userData = data.games;
              console.log("userData aggiornata: ", userData);
              // Ora puoi richiamare altre funzioni che usano userData qui dentro
            }
          } catch (error) {
            console.error("Fetch error:", error);
          }

    if (!userData) {
        return null; // Se il giocatore non ha dati, restituisci null
    }
      totalMoves = 0;
      totalTime = 0;
      userData.forEach(game => {
        // Verifica che la partita coinvolga l'utente
        if (game.player1 === userName || game.player2 === userName) {
            if (game.winner === userName)
                wins++;
            else if (game.winner === 'tie') 
                ties++;
            else
                losses++;
            totalMoves += Number(game.moves);
            totalTime += Number(game.begin_time);
        }
    });
    const totalMatches = wins + losses + ties;
    const totalWins = wins || 0;
    const totalLosses = losses || 0;
    const totalTies = ties || 0;

    // Calcola la vittoria rate (percentuale di vittorie)
    const victoryRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(2) : 0;

    const rankPoints = totalMatches + (totalWins * 10) - (totalLosses * 5);
    if (rankPoints < 0)
        rankPoints = 0;

    // Calcola la media delle mosse per partita
    const averageMoves = totalMatches > 0 ? (totalMoves / totalMatches).toFixed(1) : 0;


    
    console.log("total time = " +totalTime);
    const averageTime = totalMatches > 0 ? (totalTime / totalMatches).toFixed(2) : 0;
    console.log("average time = " + averageTime);

    return {
        totalMatches,
        totalWins,
        totalLosses,
        totalTies,
        victoryRate,
        rankPoints,
        averageMoves,
        averageTime,
    };
}


export async function forza4ShowUserStatistics() {
    const stats = await forza4CalculateUserStatistics();

    if (!stats) {
        alert("No statistics available for this player.");
        return;
    }

    console.log("stats total matches" + stats.totalMatches);

    // Popola il template con i dati
    document.getElementById('totalMatches').textContent = stats.totalMatches;
    document.getElementById('totalWins').textContent = stats.totalWins;
    document.getElementById('totalLosses').textContent = stats.totalLosses;
    document.getElementById('totalTies').textContent = stats.totalTies;
    document.getElementById('victoryRate').textContent = stats.victoryRate + '%';
    document.getElementById('averageMoves').textContent = stats.averageMoves;
    document.getElementById('averageTime').textContent = formatTime(stats.averageTime);
    document.getElementById('points').textContent = stats.rankPoints; 

}

export function addForza4StatsPageHandlers() {
    const backImageButton = document.getElementById('backImageButton');
    const generalStatsBtn = document.getElementById('showGeneralStats');
    const pingPongBtn = document.getElementById('showPingPongStats');
    const matchHistoryBtn = document.getElementById('showMatchHistory');

    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
    });

    generalStatsBtn?.addEventListener('click', () => {
        document.getElementById('forza4StatsSection').classList.remove('hidden1');
        document.getElementById('pingPongTestSection').classList.add('hidden1');
        document.getElementById('f4MatchDetailsContainer').classList.add('hidden1');

        generalStatsBtn.classList.add('active');
        pingPongBtn.classList.remove('active');
        matchHistoryBtn.classList.remove('active');

        forza4ShowUserStatistics();
    });

    pingPongBtn?.addEventListener('click', () => {
        document.getElementById('forza4StatsSection').classList.add('hidden1');
        document.getElementById('pingPongTestSection').classList.remove('hidden1');
        document.getElementById('f4MatchDetailsContainer').classList.add('hidden1');

        pingPongBtn.classList.add('active');
        generalStatsBtn.classList.remove('active');
        matchHistoryBtn.classList.remove('active');

        // Al momento non serve logica specifica per Ping Pong; il test field basta per verificare il cambio finestra
    });

    matchHistoryBtn?.addEventListener('click', () => {
        document.getElementById('forza4StatsSection').classList.add('hidden1');
        document.getElementById('pingPongTestSection').classList.add('hidden1');
        document.getElementById('f4MatchDetailsContainer').classList.remove('hidden1');

        matchHistoryBtn.classList.add('active');
        generalStatsBtn.classList.remove('active');
        pingPongBtn.classList.remove('active');

        forza4ShowMatchDetails();
    });
}

export function forza4ShowMatchDetails() {
    const f4MatchDetailsContainer = document.getElementById("f4MatchDetailsContainer");
    
    f4MatchDetailsContainer.innerHTML = "";
    

    if (userData && userData.length > 0) {
        userData.forEach(match => {
            const opponent = match.player1 === userName ? match.player2 : match.player1;
            const isWinner = match.winner === userName;
            let resultText;
            let resultClass;

            let isTie = false;
            if (match.winner === 'tie')
            {
                isTie = true;
                resultText = "Tie";
                resultClass = "tie";
            }
            else
            {
                resultText = isWinner ? "Victory" : "Defeat";
                resultClass = isWinner ? "win" : "loss";
            }
         
            const matchTime = formatTime(match.begin_time);
            //const matchDate = new Date(match.date).toLocaleDateString();

            const matchHtml = `
                <div class="match-card collapsed">
                    <div class="match-summary ${resultClass}">
                        <div class="players">${userName} vs ${opponent}</div>
                        <div class="match-info">
                            <span class="result">${resultText}</span>
                        </div>
                    </div>
                    <div class="match-details">
                        <div class="detail-item">
                            <span>Moves:</span>
                            <span>${match.moves}</span>
                        </div>
                        <div class="detail-item">
                            <span>Duration:</span>
                            <span>${matchTime}</span>
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
    } else {
        f4MatchDetailsContainer.innerHTML = `<p class="no-matches">No matches found</p>`;
    }
}