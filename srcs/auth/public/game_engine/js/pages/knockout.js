import { navigate } from "../main.js";

export default function Knockout() {
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
        <div class="container" id="playerSelection">
            <input type="radio" id="radio-1" name="players" value="4" class="radio">
            <label for="radio-1">4</label>

            <input type="radio" id="radio-2" name="players" value="8" class="radio">
            <label for="radio-2">8</label>

            <input type="radio" id="radio-3" name="players" value="16" class="radio">
            <label for="radio-3">16</label>
        </div>
        <h3 id="playerNamesTitle" style="display: none;">Enter player names:</h3>
        <div id="playerNames" style="display: none;"></div>
        <button id="bracketButton" style="display: none;">Draw Tournament</button>
    `;
}

export function setupKnockoutPlayers() {
  const bracketButton = document.getElementById('bracketButton');
  const playerNamesTitle = document.getElementById('playerNamesTitle');
  const playerSelection = document.getElementById('playerSelection');
  const playerInputNames = document.getElementById('playerNames');

  if (!bracketButton || !playerSelection || !playerInputNames || !playerNamesTitle) {
      console.error("Missing required elements for Knockout setup.");
      return;
  }

  // Radio button selection listener
  playerSelection.addEventListener('change', (event) => {
      playerInputNames.style.display = 'block';
      bracketButton.style.display = 'block';
      playerNamesTitle.style.display = 'block';

      const selectedPlayers = event.target.value;
      if (selectedPlayers) {
          playerInputNames.innerHTML = '';

          for (let i = 1; i <= selectedPlayers; i++) {
              const input = document.createElement('input');
              input.type = 'text';
              input.id = 'player' + i;
              input.placeholder = 'Player ' + i;
              input.autocomplete = 'off';
              playerInputNames.appendChild(input);
          }
      } else {
          alert('Please select the number of players.');
      }
  });
}

export const addKnockoutPageHandlers = () => {
    const bracketButton = document.getElementById("bracketButton");

    bracketButton.addEventListener('click', (event) => {
        const selectedPlayers = document.querySelector('input[name="players"]:checked')?.value;
        const players = [];
        let allNamesFilled = true;
        
        for (let i = 1; i <= selectedPlayers; i++) {
            const playerInput = document.getElementById('player' + i);
            const playerName = playerInput.value;
    
            if (playerName) {
                players.push(playerName);
            } 
            else
            {
                allNamesFilled = false;
                break;
            }
        }
  
        if (!allNamesFilled)
        {
          alert('Please fill in all player names.');
          return;
        } 
        else
        {
          localStorage.removeItem('players');
          sessionStorage.setItem('players', JSON.stringify(players));
          navigate("/tournament/knockout/bracket", "Bracket");
        }
    });
};