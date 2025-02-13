//import { navigate } from "../main.js";
//import { access_denied, current_user} from "./modes.js";

/*if (current_user === null)
    access_denied();*/

export default function PongGame() {
    return `
    
    <canvas id="gameCanvas"></canvas>
    <div style="margin-top: 100px;">
    <button class="button-style" id="backToBracketButton" style="display: none;">Back to Bracket</button>  
    <button class="button-style" id="backToRobinButton" style="display: none;">Back to Ranking</button>
    <button class="button-style" id="backToMenuButton" style="display: none;">Back to Menu</button>
    </div>
    `;
}

/*window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    return '';
});*/