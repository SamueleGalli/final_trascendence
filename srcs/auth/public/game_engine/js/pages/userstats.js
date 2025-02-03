export default function Userstats() {
    return `
        <h1 class="text text-userstats">
            <span class="letter letter-1">U</span>
            <span class="letter letter-2">s</span>
            <span class="letter letter-3">e</span>
            <span class="letter letter-4">r</span>
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
        <div class="form__group field">
            <input type="input" class="form__field" placeholder="Name" name="name" id="name" autocomplete="off" required />
            <span class="form__label text">Name</span>
            <div class="stat-button-container">
                <button class="button-style" id="viewStatsButton">Show Statistics</button>
                <button class="button-style button-erase" id="clearDataButton">Erase user data</button>
            </div>
        </div>
    `;
}

export function showUserStats() {
    document.getElementById('viewStatsButton').addEventListener('click', () => {
        const playerName = document.getElementById('playerName').value.trim();

        if (!playerName) {
            alert('Insert a Player Name!');
            return;
        }

        // Recover data from localStorage
        const data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };
        const playerData = data.players[playerName];

        const statsContainer = document.getElementById('statsContainer');
        statsContainer.innerHTML = '';

        if (!playerData) {
            statsContainer.innerHTML = `<p>Player not found.</p>`;
            return;
        }

        
        // Show Player Stats
        statsContainer.innerHTML += `
            <h2>${playerName} Stats</h2>
            <p><strong>Wins: ${playerData.wins}</strong></p>
            <p><strong>Loss: ${playerData.losses}</strong></p>
            <p><strong>XP: ${playerData.xp}</strong></p>
            <p><strong>Level: ${playerData.level}</strong></p>
            <br><br>
            <canvas id="winChart" width="150" height="150"></canvas>
            <br>
            <label for="winChart" id="winChartLabel"></label>
            <br><br>
        `;

        // Matches History
        if (playerData.matches && playerData.matches.length > 0) {
            statsContainer.innerHTML += `<h3>Matches History</h3>`;
            playerData.matches.forEach(match => {
                const opponent = match.player1 === playerName ? match.player2 : match.player1;

                const matchHtml = `
                    <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                        <p><strong>Match:</strong> ${match.player1} vs. ${match.player2}</p>
                        <p><strong>Score:</strong> ${match.score1} - ${match.score2}</p>
                        <p><strong>Winner:</strong> ${match.winner}</p>
                        <p><strong>Date:</strong> ${new Date(match.date).toLocaleString()}</p>
                    </div>
                `;
                statsContainer.innerHTML += matchHtml;
            });
        } else {
            statsContainer.innerHTML += `<p>No matches found.</p>`;
        }
        drawChart(playerData);
    });

     // Erase all data
     document.getElementById('clearDataButton').addEventListener('click', () => {
        const confirmDelete = confirm("Are you sure you want to delete all data?");
        if (confirmDelete) {
            localStorage.removeItem('game_data');
            alert("Game data deleted successfully!");
            document.getElementById('statsContainer').innerHTML = '';
        }
    });
}


function drawChart(playerData) {
    const totalGames = playerData.wins + playerData.losses;
    const winPercentage = (playerData.wins / totalGames) * 100;
    const losePercentage = 100 - winPercentage;
    
    const data = [winPercentage, losePercentage];
    const colors = ['#02BFB9', '#014c4a']; // Verde per vittorie, rosso per sconfitte
    
    const canvas = document.getElementById('winChart');
    const ctx = canvas.getContext('2d');
    const winChartLabel = document.getElementById('winChartLabel');
    
    let startAngle = 0;
    
    data.forEach((value, index) => {
        const sliceAngle = (value / 100) * 2 * Math.PI; // Angolo proporzionale
        const endAngle = startAngle + sliceAngle;
    
        // Disegna il segmento
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2); // Centro del grafico
        ctx.arc(
            canvas.width / 2, 
            canvas.height / 2, 
            Math.min(canvas.width, canvas.height) / 2, 
            startAngle, 
            endAngle
        );
        ctx.closePath();
        ctx.fillStyle = colors[index]; // Colore del segmento
        ctx.fill();
    
        // Passa al prossimo segmento
        startAngle = endAngle;
    });
    
    winChartLabel.innerHTML = `<strong>Victory Rate: ${winPercentage.toFixed(1)}%</strong>`;

}