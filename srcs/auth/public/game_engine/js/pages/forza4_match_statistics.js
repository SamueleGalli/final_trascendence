import { userName } from "./user_data.js";

export function Forza4MatchStats() {
    return `
    
        <h1 class="text text-userstats">
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
            <span class="letter letter-11">M</span>
            <span class="letter letter-12">a</span>
            <span class="letter letter-13">t</span>
            <span class="letter letter-14">c</span>
            <span class="letter letter-14">h</span>
            <span class="letter letter-14">e</span>
            <span class="letter letter-14">s</span>
        </h1>
        <div id="f4MatchDetailsContainer">
           
        </div>

        <style>
           #f4MatchDetailsContainer {
            margin-top: 20px;            
            display: flex;
            flex-direction: column;
            color: #fff;
            font-family: "Liberty", sans-serif;
            margin-top: 2px;
            }
        </style>
    `;
}


export function forza4ShowMatchDetails() {
    const f4MatchDetailsContainer = document.getElementById("f4MatchDetailsContainer");
    f4MatchDetailsContainer.innerHTML = "";
    const playerName = userName;
    const f4data = JSON.parse(localStorage.getItem('f4_game_data')) || { players: {} };
    const playerData = f4data.players[playerName];

    //console.log("player matches data" +playerData.matches);

    if (playerData.matches && playerData.matches.length > 0) {
        playerData.matches.forEach(match => {
            const opponent = match.player1 === playerName ? match.player2 : match.player1;

            const matchHtml = `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                    <p><strong>Match:</strong> ${match.player1} vs. ${match.player2}</p>
                    <p><strong>Winner:</strong> ${match.winner}</p>
                    <p><strong>Moves:</strong> ${match.moves}</p>
                    <p><strong>Time: </strong> ${match.matchTime}</p>
                    <p><strong>Date:</strong> ${new Date(match.date).toLocaleString()}</p>
                </div>
            `;
            f4MatchDetailsContainer.innerHTML += matchHtml;
        });
    } else {
        f4MatchDetailsContainer.innerHTML += `<p>No matches found.</p>`;
    }
}