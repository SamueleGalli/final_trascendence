import { navigate } from "../js/main.js";
import { update_image, change_name } from "../js/pages/modes.js";
import { Guest } from "./user.js";
import { let_me_in } from "../js/pages/login.js";


export let guests = JSON.parse(localStorage.getItem('guests')) || [];
let currentGuestId = null;

window.addEventListener('storage', (event) => {
    if (event.key === 'guests') {
        guests = JSON.parse(localStorage.getItem('guests')) || [];
    }
});

export function guest_login() {
    updateLocalStorage();
    let name = prompt("Enter your guest name:");
    if (!name) {
        alert('No name. Please try again');
        return;
    }
    name = name.trim();
    if (name.length < 5) {
        alert('Name too short.');
        return;
    }
    if (guests.some(guest => guest.name === name)) {
        alert('Name already taken.');
        return;
    }
    addGuest(name);
}

function addGuest(name) {
    const guestId = generateUniqueId();
    let newGuest = new Guest("game_engine/images/guest.jpg", name, null, guestId);
    guests.push(newGuest);
    currentGuestId = guestId;
    updateLocalStorage();
    sessionStorage.setItem('currentGuestId', guestId);
    updateUIForGuest(newGuest);
}

function updateUIForGuest(guest) {
    navigate("/modes", "Modalità di gioco");
    alert("(you are logged successfully if you want to change user you need to close this tab first!)");
    update_image(guest.image);
    change_name(guest.name);
}

window.addEventListener("beforeunload", () => {
    const guestId = sessionStorage.getItem('currentGuestId');
    if (guestId !== null) {
        removeGuest(guestId);
        updateLocalStorage();
        sessionStorage.removeItem('currentGuestId');
    }
});

function removeGuest(guestId) {
    guests = guests.filter(guest => guest.id !== guestId);
}

function updateLocalStorage() {
    localStorage.setItem('guests', JSON.stringify(guests));
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).slice(2, 11);
}

window.addEventListener("popstate", () => {
    if (let_me_in === false)
    {
        const guestId = sessionStorage.getItem('currentGuestId');
        if (guestId) {
            const guest = guests.find(guest => guest.id === guestId);
            if (guest) {
                update_image(guest.image); 
                change_name(guest.name);   
            }
        }
    }
});

function updateGuestDataFromSession() {
    const guestId = sessionStorage.getItem('currentGuestId');
    if (guestId) {
        const guest = guests.find(guest => guest.id === guestId);
        if (guest) {
            update_image(guest.image); 
            change_name(guest.name);   
        }
    }
}

updateGuestDataFromSession();