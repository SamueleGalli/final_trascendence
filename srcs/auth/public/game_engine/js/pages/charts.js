import { navigate } from "../main.js";
import { userName } from "./user_data.js";

let data;
let playerName;

export function Charts() {
    return `
    <div class="charts-container">
        <div class="chart-item"><canvas id="matchLongestRallyChart"></canvas></div>
        <div class="chart-item"><canvas id="winLossChart"></canvas></div>
        <div class="chart-item"><h2>Matches Played</h2><h1 id="matchesPlayed"></h1><h2>Average Match Duration</h2><h1 id="avgMatchTime"></h1></div>
        <div class="chart-item"><canvas id="xpProgressChart"></canvas></div>
    </div>
    <div class="charts-button-container"
            <div class="mode-button-container">
                <button class="button-style" id="matchDetailsButton"><span class="text-animation">Match Details</span></button>
            </div>
            <div class="mode-button-container">
                <button class="button-style" id="chartsBackMenuButton"><span class="text-animation">Back to Menu</span></button>
            </div>
    </div>
   <style>
    .charts-container {
        display: flex;
        flex-wrap: wrap; /* Permette di disporre i grafici su più righe */
        justify-content: center; /* Centra i grafici */
        gap: 20px; /* Spaziatura uniforme tra i grafici */
        padding: 20px;
    }

    .chart-item {
        width: 40vw; /* Ogni grafico occuperà il 40% della larghezza della finestra */
        height: 30vh; /* Ogni grafico occuperà il 30% dell'altezza della finestra */
        min-width: 300px; /* Larghezza minima per evitare dimensioni troppo piccole */
        min-height: 200px; /* Altezza minima per evitare dimensioni troppo piccole */
    }

    canvas {
        width: 100% !important; /* Adatta il canvas al contenitore */
        height: 100% !important; /* Adatta il canvas al contenitore */
    }

    h2 {
        color: white;
        text-align: center;
    }

    h1 {
        color: white;
        text-align: center;
    }
    </style>

    `;
}

function getLastMatchesData() {

   
    data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };
    const playerData = data.players[playerName];


    console.log(playerData);
    const lastMatchesData = playerData.matches.slice(-10);
    
    
    return lastMatchesData;
}

function drawRalliesChart(matchesData)
{
    const longestRallies = matchesData.map(match => match.longestRally);
    const opponents = matchesData.map (match => match.player1 === playerName ? match.player2 : match.player1);

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
    const winLossCtx = document.getElementById('winLossChart').getContext('2d');
    const winLossData = {
        labels: ['Win', 'Loss'],
        datasets: [{
            data: [data.players[playerName].wins, data.players[playerName].losses], // Numero di vittorie e sconfitte
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

function drawXpProgressChart(matchesData) {
    const xpProgressCtx = document.getElementById('xpProgressChart').getContext('2d');
    const opponents = matchesData.map (match => match.player1 === playerName ? match.player2 : match.player1);


    const xpProgressData = {
        labels: opponents, // Giorni o sessioni
        datasets: [{
            label: 'Xp Points Total',
            data: data.players[playerName].xpHistory, // Punti esperienza cumulativi
            borderColor: '#02BFB9',
            backgroundColor: '#014C4A',
            fill: true,
            tension: 0 // Smoothing della linea
        }]
    };
    new Chart(xpProgressCtx, {
        type: 'line',
        data: xpProgressData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Xp Points Progression' }
            },
            scales: {
                x: { title: { display: true, text: 'Opponent' } },
                y: { title: { display: true, text: 'Xp Points' } }
            }
        }
    });
}

function formatTimeSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function matchesPlayedAndAvgTime() {
    const matchesPlayed = data.players[playerName].wins + data.players[playerName].losses;
    const matchesPlayedLabel = document.getElementById('matchesPlayed');
    const avgMatchTimeLabel = document.getElementById('avgMatchTime');
    let totalSeconds = 0;
    matchesPlayedLabel.textContent = matchesPlayed;
    const playerData = data.players[playerName];
    playerData.matches.forEach(match => {
        totalSeconds += match.matchTime;
    })
    const totalTime = formatTimeSeconds(totalSeconds / matchesPlayed);
    avgMatchTimeLabel.textContent = totalTime;
}

export function showCharts() {

    playerName = userName;
    //console.log("player nome chart = "+playerName);
    let matchesData;

    matchesData = getLastMatchesData();

    drawRalliesChart(matchesData);
    drawWinLossChart();
    matchesPlayedAndAvgTime(matchesData);
    drawXpProgressChart(matchesData);
    
}

export const addChartsPageHandlers = () => {
    const matchDetailsButton = document.getElementById('matchDetailsButton');
    const chartsBackMenuButton = document.getElementById('chartsBackMenuButton');

    matchDetailsButton?.addEventListener('click', () => {
         navigate("/tournament/userstats/matchdetails", "Match Details");
    });
    chartsBackMenuButton?.addEventListener('click', () => {
       navigate("/tournament", "Back to Tournament Menu");
    });
};