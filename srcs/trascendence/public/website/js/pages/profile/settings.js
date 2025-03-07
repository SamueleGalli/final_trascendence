import { navigate } from "../../main.js";
import {current_user } from "../modes.js";
import { access_denied } from "../../game/pong/main/modes_logic.js";
export default function Settings() {
    return `
        <h1 class="text">
            <span class="letter letter-1">M</span>
            <span class="letter letter-2">O</span>
            <span class="letter letter-3">D</span>
            <span class="letter letter-4">E</span>
            <span class="letter letter-5">S</span>
            <span class="letter letter-6"> </span>
            <span class="letter letter-7"> </span>
            <span class="letter letter-8">S</span>
            <span class="letter letter-9">E</span>
            <span class="letter letter-10">T</span>
            <span class="letter letter-11">T</span>
            <span class="letter letter-12">I</span>
            <span class="letter letter-13">N</span>
            <span class="letter letter-14">G</span>
            <span class="letter letter-15">S</span>
        </h1>
        <script src="../../login/guest_logic.js"></script>
        <div>
            <div>
                <button class="button-style" id="customizePongButton"><span class="text-animation">Ping Pong</span></button>
            </div>
            <div>
                <button class="button-style" id="customizeForza4Button"><span class="text-animation">Forza4</span></button>
            </div>
        </div>
    `;
}



export const addSettingsPageHandlers = () => {
    if (current_user === null)
        access_denied();
    const customizePongButton = document.getElementById('customizePongButton');
    const customizeForza4Button = document.getElementById('customizeForza4Button');

    customizePongButton?.addEventListener('click', () => {
        navigate("/settings/customizepong", "Modalità Personalizzazione");
    });

    customizeForza4Button?.addEventListener('click', () => {
        navigate("/settings/customizeforza4", "Modalità Personalizzazione");
    });
};