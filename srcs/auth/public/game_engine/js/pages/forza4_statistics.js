import { navigate } from "../main.js";

export function F4UserStats() {
    return `
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
        <div class="form__group field">
            <input type="input" class="form__field" id="f4PlayerName" placeholder="Name" name="name" autocomplete="off" required/>
            <span class="form__label text">Name</span>
            <div class="stat-button-container">
                <button id="viewf4StatsButton" class="button-style">Show Statistics</button>
                <button id="clearDataButton" class="button-style button-erase">Erase all data</button>
            </div>
        </div>
    `;
}

export function F4ShowUserStats() {
    document.getElementById('viewf4StatsButton').addEventListener('click', () => {
        const f4PlayerName = document.getElementById('f4PlayerName').value.trim();

        if (!f4PlayerName) {
            alert('Insert a Player Name!');
            return;
        }

        // Recover f4data from localStorage
        const f4data = JSON.parse(localStorage.getItem('f4_game_data')) || { players: {} };
        const f4PlayerData = f4data.players[f4PlayerName];

        const f4StatsContainer = document.getElementById('f4StatsContainer');
        f4StatsContainer.innerHTML = '';

        if (!f4PlayerData) {
            f4StatsContainer.innerHTML = `<p>Player not found.</p>`;
            return;
        }

        
        // Show Player Stats
        f4StatsContainer.innerHTML += `
            <h2>${f4PlayerName} Stats</h2>
            <p><strong>Wins: ${f4PlayerData.wins}</strong></p>
           <p><strong>Loss: ${f4PlayerData.losses}</strong></p>
           <p><strong>XP: ${f4PlayerData.xp}</strong></p>
            <p><strong>Level: ${f4PlayerData.level}</strong></p>
            <br><br>
            <canvas id="winChart" width="150" height="150"></canvas>
            <br>
            <label for="winChart" id="winChartLabel"></label>
           <br><br>
        `;
       

        // Matches History
        /*if (f4PlayerData.matches && f4PlayerData.matches.length > 0) {
            f4StatsContainer.innerHTML += `<h3>Matches History</h3>`;
            f4PlayerData.matches.forEach(match => {
                const opponent = match.player1 === f4PlayerName ? match.player2 : match.player1;

                const matchHtml = `
                    <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                        <p><strong>Match:</strong> ${match.player1} vs. ${match.player2}</p>
                        <p><strong>Score:</strong> ${match.score1} - ${match.score2}</p>
                        <p><strong>Winner:</strong> ${match.winner}</p>
                        <p><strong>Date:</strong> ${new Date(match.date).toLocaleString()}</p>
                    </div>
                `;
                f4StatsContainer.innerHTML += matchHtml;
            });
        } else {
            f4StatsContainer.innerHTML += `<p>No matches found.</p>`;
        }*/
        drawChart(f4PlayerData);
    });

     // Erase all data
     document.getElementById('clearDataButton').addEventListener('click', () => {
        const confirmDelete = confirm("Are you sure you want to delete all data?");
        if (confirmDelete) {
            localStorage.removeItem('f4_game_data');
            alert("Game data deleted successfully!");
            document.getElementById('f4StatsContainer').innerHTML = '';
        }
    });
}


function drawChart(f4PlayerData) {
    const totalGames = f4PlayerData.wins + f4PlayerData.losses;
    const winPercentage = (f4PlayerData.wins / totalGames) * 100;
    const losePercentage = 100 - winPercentage;
    
    const f4data = [winPercentage, losePercentage];
    const colors = ['#02BFB9', '#014c4a']; 
    
    const canvas = document.getElementById('winChart');
    const ctx = canvas.getContext('2d');
    const winChartLabel = document.getElementById('winChartLabel');
    
    let startAngle = 0;
    
    f4data.forEach((value, index) => {
        const sliceAngle = (value / 100) * 2 * Math.PI; 
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
