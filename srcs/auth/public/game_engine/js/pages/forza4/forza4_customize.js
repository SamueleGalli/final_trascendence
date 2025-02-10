import { navigate } from "../../main.js";
import { token1Color, token2Color } from "../../game/forza4/data/forza4_game_global.js";
import { setToken1Color, setToken2Color, setBoardBackground } from "../../game/forza4/data/forza4_game_global.js";

export function Forza4Customize() {
    const html = `
    <div id="forza4Customize">
        <h1 style="color: #fff;>Forza 4 Customize</h1>
        <div id="forza4-elements-color" style="font-size: 25px;">
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
                <label for="forza4-backgrounds" align="left" style="text-align: left; font-size: 30px; color: #fff;">Backgrounds</label>
                <div id="f4-backgrounds-container" style="display: flex; flex-direction: column;">
                    <button id="f4ButtonBackground1" style="font-size: 30px; margin-top: 30px; align-self: center; padding: 10px 20px; min-width: 150px;">Classic</button>
                    <button id="f4ButtonBackground2" style="font-size: 30px; margin-top: 30px; align-self: center; padding: 10px 20px; min-width: 150px;">42</button>
                    <button id="f4ButtonBackground3" style="font-size: 30px; margin-top: 30px; align-self: center; padding: 10px 20px; min-width: 150px;">Cartoon</button>
                </div>
        </div>
        <label id="f4-background-selected" style="font-size: 30px; margin-top: 20px; color: #fff;">Background Selected: </label>
    </div>
    <button id="forza4ApplyCustom" style="font-size: 30px; margin-top: 50px;">Apply</button>
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

    token1ColorPicker.value = token1Color;
    token2ColorPicker.value = token2Color;

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
        setBoardBackground("classic");
    });
    f4ButtonBackground2.addEventListener('click', () => {
        f4BackgroundSelected.innerHTML = 'Background Selected: 42';
        setBoardBackground("42");
    });
    f4ButtonBackground3.addEventListener('click', () => {
        f4BackgroundSelected.innerHTML = 'Background Selected: Cartoon';
        setBoardBackground("cartoon");
    });
}