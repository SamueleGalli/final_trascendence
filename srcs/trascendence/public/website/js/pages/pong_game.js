import { navigate } from "../main.js";

export default function PongGame() {
    setTimeout(() => {
        history.pushState(null, "", location.href);

        function handlePopState() {
            navigate("/modes", "returning to modes...");
            alert("quitting game ....");
        }

        window.onpopstate = handlePopState;

        window.addEventListener("beforeunload", () => {
            window.onpopstate = null;
        });
    }, 100);
    return `
    <canvas id="gameCanvas"></canvas>
    <div style="margin-top: 100px;">
        <button class="button-style" id="backToBracketButton" style="display: none;">Back to Bracket</button>  
        <button class="button-style" id="backToRobinButton" style="display: none;">Back to Ranking</button>
        <button class="button-style" id="backToMenuButton" style="display: none;">Back to Menu</button>
    </div>
    `;
}
