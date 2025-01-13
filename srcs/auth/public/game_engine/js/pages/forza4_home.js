import { navigate } from "../main.js";


export function Forza4Home() {
    const html = `
    <div id="forza4Home">
        <h1 style="color: #fff;">Forza 4 Game</h1>
        <br>
        <h2 style="color: #fff;">Insert Player Names</h2>
        <input type="text" id="player1Name" placeholder="Player 1" autocomplete="off"/>
        <input type="text" id="player2Name" placeholder="Player 2" autocomplete="off"/>
        <br><br>
        <button id="forza4PlayButton">Play Forza 4</button>
        <button id="forza4CustomizeButton">Customize</button>
        <button id="forza4StatsButton">Forza 4 Statistics</button>
    </div>
    `;
    return html;
}


export function showForza4HomeScreen() {
    const forza4PlayButton = document.getElementById('forza4PlayButton');
    const forza4CustomizeButton = document.getElementById('forza4CustomizeButton');
    const forza4StatsButton = document.getElementById('forza4StatsButton');
    
    forza4PlayButton.addEventListener('click', () => {
        const players = [];
        let allNamesFilled = true;
        
        for (let i = 1; i <= 2; i++) {

            const playerInput = document.getElementById('player' + i + 'Name');
            const playerName = playerInput.value;

            if (playerName) {
                players.push(playerName);
            } 
            else {
                allNamesFilled = false;
                break;
            }
        }

        if (!allNamesFilled) {
            alert('Please fill in all player names.');
            return;
        } 
        else {
            localStorage.removeItem('forza4players');
            sessionStorage.setItem('forza4players', JSON.stringify(players));
            //window.history.pushState({}, path, window.location.origin + path);
            navigate("/forza4/game", "Forza 4 Game");
        }
    });
    
    forza4CustomizeButton.addEventListener('click', () => {
        navigate("/forza4/customize", "Forza 4 Customizations");
    });

    forza4StatsButton.addEventListener('click', () => {
	navigate("/forza4/userstats", "Forza 4 User Statistics");
    });
}


