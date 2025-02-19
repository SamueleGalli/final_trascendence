import { navigate } from "../main.js";
import { user, profile} from "./user.js";
import { update_image, change_name, updateUserProfile } from "../pages/modes.js";

export let guest = JSON.parse(localStorage.getItem('guest')) || [];

window.addEventListener("beforeunload", () => {
    localStorage.clear();
});

window.addEventListener('storage', (event) => {
    if (event.key === 'guest')
        guest = JSON.parse(localStorage.getItem('guest')) || [];
});

export function user_name(name)
{
    console.log("name = " + name);
    fetch("http://localhost:8008",
    {
        method: "get_user",
        body: '{"params":{"display_name": "name"}}',
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
}

export function guest_login()
{
    if (localStorage.getItem("guest") || localStorage.getItem("your_profile"))
    {
        alert("user already logged in");
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
    if (user_name(name) === 1)
    {
        alert('Name already taken.');
        return;
    }
    addGuest(name);
}

function addGuest(name) {
    let curr_guest = new user("game_engine/images/guest.jpg", name, null, null, null);
    localStorage.setItem('guest', JSON.stringify(curr_guest));
    navigate("/modes", "Modalità di gioco");
    update_guest(curr_guest);
}

function update_guest(curr_guest)
{
    change_name(curr_guest.name);
    update_image(curr_guest.image);
    let current_user = new profile(
        null,
        curr_guest.name,
        null,
        curr_guest.bio,
        curr_guest.image,
        "guest"
    );
    fetch("http://localhost:8008", {method: "add_user", 
    body: JSON.stringify(current_user)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    updateUserProfile(current_user);
}