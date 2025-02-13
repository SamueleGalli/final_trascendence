import { userName } from "./user_data.js";
//import { current_user, access_denied } from "./modes.js";

export default function MatchDetails() {
    return `
    <div>
        <h1 class="text">
            <span class="letter letter-1">M</span>
            <span class="letter letter-2">a</span>
            <span class="letter letter-3">t</span>
            <span class="letter letter-4">c</span>
            <span class="letter letter-5">h</span>
            <span class="letter letter-6"> </span>
            <span class="letter letter-7"> </span>
            <span class="letter letter-8">D</span>
            <span class="letter letter-9">e</span>
            <span class="letter letter-10">t</span>
            <span class="letter letter-11">a</span>
            <span class="letter letter-12">i</span>
            <span class="letter letter-13">l</span>
            <span class="letter letter-14">s</span>
        </h1>
        <div id="matchDetailsContainer">
        </div>
    </div>

        <style>
            #matchDetailsContainer {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-family: "Liberty", sans-serif;
                margin-top: 2px;
            }
        </style>
    `;
}


export function showMatchDetails() {

    const matchDetailsContainer = document.getElementById("matchDetailsContainer");
    matchDetailsContainer.innerHTML = "";
    const playerName = userName;
    const data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };
    const playerData = data.players[playerName];

    if (playerData.matches && playerData.matches.length > 0) {
        matchDetailsContainer.innerHTML += `<h3>Matches History</h3>`;
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
            matchDetailsContainer.innerHTML += matchHtml;
        });
    } else {
        matchDetailsContainer.innerHTML += `<p>No matches found.</p>`;
    }
}