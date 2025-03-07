import { navigate } from "../../main.js";
import { token1Color, token2Color, powerUpMode } from "../../game/forza4/data/forza4_game_global.js";
import { setToken1Color, setToken2Color, setBoardBackground, setPowerUpState } from "../../game/forza4/data/forza4_game_global.js";
import { current_user, change_name, update_image} from "../modes.js";
export function Forza4Customize() {
    const html = `
    <div id="forza4Customize">
        <h1>Forza 4 Customize</h1>
        <div id="forza4-elements-color">
            <div>
                <label for="token1Color">Token Player 1 Color:</label>
                <input type="color" id="token1ColorPicker" value="#ffffff">
            </div>
            <div>
                <label for="token2Color">Token Player 2 Color:</label>
                <input type="color" id="token2ColorPicker" value="#ffffff">
            </div>
        </div>
        <div id="forza4-backgrounds">
                <label for="forza4-backgrounds" align="left">Backgrounds</label>
                <div id="f4-backgrounds-container">
                    <button id="f4ButtonBackground1" class="f4ButtonBackground">Classic</button>
                    <button id="f4ButtonBackground2" class="f4ButtonBackground">Neon</button>
                    <button id="f4ButtonBackground3" class="f4ButtonBackground">Faded 70's</button>
                </div>
        </div>
        <div id="powerup-checkbox-container" class="powerup-container">
            <label class="powerup-label">
                <input type="checkbox" id="powerup-checkbox" class="powerup-checkbox" />
                <span class="powerup-text">Power-ups</span>
            </label>
        </div>
        <label id="f4-background-selected">Background Selected: </label>
    </div>
    <button id="forza4ApplyCustom">Apply</button>
    `;
    return html;
}


export function forza4Config() {


    const token1ColorPicker = document.getElementById('token1ColorPicker');
    const token2ColorPicker = document.getElementById('token2ColorPicker');
    const forza4ApplyCustom = document.getElementById('forza4ApplyCustom');
    const f4ButtonBackground1 = document.getElementById('f4ButtonBackground1'); 
    const f4ButtonBackground2 = document.getElementById('f4ButtonBackground2');
    const f4ButtonBackground3 = document.getElementById('f4ButtonBackground3');
    const f4BackgroundSelected = document.getElementById('f4-background-selected');
    const f4powerupCheckbox = document.getElementById('powerup-checkbox');

    token1ColorPicker.value = token1Color;
    token2ColorPicker.value = token2Color;
    f4powerupCheckbox.checked = powerUpMode;

    f4ButtonBackground1.style.width = '20%';
    f4ButtonBackground2.style.width = '20%';
    f4ButtonBackground3.style.width = '20%';

    forza4ApplyCustom.addEventListener('click', () => {
        setToken1Color(token1ColorPicker.value);
        setToken2Color(token2ColorPicker.value);
        //window.history.pushState({}, path, window.location.origin + path);
        navigate("/modes", "Back to Game Modes");
    });

    f4ButtonBackground1.addEventListener('click', () => {
        f4BackgroundSelected.innerHTML = 'Background Selected: Classic';
        setBoardBackground("bg1");
    });
    f4ButtonBackground2.addEventListener('click', () => {
        f4BackgroundSelected.innerHTML = 'Background Selected: Neon';
        setBoardBackground("bg2");
    });
    f4ButtonBackground3.addEventListener('click', () => {
        f4BackgroundSelected.innerHTML = 'Background Selected: Faded 70s';
        setBoardBackground("bg3");
    });

    f4powerupCheckbox.addEventListener('change', (event) => {
            if (f4powerupCheckbox.checked) {
                setPowerUpState(true);
            }
            else {
                setPowerUpState(false);
            }
        });
}