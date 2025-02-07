import { navigate } from "../main.js";
import { Guest, setAuthenticated } from "./user.js";
import { update_image, change_name, current_user, updateUserProfile } from "../pages/modes.js";

export let guests = JSON.parse(localStorage.getItem('guests')) || [];
export let currentGuestId = null;

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
    if (name.length < 4) {
        alert('Name too short.');
        return;
    }
    if (name.length >= 15)
    {
        alert('Name too long.');
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
    setAuthenticated();
    navigate("/modes", "Modalità di gioco");
        update_guest(guest);
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

function updateGuestDataFromSession() {
    const guestId = sessionStorage.getItem('currentGuestId');
    if (guestId)
    {
        const guest = guests.find(guest => guest.id === guestId);
        if (guest)
            update_guest(guest);
    }
}

updateGuestDataFromSession();


function update_guest(guest)
{
    if (current_user && current_user.display_name && current_user.image)
        return ;
    else
    {
        guest.email = null;
        change_name(guest.name);
        update_image(guest.image);
        current_user.image = guest.image;
        current_user.display_name = guest.name;
        current_user.type = "guest";
        updateUserProfile(current_user);
    }
}