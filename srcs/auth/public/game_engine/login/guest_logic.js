import { navigate } from "../js/main.js";
import { update_image } from "../js/pages/modes.js";

export function guest_login() {
    const name = prompt("Enter your guest name:").trim();
    
    if (!name) {
        alert('Please enter a valid name.');
        return ;
    }
    updateUIForGuest(name);
}

function updateUIForGuest(name) {
    navigate("/modes", "Modalità di gioco");
    update_image("game_engine/images/guest.jpg");
    const avatarName = document.getElementById('avatarName');
    avatarName.innerText = name;
}