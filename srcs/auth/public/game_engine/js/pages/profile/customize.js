import { navigate } from "../../main.js";
import { ballColor, paddleColor, ballTrailColor, wallsColor } from "../../game/pong/data/game_global.js";
import { setBallColor, setBallTrailColor, setPaddleColor, setWallsColor, setPowerUpState, setBackground} from "../../game/pong/data/game_global.js";
import { current_user, change_name, update_image} from "../modes.js";

export default function Customize() {
    return `
        <h1 class="customize-title">Customize</h1>
        <div id="customize-container" class="customize-wrapper">
            <div class="customize-content">
                <div id="game-customize" class="customize-section">
                    <h2 class="section-title">Game Elements</h2>
                    <div id="game-elements-color" class="color-picker-section">
                        <div class="color-picker">
                            <label for="paddleColorPicker">Paddle:</label>
                            <input type="color" id="paddleColorPicker" value="#ffffff">
                        </div>
                        <div class="color-picker">
                            <label for="ballColorPicker">Ball:</label>
                            <input type="color" id="ballColorPicker" value="#ffffff">
                        </div>
                        <div class="color-picker">
                            <label for="ballTrailColorPicker">Ball Trail:</label>
                            <input type="color" id="ballTrailColorPicker" value="#014C4A">
                        </div>
                        <div class="color-picker">
                            <label for="wallsColorPicker">Walls:</label>
                            <input type="color" id="wallsColorPicker" value="#014C4A">
                        </div>
                    </div>
                </div>
                <div id="preview" class="preview-section">
                    <h2 class="section-title">Preview</h2>
                    <canvas id="previewCanvas" class="preview-canvas"></canvas>
                </div>
            </div>
        </div>
        <div id="backgrounds" class="backgrounds-section">
            <h2 class="section-title">Backgrounds</h2>
            <div id="backgrounds-container" class="backgrounds-grid">
                <div class="background-item">
                    <canvas id="backgroundCanvas1" class="background-canvas"></canvas>
                    <label class="background-label">
                        <input type="radio" id="backgroundCheckbox1" name="background" class="background-checkbox" checked />
                        <span class="background-text">Space</span>
                    </label>
                </div>
                <div class="background-item">
                    <canvas id="backgroundCanvas2" class="background-canvas"></canvas>
                    <label class="background-label">
                        <input type="radio" id="backgroundCheckbox2" name="background" class="background-checkbox" />
                        <span class="background-text">Classic</span>
                    </label>
                </div>
                <div class="background-item">
                    <canvas id="backgroundCanvas3" class="background-canvas"></canvas>
                    <label class="background-label">
                        <input type="radio" id="backgroundCheckbox3" name="background" class="background-checkbox" />
                        <span class="background-text">Ping Pong</span>
                    </label>
                </div>
            </div>
        </div>
        <div id="powerup-checkbox-container" class="powerup-container">
            <label class="powerup-label">
                <input type="checkbox" id="powerup-checkbox" class="powerup-checkbox" />
                <span class="powerup-text">Power-ups</span>
            </label>
        </div>
        <button id="applyCustomization" class="customization-button">Apply</button>
    `;
}

export function addCustomizeGame() {
    const applyCustomization = document.getElementById('applyCustomization');
    let ballColorPicker = document.getElementById('ballColorPicker');
    let paddleColorPicker = document.getElementById('paddleColorPicker');
    let ballTrailColorPicker = document.getElementById('ballTrailColorPicker');
    let wallsColorPicker = document.getElementById('wallsColorPicker');
    let powerupCheckbox = document.getElementById('powerup-checkbox');
    let powerupSelected;
    let backgroundCheckbox1 = document.getElementById('backgroundCheckbox1');
    let backgroundCheckbox2 = document.getElementById('backgroundCheckbox2');
    let backgroundCheckbox3 = document.getElementById('backgroundCheckbox3');
    //let buttonBackGround1 = document.getElementById('buttonBackground1');
    //let buttonBackGround2 = document.getElementById('buttonBackground2');
    //let buttonBackGround3 = document.getElementById('buttonBackground3');
    let backgroundSelected = document.getElementById('background-selected');
    
    ballColorPicker.value = ballColor;
    paddleColorPicker.value = paddleColor;
    ballTrailColorPicker.value = ballTrailColor;
    wallsColorPicker.value = wallsColor;

    powerupCheckbox.addEventListener('change', (event) => {
        if (powerupCheckbox.checked) {
            setPowerUpState(true);
        }
        else {
            setPowerUpState(false);
        }
    });

    /*buttonBackGround1.addEventListener('click', () => {
        backgroundSelected.innerHTML = 'Background Selected: Space';
        setBackground("space");

    })

    buttonBackGround2.addEventListener('click', () => {
        backgroundSelected.innerHTML = 'Background Selected: Classic';
        setBackground("classic");
    })

    buttonBackGround3.addEventListener('click', () => {
        backgroundSelected.innerHTML = 'Background Selected: Ping Pong';
        setBackground("pingpong");
    })*/

    backgroundCheckbox1.addEventListener('change', () => {
        if (backgroundCheckbox1.checked) {
            setBackground("space");
        }
    })
    backgroundCheckbox2.addEventListener('change', () => {
        if (backgroundCheckbox2.checked) {
            setBackground("classic");
        }
    })
    backgroundCheckbox3.addEventListener('change', () => {
        if (backgroundCheckbox3.checked) {
            setBackground("pingpong");
        }
    })

    applyCustomization.addEventListener('click', (event) => {
        ballColorPicker = document.getElementById('ballColorPicker');
        paddleColorPicker = document.getElementById('paddleColorPicker');
        setBallColor(ballColorPicker.value);
        setPaddleColor(paddleColorPicker.value);
        setBallTrailColor(ballTrailColorPicker.value);
        setWallsColor(wallsColorPicker.value);
        if (powerupSelected) {
            setPowerupPlayer(powerupSelected.value, 1);
        }
        navigate("/modes", "Return to Game Mode");
        change_name(current_user.display_name);
        update_image(current_user.image);
    })  
}