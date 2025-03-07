import { navigate } from "../../main.js";
import { userName } from "../user_data.js";
import { formatTime } from "../../game/pong/other/timer.js";
import { current_user, change_name, update_image} from "../modes.js";

let data;
let playerName;
let userData;
let wins = 0;
let losses = 0;

export function Charts() {
    return `
        <img id="backImageButton" src="../website/images/home.png" alt="Back" class="back-button">
        <h1 class="text h1_margin">
            <span class="letter letter-1">P</span>
            <span class="letter letter-2">o</span>
            <span class="letter letter-3">n</span>
            <span class="letter letter-4">g</span>
            <span class="letter letter-5"> </span>
            <span class="letter letter-6"> </span>
            <span class="letter letter-7">S</span>
            <span class="letter letter-8">t</span>
            <span class="letter letter-9">a</span>
            <span class="letter letter-10">t</span>
            <span class="letter letter-11">i</span>
            <span class="letter letter-12">s</span>
            <span class="letter letter-13">t</span>
            <span class="letter letter-14">i</span>
            <span class="letter letter-15">c</span>
            <span class="letter letter-16">s</span>
        </h1>
        <div class="charts-page">
            <div id="noMatchesMessage" class="no-matches-message">
                <h2>No matches played</h2>
            </div>
            <div class="charts-container">
                <div class="chart-item"><canvas id="matchLongestRallyChart"></canvas></div>
                <div class="chart-item"><canvas id="winLossChart"></canvas></div>
                <div class="chart-item">
                    <h2>Matches Played</h2>
                    <h1 id="matchesPlayed"></h1>
                    <h2>Average Match Duration</h2>
                    <h1 id="avgMatchTime"></h1>
                    <h2>Points</h2>
                    <h1 id="points"></h1>
                </div>
                <div class="chart-item"><canvas id="xpProgressChart"></canvas></div>
            </div>
            <div class="charts-button-container">
                <div class="mode-button-container">
                    <button class="button-style" id="matchDetailsButton"><span class="text-animation">Match Details</span></button>
                </div>
                <div class="mode-button-container">
                    <button class="button-style" id="chartsBackMenuButton"><span class="text-animation">Back to Menu</span></button>
                </div>
            </div>
        </div>
        <div id="pongMatchDetailsContainer" class="hidden1">
        </div>
    `;
}

// function getLastMatchesData() {
    
//     data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };
//     const playerData = data.players[playerName];


//     console.log(playerData);
//     const lastMatchesData = playerData.matches.slice(-10);
    
    
//     return lastMatchesData;
// }

function drawRalliesChart(matchesData)
{
    const longestRallies = matchesData.map(match => match.longest_rally);
    const opponents = matchesData.map (match => match.player1 === userName ? match.player2 : match.player1);

    const ralliesCtx = document.getElementById('matchLongestRallyChart').getContext('2d');
    const ralliesData = {
        labels: opponents,
        datasets: [{
            label: 'Longest Rallies',
            data: longestRallies,
            backgroundColor: '#02BFB9'
        }]
    };
    new Chart(ralliesCtx, {
        type: 'bar',
        data: ralliesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Longest Rallies' }
            },
            scales: {
                x: { title: { display: true, text: 'Opponents' } },
                y: { title: { display: true, text: 'Max Hits' } }
            }
        }
    });
}

function drawWinLossChart() {
    wins = 0;
    losses = 0;
    userData.forEach(game => {
    // Verifica che la partita coinvolga l'utente
    if (game.player1 === userName || game.player2 === userName) {
        if (game.winner === userName) {
            wins++;
        } else { // Se la partita non è un pareggio
            losses++;
        }
    }
    });

    const winLossCtx = document.getElementById('winLossChart').getContext('2d');
    const winLossData = {
        labels: ['Win', 'Loss'],
        datasets: [{
            data: [wins, losses], // Numero di vittorie e sconfitte
            backgroundColor: ['#02BFB9', '#014C4A']
        }]
    };
    new Chart(winLossCtx, {
        type: 'pie',
        data: winLossData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Win/Loss Ratio' }
            }
        }
    });
}

function drawWinLossHistoryChart(matchesData) {
    const ctx = document.getElementById('xpProgressChart').getContext('2d');
  
    // Inizializza array per le etichette (es. "Match 1", "Match 2", ecc.) e la progressione cumulativa
    const labels = [];
    const progression = [];
    let cumulativeScore = 0;
  
    // Per ogni match, aggiorna il punteggio cumulativo in base al risultato
    matchesData.forEach((match, index) => {
      // Costruisci l'etichetta per il match (ad esempio "Match 1", "Match 2", ...)
      labels.push("Match " + (index + 1));
      
      // Se il giocatore corrente (playerName) ha vinto, incrementa il punteggio;
      // se ha perso, lo decrementa; in caso di pareggio, non cambia.
      if (match.winner === userName) {
        cumulativeScore += 1;
      } else if (match.winner !== 'tie') {
        cumulativeScore -= 1;
      }
      progression.push(cumulativeScore);
    });
  
    // Configura i dati per il grafico
    const winLossData = {
      labels: labels, // Ad esempio "Match 1", "Match 2", ...
      datasets: [{
        label: 'Win/Loss Progression',
        data: progression, // Punteggio cumulativo per ogni match
        borderColor: '#02BFB9',
        backgroundColor: '#014C4A',
        fill: false,
        tension: 0 // Linea dritta
      }]
    };
  
    // Crea il grafico a linee
    new Chart(ctx, {
      type: 'line',
      data: winLossData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Win/Loss Progression' }
        },
        scales: {
          x: { title: { display: true, text: 'Matches' } },
          y: { title: { display: true, text: 'Cumulative Score' } }
        }
      }
    });
  }
  


function matchesTimeRank() {
    const matchesPlayed = wins + losses;
    const matchesPlayedLabel = document.getElementById('matchesPlayed');
    const avgMatchTimeLabel = document.getElementById('avgMatchTime');
    const pointsLabel = document.getElementById('points');

    let totalSeconds = 0;
    matchesPlayedLabel.textContent = matchesPlayed;
    //const playerData = data.players[playerName];
    userData.forEach(match => {
        totalSeconds += Number(match.begin_time);
    })
    console.log("total seconds = " +totalSeconds);
    const totalTime = formatTime(totalSeconds / matchesPlayed);
    avgMatchTimeLabel.textContent = totalTime;
    const totalMatches = wins + losses;
    const victoryRate = wins / (totalMatches) * 100;

    const rankPoints = totalMatches + (wins * 10) - (losses * 5);
    if (rankPoints < 0)
        rankPoints = 0;
    pointsLabel.textContent = rankPoints;
}

export async function showCharts() {
    //playerName = userName;

    try {
        const response = await fetch("http://localhost:8008", {
          method: "get_pong_games",
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


    // data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };
    // const playerData = data.players[playerName];

    const noMatchesMessage = document.getElementById('noMatchesMessage');
    const chartsContainer = document.querySelector('.charts-container');
    const chartsButtonContainer = document.querySelector('.charts-button-container');

    if (!userData || userData.length === 0) {
        noMatchesMessage.style.display = 'block'; // Mostra il messaggio
        chartsContainer.style.display = 'none'; // Nascondi i grafici
        chartsButtonContainer.style.display = 'none'; // Nascondi i pulsanti
        return;
    }

    noMatchesMessage.style.display = 'none'; // Nascondi il messaggio
    chartsContainer.style.display = 'flex'; // Mostra i grafici
    chartsButtonContainer.style.display = 'block'; // Mostra i pulsanti

    let lastMatchesData = userData.slice(-10);

    Chart.defaults.color = "#ffffff";
    Chart.defaults.borderColor = "#ffffff";
    Chart.defaults.font.size = 16; 

    drawRalliesChart(lastMatchesData);
    drawWinLossChart();
    matchesTimeRank(lastMatchesData);
    drawWinLossHistoryChart(lastMatchesData);
    // drawXpProgressChart(lastMatchesData);
}

export const addChartsPageHandlers = () => {
    const matchDetailsButton = document.getElementById('matchDetailsButton');
    const chartsBackMenuButton = document.getElementById('chartsBackMenuButton');
    const backImageButton = document.getElementById('backImageButton');

    matchDetailsButton?.addEventListener('click', () => {
        navigate("/tournament/userstats/matchdetails", "Match Details");
    });
    
    chartsBackMenuButton?.addEventListener('click', () => {
        navigate("/tournament", "Back to Tournament Menu");
    });

    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
    });
};