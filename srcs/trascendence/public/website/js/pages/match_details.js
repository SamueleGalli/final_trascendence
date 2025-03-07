import { userName } from "./user_data.js";

let userData;
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
    
    `;
}


export async function showMatchDetails() {
    const matchDetailsContainer = document.getElementById("matchDetailsContainer");
    matchDetailsContainer.innerHTML = "";
    //const playerName = userName;
    // const data = JSON.parse(localStorage.getItem('game_data')) || { players: {} };
    // const playerData = data.players[playerName];

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
    

    if (userData && userData.length > 0) {
        matchDetailsContainer.innerHTML += `<h3>Matches History</h3>`;
        userData.forEach(match => {
            const opponent = match.player1 === userName ? match.player2 : match.player1;

            const matchHtml = `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                    <p><strong>Match:</strong> ${match.player1} vs. ${match.player2}</p>
                    <p><strong>Score:</strong> ${match.score1} - ${match.score2}</p>
                    <p><strong>Winner:</strong> ${match.winner}</p>
                </div>
            `;
            matchDetailsContainer.innerHTML += matchHtml;
        });
    } else {
        matchDetailsContainer.innerHTML += `<p>No matches found.</p>`;
    }
}