import { navigate } from "../main.js";

export function update_image(image) {
    const checkImageInterval = setInterval(() => {
        const avatarImage = document.getElementById('avatarImage');
        if (avatarImage)
        {
            avatarImage.src = image;
            clearInterval(checkImageInterval);
        }
        else
            console.warn("Element 'avatarImage' not found in the DOM.");
    }, 100);
}

export function change_name(name) {
    const checknameInterval = setInterval(() => {
        const avatarName = document.getElementById('avatarName');
        if (avatarName)
        {
            avatarName.innerText = name;
            clearInterval(checknameInterval);
        }
        else
            console.warn("Element 'avatarName' not found in the DOM.");
    }, 100);
}

export default function Modes() {
    return `
    <h1 class="text">
    <span class="letter letter-1">S</span>
    <span class="letter letter-2">E</span>
    <span class="letter letter-3">L</span>
    <span class="letter letter-4">E</span>
    <span class="letter letter-5">C</span>
    <span class="letter letter-6">T</span>
    <span class="letter letter-7"> </span>
    <span class="letter letter-8"> </span>
    <span class="letter letter-9">G</span>
    <span class="letter letter-10">A</span>
    <span class="letter letter-11">M</span>
    <span class="letter letter-12">E</span>
    <span class="letter letter-13"> </span>
    <span class="letter letter-14"> </span>
    <span class="letter letter-15">M</span>
    <span class="letter letter-16">O</span>
    <span class="letter letter-17">D</span>
    <span class="letter letter-18">E</span>
    </h1>
    <script src="../../login/guest_logic.js"></script>
    <div id="modeButtonsContainer">
    <div class="mode-button-container">
    <button class="button-style" id="classicButton"><span class="text-animation">CLASSIC</span></button>
    </div>
    <div class="mode-button-container">
    <button class="button-style" id="tournamentButton"><span class="text-animation">TOURNAMENT</span></button>
    </div>
    <div class="mode-button-container">
    <button class="button-style" id="aiButton"><span class="text-animation">AI Wars</span></button>
    </div>
    </div>
    <span id="avatarName">Default</span>
    <div class="avatar-container">
    <img alt="Avatar" class="avatar-image" id="avatarImage">
    <div class="menu-container hidden">
    <div class="menu-item"><img src="game_engine/images/profile.png" alt="Profile"></div>
    <div class="menu-item"><img src="game_engine/images/answer.png" alt="Settings"></div>
    </div>
    </div>  
    `;
}

export const addModesPageHandlers = () => {
    const classicButton = document.getElementById('classicButton');
    const aiButton = document.getElementById('aiButton');
    const tournamentButton = document.getElementById('tournamentButton');
    const avatarImage = document.getElementById('avatarImage');
    const menuContainer = document.querySelector('.menu-container');
    
    classicButton?.addEventListener('click', () => {
        navigate("/classic", "Modalità Classic");
    });
    
    aiButton?.addEventListener('click', () => {
        navigate("/aiWars", "Modalità AI");
    });

    tournamentButton?.addEventListener('click', () => {
        navigate("/tournament", "Modalità Torneo");
    });

    avatarImage.addEventListener("click", (event) => {
        menuContainer.classList.toggle("visible");
    });
    // Chiusura del menu quando si clicca fuori dall'avatar o dal menu
    document.addEventListener("click", (event) => {
        // Verifica se il clic non è stato effettuato dentro l'avatar o il menu
        if (!avatarImage.contains(event.target) && !menuContainer.contains(event.target)) {
            // Se il clic è avvenuto fuori, nasconde il menu
            menuContainer.classList.remove("visible");
        }
    });
};