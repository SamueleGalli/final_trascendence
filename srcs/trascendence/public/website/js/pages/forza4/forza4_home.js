import { navigate } from "../../main.js";
import { userName } from "../user_data.js";
import { current_user, change_name, update_image} from "../modes.js";

export function Forza4Home() {
    return `
        <img id="backImageButton" src="../website/images/home.png" alt="Back" class="back-button">
        <h1 class="text h1_margin">
            <span class="letter letter-1">F</span>
            <span class="letter letter-2">O</span>
            <span class="letter letter-3">R</span>
            <span class="letter letter-4">Z</span>
            <span class="letter letter-5">A</span>
            <span class="letter letter-6"> </span>
            <span class="letter letter-7"> </span>
            <span class="letter letter-8">4</span>
            <span class="letter letter-9"> </span>
            <span class="letter letter-10"> </span>
            <span class="letter letter-11">G</span>
            <span class="letter letter-12">A</span>
            <span class="letter letter-12">M</span>
            <span class="letter letter-13">E</span>
        </h1>
        <div id="forza4Home">
            <div id="forza4ButtonsContainer">
                <div>
                    <button id="forza4PlayButton" class="button-style">Play Forza 4</button>
                </div>
                <div>
                    <button id="forza4StatsButton" class="button-style">Forza 4 Statistics</button>
                </div>
            </div>
        </div>
    `;
}

export function showForza4HomeScreen() {
    const forza4PlayButton = document.getElementById('forza4PlayButton');
    const forza4StatsButton = document.getElementById('forza4StatsButton');
    
    forza4PlayButton.addEventListener('click', () => {
        const players = [userName, "Poppi"];
        /*let allNamesFilled = true;
        
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
        }*/
        localStorage.removeItem('forza4players');
        sessionStorage.setItem('forza4players', JSON.stringify(players));
        //window.history.pushState({}, path, window.location.origin + path);
        navigate("/forza4/game", "Forza 4 Game");
    });
    

    forza4StatsButton.addEventListener('click', () => {
	navigate("/forza4/userstats", "Forza 4 User Statistics");
    });
}

export const addForza4PageHandlers = () => {
    const backImageButton = document.getElementById('backImageButton');

    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
    });
};