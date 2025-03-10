import { navigate } from "../../main.js";
import { current_user} from "../modes.js";
import { access_denied } from "../../game/pong/main/modes_logic.js";
export default function Tournament() {
    return `
        <img id="backImageButton" src="../website/images/home.png" alt="Back" class="back-button">
        <h1 class="text">
            <span class="letter letter-1">W</span>
            <span class="letter letter-2">e</span>
            <span class="letter letter-3">l</span>
            <span class="letter letter-4">c</span>
            <span class="letter letter-5">o</span>
            <span class="letter letter-6">m</span>
            <span class="letter letter-7">e</span>
            <span class="letter letter-8"> </span>
            <span class="letter letter-9"> </span>
            <span class="letter letter-10">t</span>
            <span class="letter letter-11">o</span>
            <span class="letter letter-12"> </span>
            <span class="letter letter-13"> </span>
            <span class="letter letter-14">t</span>
            <span class="letter letter-15">h</span>
            <span class="letter letter-16">e</span>
            <span class="letter letter-17"> </span>
            <span class="letter letter-18"> </span>
            <span class="letter letter-19">T</span>
            <span class="letter letter-20">o</span>
            <span class="letter letter-21">u</span>
            <span class="letter letter-22">r</span>
            <span class="letter letter-23">n</span>
            <span class="letter letter-24">a</span>
            <span class="letter letter-25">m</span>
            <span class="letter letter-26">e</span>
            <span class="letter letter-27">n</span>
            <span class="letter letter-28">t</span>
        </h1>
        <div id="TourButtonsContainer">
            <div class="tour-button-container">
                <button class="button-style" id="knockoutTournament">Knockout</button>
            </div>
            <div class="tour-button-container">
                <button class="button-style" id="roundrobinTournament">Round-robin</button>
            </div>
            <div class="tour-button-container">
                <button class="button-style" id="userStatisticsButton">Statistics</button>
            </div>
        </div>
    `;
}

export const addTournamentPageHandlers = () => {
    if (current_user === null)
        access_denied();
    const knockoutTournament = document.getElementById('knockoutTournament');
    const roundrobinTournament = document.getElementById('roundrobinTournament');
    const userStatisticsButton = document.getElementById('userStatisticsButton');
    const backImageButton = document.getElementById('backImageButton');

    knockoutTournament?.addEventListener('click', () => {
        navigate("/tournament/knockout", "Knockout");
    });

    roundrobinTournament?.addEventListener('click', () => {
        navigate("/tournament/roundrobin", "Roundrobin");
    });

    userStatisticsButton?.addEventListener('click', () => {
            navigate("/tournament/userstats", "Userstats");
    });

    backImageButton?.addEventListener('click', () => {
        navigate("/modes", "Return to Game Mode");
    });
};