import { navigate } from "../main.js";

export default function Roundrobin() {
    return `
        <h1 class="text">
            <span class="letter letter-1">S</span>
            <span class="letter letter-2">e</span>
            <span class="letter letter-3">l</span>
            <span class="letter letter-4">e</span>
            <span class="letter letter-5">c</span>
            <span class="letter letter-6">t</span>
            <span class="letter letter-7"> </span>
            <span class="letter letter-8"> </span>
            <span class="letter letter-9">t</span>
            <span class="letter letter-10">h</span>
            <span class="letter letter-11">e</span>
            <span class="letter letter-12"> </span>
            <span class="letter letter-13"> </span>
            <span class="letter letter-14">n</span>
            <span class="letter letter-15">u</span>
            <span class="letter letter-16">m</span>
            <span class="letter letter-17">b</span>
            <span class="letter letter-18">e</span>
            <span class="letter letter-19">r</span>
            <span class="letter letter-20"> </span>
            <span class="letter letter-21"> </span>
            <span class="letter letter-22">o</span>
            <span class="letter letter-23">f</span>
            <span class="letter letter-24"> </span>
            <span class="letter letter-25"> </span>
            <span class="letter letter-26">p</span>
            <span class="letter letter-27">l</span>
            <span class="letter letter-28">a</span>
            <span class="letter letter-29">y</span>
            <span class="letter letter-30">e</span>
            <span class="letter letter-31">r</span>
            <span class="letter letter-32">s</span>
        </h1>
        <div class="container" id="playerSelectionRobin">
            <input type="radio" id="radio-1" name="players" value="4" class="radio">
            <label for="radio-1">4</label>

            <input type="radio" id="radio-2" name="players" value="5" class="radio">
            <label for="radio-2">5</label>

            <input type="radio" id="radio-3" name="players" value="6" class="radio">
            <label for="radio-3">6</label>

            <input type="radio" id="radio-4" name="players" value="7" class="radio">
            <label for="radio-4">7</label>

            <input type="radio" id="radio-5" name="players" value="8" class="radio">
            <label for="radio-5">8</label>
        </div>
        <div id="nameInputRobin" style="display:none;">
            <h2>Insert Player Names</h2>
            <div id="playerNamesRobin"></div>
            <button id="startRobinTournamentButton">Start Tournament</button>
        </div>

    `;
}

export function setupRoundRobinPlayers() {
    const startRobinTournamentButton = document.getElementById("startRobinTournamentButton");
    const playerNamesRobin = document.getElementById('playerNamesRobin');
    const nameInputRobin = document.getElementById('nameInputRobin');
    const playerSelection = document.getElementById('playerSelectionRobin');

    if (!startRobinTournamentButton || !playerSelection || !playerNamesRobin || !nameInputRobin) {
        console.error("Missing required elements for Round Robin setup.");
        return;
    }

    console.log("Round Robin setup initialized");

    playerSelection.addEventListener('change', (event) => {
        console.log("Change event triggered");
        const selectedRadio = document.querySelector('input[name="players"]:checked');
        if (selectedRadio) {
            const selectedPlayers = selectedRadio.value;
            console.log("Selected players: ", selectedPlayers);

            // Показать поле для ввода
            nameInputRobin.style.display = 'block';

            // Очистить предыдущие поля
            playerNamesRobin.innerHTML = '';

            // Создаем новые поля
            for (let i = 1; i <= selectedPlayers; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'player' + i;
                input.placeholder = 'Player ' + i;
                input.autocomplete = 'off';
                console.log("Creating input field for Player ", i);
                playerNamesRobin.appendChild(input);
            }
        } else {
            console.error("No radio button selected");
            alert('Please select the number of players.');
        }
    });

    startRobinTournamentButton.addEventListener('click', () => {
        const selectedPlayers = document.querySelector('input[name="players"]:checked')?.value;
        if (!selectedPlayers) {
            alert('Please select the number of players.');
            return;
        }

        const players = [];
        let allNamesFilled = true;

        for (let i = 1; i <= selectedPlayers; i++) {
            const playerInput = document.getElementById('player' + i);
            const playerName = playerInput?.value;

            if (playerName) {
                players.push(playerName);
            } else {
                allNamesFilled = false;
                console.error("Player name missing for Player ", i);
                break;
            }
        }

        if (!allNamesFilled) {
            alert('Please fill in all player names.');
        } else {
            console.log("Players: ", players);
            sessionStorage.setItem('players', JSON.stringify(players));
            navigate("/tournament/roundrobin/robindraw", "robindraw");
        }
    });
}
