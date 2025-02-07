import { navigate } from "../../main.js";
import { current_user, change_name, update_image} from "../modes.js";

export default function Knockout() {
    return `
        <img id="backImageButton" src="../game_engine/images/home.png" alt="Back" class="back-button">
        <h1 class="text">
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
            <label class="label_knockout" for="radio-1">4</label>

            <input type="radio" id="radio-2" name="players" value="8" class="radio">
            <label class="label_knockout" for="radio-2">8</label>

            <input type="radio" id="radio-3" name="players" value="16" class="radio">
            <label class="label_knockout" for="radio-3">16</label>
        </div>
    `;
}

export const addKnockoutPageHandlers = () => {
    const radioButtons = document.querySelectorAll("input[name='players']");
    const backImageButton = document.getElementById('backImageButton');
    
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', (event) => {
            //console.log(radioButton.value);
            navigate("/tournament/knockout/bracket", radioButton.value);
            /*if (radioButton.value === "4")
                navigate("/tournament/knockout/bracket", "4");
            else if (radioButton.value === "8")
                navigate("/tournament/knockout/bracket", "8");
            else if (radioButton.value === "16")
                navigate("/tournament/knockout/bracket", "16");*/
            
        });
    });
    
    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
        change_name(current_user.display_name);
        update_image(current_user.image);
    });
};