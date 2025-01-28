import { navigate } from "../main.js";
import { Guest } from "./user.js";
import { update_image, change_name } from "../pages/modes.js";
import { let_me_in } from "../pages/login.js";
import { me } from "../pages/profile.js";

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
    navigate("/modes", "Modalità di gioco");
    if (let_me_in === false)
        update_guest(me, guest);
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
            if (guest)
                update_guest(me, guest);
        }
    }
});

function updateGuestDataFromSession() {
    const guestId = sessionStorage.getItem('currentGuestId');
    if (guestId)
    {
        const guest = guests.find(guest => guest.id === guestId);
        if (guest)
            update_guest(me, guest);
    }
}

updateGuestDataFromSession();


function update_guest(me, guest)
{
    if (let_me_in === 1)
        return;
    if (me)
    {
        const currentGuest = {
            name: me.display_name || guest.name,
            image: me.image || guest.image
        };
        sessionStorage.setItem('guests', JSON.stringify(currentGuest));
        guest.name = currentGuest.name;
        guest.image = currentGuest.image;
        change_name(currentGuest.name);
        update_image(currentGuest.image);
    }
    else
    {
        guest.email = null;
        change_name(guest.name);
        update_image(guest.image);
    }
}