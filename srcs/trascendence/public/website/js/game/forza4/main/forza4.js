import { navigate } from "../../../main.js";
import { token1Color, token2Color, boardBackground, f4matchData, powerUpMode} from "../data/forza4_game_global.js";
import { createGrid, redrawGrid } from "../board/forza4_grid.js";
import { updateTimer, resetTimer } from "../other/forza4_timer.js";
import { activatePowerup } from "../board/forza4_powerup.js";

let backImageButton;


export function Forza4() {
        return `
            <div id="forza4Game">
            <div id="f4players">
                <div id="p1" class="f4player-info">
                    <span class="f4-name" id="p1Name"></span>&nbsp;<span class="f4-token color token1" id="p1Color"></span>   
                </div>
                <button id="p1PowerupButton" class="f4-button-style" disabled>Power-up</button>
                <div id="p2" class="f4player-info">
                    <span class="f4-name" id="p2Name"></span>&nbsp;<span class="f4-token color token2" id="p2Color"></span>  
                </div>
                <button id="p2PowerupButton" class="f4-button-style" disabled>Power-up</button>
            </div>
            <div id="f4powerupinfo"></div>
            <div id="f4timer">00:00</div>
            <div id="f4grid-container">
                <div id="f4board"></div> <!-- Griglia di gioco -->
            </div>
            <div id="f4message"></div>
            <button id="f4BackToMenuButton" class="button-style">Back to Menu</button>
        </div>
        <div class="avatar-container">
            <img id="backImageButton" src="../website/images/home.png" alt="Back" class="back-button">
        </div>
        `;
}

export function startForza4Game() {
    backImageButton = document.getElementById('backImageButton');

    let f4Game = new Forza4Game();

}



class Forza4Game {

    constructor() {
        this.p1Name = document.getElementById('p1Name');
        this.p2Name = document.getElementById('p2Name');
        this.p1Color = document.getElementById('p1Color');
        this.p2Color = document.getElementById('p2Color');
        this.f4BackToMenuButton = document.getElementById('f4BackToMenuButton');
        this.f4PowerupInfo = document.getElementById('f4powerupinfo');
        this.grid = document.getElementById('f4board');
        this.message = document.getElementById('f4message');
        this.moves = 0;
        this.elapsedTime = 0;

        this.p1Color.style.backgroundColor = token1Color;
        this.p2Color.style.backgroundColor = token2Color;
        this.rows = 6;
        this.cols = 7;
        this.currentPlayer = 'token1';
        this.p1PowerupUsed = false;
        this.p2PowerupUsed = false;
        this.powerUpActive = false;
      
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.gameEnded = false;

        this.f4Players = JSON.parse(sessionStorage.getItem('forza4players'));
        this.p1 = this.f4Players[0];
        this.p2 = this.f4Players[1];

        this.p1Name.textContent = this.p1 + ":";
        this.p2Name.textContent = this.p2 + ":";

        createGrid(this);
        this.printPlayerTurnMessage();

        this.startTime = Date.now();
        this.timerInterval = setInterval(() => updateTimer(this), 1000);

        
        this.addEventListeners();
        this.checkPowerups();

    }

    printPlayerTurnMessage() {
        if (this.currentPlayer === 'token1') {
            this.message.textContent = `Turno di ${this.p1}`;
        }
        else {
            this.message.textContent = `Turno di ${this.p2}`;
        }
    }

    checkPowerups() {
        if (!powerUpMode) {
            document.getElementById('p1PowerupButton').style.display = "none";
            document.getElementById('p2PowerupButton').style.display = "none";
            
        }
        else
        {
            document.getElementById('p1PowerupButton').style.display = "block";
            document.getElementById('p2PowerupButton').style.display = "block";
            document.getElementById('p1PowerupButton').disabled = false;
            document.getElementById('p2PowerupButton').disabled = false;
            this.p1PowerupUsed = false;
            this.p2PowerupUsed = false;
    
            // Aggiungi i listener per i pulsanti dei power-up
            document.getElementById('p1PowerupButton').addEventListener('click', () => activatePowerup(this, 'token1'));
            document.getElementById('p2PowerupButton').addEventListener('click', () => activatePowerup(this, 'token2'));
        } 
           
    }


    addEventListeners() {
        f4BackToMenuButton.addEventListener('click', (event) => {
            document.getElementById("app").style.background = 
            "linear-gradient(35deg, #b97070, #134946), radial-gradient(circle, rgba(255, 243, 255, 0.2) 30%, transparent 60%)";
            resetTimer(this);
            navigate("/forza4", "Forza 4 Home");
        });
    
        backImageButton?.addEventListener('click', () => {
             document.getElementById("app").style.background = 
    "linear-gradient(35deg, #b97070, #134946), radial-gradient(circle, rgba(255, 243, 255, 0.2) 30%, transparent 60%)";
            resetTimer(this);
            navigate("/modes", "Return to Game Mode");
        });
        window.addEventListener("popstate", (event) => {
            document.getElementById("app").style.background = 
            "linear-gradient(35deg, #b97070, #134946), radial-gradient(circle, rgba(255, 243, 255, 0.2) 30%, transparent 60%)";
           resetTimer(this);
        });
        
        // Ricalcola la griglia al ridimensionamento della finestra
        window.addEventListener('resize', () => {
            createGrid(this);
            redrawGrid(this, this.rows, this.cols);
        });
    }
}

