import { navigate } from "../main.js";
import { Guest } from "./user.js";
import { update_image, change_name, current_user, updateUserProfile } from "../pages/modes.js";

export let guest = JSON.parse(localStorage.getItem('guest')) || [];

window.addEventListener('storage', (event) => {
    if (event.key === 'guest') {
        guest = JSON.parse(localStorage.getItem('guest')) || [];
    }
});

/*export function user_name(name)
{
    console.log("name = " + name);
    fetch("http://localhost:8008",
    {
        method: "get_user",
        body: JSON.stringify({ "display_name" : name }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("data = ", data);
        if (data.status === "no users found" || !data.user || data.user.length === 0)
        {
            console.log("hi enter here\n");
            if (data.user === user)
                return 0;
            else
                return 1
        }
    })
    .catch(error => console.error("Fetch error:", error));
}*/

export function guest_login() {
    if (sessionStorage.getItem('currentGuestId') !== null) {
        alert('A guest is already logged in this session.');
        return;
    }

    localStorage.setItem('guest', JSON.stringify(guest));
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
    if (guest.some(guest => guest.name === name))
    //|| user_name(name) === 1)
    {
        alert('Name already taken.');
        return;
    }
    addGuest(name);
}

function addGuest(name) {
    let newGuest = new Guest("game_engine/images/guest.jpg", name, null);
    guest.push(newGuest);
    localStorage.setItem('guest', JSON.stringify(guest));
    updateUIForGuest(newGuest);

    // Salva l'ID del guest nella sessione
    sessionStorage.setItem('currentGuestId', newGuest.id);
}

function updateUIForGuest(guest) {
    navigate("/modes", "Modalità di gioco");
    update_guest(guest);
}

window.addEventListener("beforeunload", () => {
    localStorage.clear();
});

function update_guest(guest)
{
    guest.email = null;
    change_name(guest.name);
    update_image(guest.image);
    current_user.image = guest.image;
    current_user.display_name = guest.name;
    current_user.type = "guest";
    updateUserProfile(current_user);
    current_user.entered = 1;
}
