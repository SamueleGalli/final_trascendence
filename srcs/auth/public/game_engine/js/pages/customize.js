import { navigate } from "../main.js";

export default function Customize() {
    const html = `
        <h1>Customize</h1>
        <div id="customize-container">
            <div id="game-customize" style="font-size: 25px; display: flex; flex-direction: row;">
                <div id="game-elements-color" style="font-size: 25px;">
                    <div>
                        <label for="paddleColor">Select Paddle Color:</label>
                        <input type="color" id="paddleColorPicker" value="#ffffff">
                    </div>
                    <div>
                        <label for="ballColor">Select Ball Color:</label>
                        <input type="color" id="ballColorPicker" value="#ffffff">
                    </div>
                    <div>
                        <label for="ballTrailColor">Select Ball Trail Color:</label>
                        <input type="color" id="ballTrailColorPicker" value="#014C4A">
                    </div>
                    <div>
                        <label for="wallsColor">Select Walls Color:</label>
                        <input type="color" id="wallsColorPicker" value="#014C4A">
                    </div>
                </div>
                <div id="preview">
                    <label for="previewCanvas" align="left" style="font-size: 30px;">Preview</label>
                    <canvas id="previewCanvas"></canvas>
                </div>
            </div>
            <div id="backgrounds">
                <label for="backgrounds" align="left" style="text-align: left; font-size: 30px;">Backgrounds</label>
                <div id="backgrounds-container" style="display: flex; flex-direction: row;">
                    <div id="backgrounds-container1" style="display: flex; flex-direction: column;">
                        <canvas id="backgroundCanvas1" style="background-color: #000; width: 300px; height: 200px; margin: 10px;"></canvas>
                        <button id="buttonBackground1" style="font-size: 30px; margin-top: 50px;">Space</button>
                    </div>
                    <div id="backgrounds-container2" style="display: flex; flex-direction: column;">
                        <canvas id="backgroundCanvas2" style="background-color: #000; width: 300px; height: 200px; margin: 10px;"></canvas>
                        <button id="buttonBackground2" style="font-size: 30px; margin-top: 50px;">Classic</button>
                    </div>
                    <div id="backgrounds-container3" style="display: flex; flex-direction: column;">
                        <canvas id="backgroundCanvas3" style="background-color: #000; width: 300px; height: 200px; margin: 10px;"></canvas>
                        <button id="buttonBackground3" style="font-size: 30px; margin-top: 50px;">Ping Pong</button>
                    </div>
                </div>
            </div>
            <label id="background-selected" style="font-size: 20px; margin-top: 20px;">Background Selected: </label>
        </div>
        <div id="powerup-checkbox-container" style="display: flex; margin-top: 100px;">
            <label id="powerupLabel" style="font-size: 30px; margin-left: 20px;">
                <input type="checkbox" id="powerup-checkbox" style="width: 30px; height: 30px; margin-right: 10px;" />
                Power-ups
            </label>
            
        </div>
        <button id="applyCustomization" style="font-size: 30px; margin-top: 50px;">Apply</button>
   `;
   return html;
}

export function addCustomizeGame() {
    const applyCustomization = document.getElementById('applyCustomization');
    let ballColorPicker = document.getElementById('ballColorPicker');
    let paddleColorPicker = document.getElementById('paddleColorPicker');
    let ballTrailColorPicker = document.getElementById('ballTrailColorPicker');
    let wallsColorPicker = document.getElementById('wallsColorPicker');
    let powerupCheckbox = document.getElementById('powerup-checkbox');
    let powerupSelected;
    let buttonBackGround1 = document.getElementById('buttonBackground1');
    let buttonBackGround2 = document.getElementById('buttonBackground2');
    let buttonBackGround3 = document.getElementById('buttonBackground3');
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

    buttonBackGround1.addEventListener('click', () => {
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
        navigate("/tournament/knockout/bracket", "Bracket");
    })  
}