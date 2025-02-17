import { navigate } from "../../main.js";
import { userName } from "../user_data.js";
import { current_user, change_name, update_image} from "../modes.js";
let data;
let playerName;

export function Charts() {
    return `
        <img id="backImageButton" src="../game_engine/images/home.png" alt="Back" class="back-button">
        <div class="charts-page">
            <div id="noMatchesMessage" class="no-matches-message">
                <h2>No matches played</h2>
            </div>
            <div class="charts-container">
                <div class="chart-item"><canvas id="matchLongestRallyChart"></canvas></div>
                <div class="chart-item"><canvas id="winLossChart"></canvas></div>
                <div class="chart-item"><h2>Matches Played</h2><h1 id="matchesPlayed"></h1><h2>Average Match Duration</h2><h1 id="avgMatchTime"></h1></div>
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
        <style>
        .charts-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            padding: 20px;
        }

        .no-matches-message {
            display: none; /* Inizialmente nascosto */
            color: white;
            text-align: center;
            font-size: 24px;
            margin-top: 20px;
        }

        .charts-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
        }

        .chart-item {
            width: 40vw;
            height: 30vh;
            min-width: 300px;
            min-height: 200px;
        }

        canvas {
            width: 100% !important;
            height: 100% !important;
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
    data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };
    const playerData = data.players[playerName];

    const noMatchesMessage = document.getElementById('noMatchesMessage');
    const chartsContainer = document.querySelector('.charts-container');
    const chartsButtonContainer = document.querySelector('.charts-button-container');

    if (!playerData || !playerData.matches || playerData.matches.length === 0) {
        noMatchesMessage.style.display = 'block'; // Mostra il messaggio
        chartsContainer.style.display = 'none'; // Nascondi i grafici
        chartsButtonContainer.style.display = 'none'; // Nascondi i pulsanti
        return;
    }

    noMatchesMessage.style.display = 'none'; // Nascondi il messaggio
    chartsContainer.style.display = 'flex'; // Mostra i grafici
    chartsButtonContainer.style.display = 'block'; // Mostra i pulsanti

    let matchesData = getLastMatchesData();
    drawRalliesChart(matchesData);
    drawWinLossChart();
    matchesPlayedAndAvgTime(matchesData);
    drawXpProgressChart(matchesData);
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