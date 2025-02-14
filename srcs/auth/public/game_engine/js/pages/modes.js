import { navigate } from '../main.js';
import { profileHandler } from "./profile/profile.js";
import { ShowStats } from "./profile/stats.js";
import { profile } from "../login/user.js";
import { Friendlists } from "./friends.js";

export let current_user = JSON.parse(sessionStorage.getItem('your_profile'));

window.addEventListener('load', () => {
    let storedUser = sessionStorage.getItem('your_profile');
    if (storedUser)
    {
        let parsedUser = JSON.parse(storedUser);
        current_user = new profile(
            parsedUser.email,
            parsedUser.display_name,
            parsedUser.realname,
            parsedUser.bio,
            parsedUser.image,
            parsedUser.type
        );
    }
    else
        current_user = new profile(null, null, null, null, null, null);
    if (current_user.display_name)
        change_name(current_user.display_name);
    if (current_user.image)
        update_image(current_user.image);
});

function updateUserDataInSessionStorage() {
    sessionStorage.setItem("your_profile", JSON.stringify(current_user));
}

export function updateUserProfile(newUserData) {
    current_user = new profile(
        newUserData.email,
        newUserData.display_name,
        newUserData.realname,
        newUserData.bio,
        newUserData.image,
        newUserData.type
    );
    updateUserDataInSessionStorage();
}

window.addEventListener('popstate', (event) => {
    let storedUser = sessionStorage.getItem('your_profile');
    if (storedUser) {
        let parsedUser = JSON.parse(storedUser);
        current_user = new profile(
            parsedUser.email,
            parsedUser.display_name,
            parsedUser.realname,
            parsedUser.bio,
            parsedUser.image,
            parsedUser.type
        );
        if (current_user.display_name) {
            change_name(current_user.display_name);
        }
        if (current_user.image) {
            update_image(current_user.image);
        }
    }
});

export default function Modes()
{
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
            <button class="button-style" id="aiButton"><span class="text-animation">V.S._AI</span></button>
        </div>
        <div class="mode-button-container">
            <button class="button-style" id="forza4Button"><span class="text-animation">FORZA 4</span></button>
        </div>
    </div>
    <span id="avatarName">Default</span>
    <div class="avatar-container">
        <img alt="Avatar" class="avatar-image" id="avatarImage">
        <div class="menu-container hidden">
            <div class="menu-item"><img src="game_engine/images/profile.png" alt="Profile" id="profileIcon"></div>
            <div class="menu-item"><img src="game_engine/images/stats.png" alt="Settings" id="statIcon"></div>
            <div class="menu-item"><img src="game_engine/images/friends.jpg" alt="Settings" id="friends"></div>
            <div class="menu-item"><img src="game_engine/images/history_match.png" alt="Settings" id="history"></div>
            <div class="menu-item" id="settings-link"><img src="game_engine/images/settings.png" alt="Settings"></div>
            </div>
        </div> 
    `;
}

history.pushState(null, null, location.href);

export function access_denied()
{
    navigate("/access_denied", "Access Denied");
    setTimeout(() => {
        navigate("/", "home");
    }, 3000);
}

window.onpopstate = function () {
    if (location.pathname === "/")
    {
        navigate("/modes", "Modes");
        history.pushState(null, null, location.href);
    }
};

function    add_user_to_database(user)
{
    fetch("http://localhost:8008", {method: "add_user", 
    body: JSON.stringify(current_user)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}

export const addModesPageHandlers = () => {
    if (current_user)
        add_user_to_database(current_user);
    /*
    fetch("http://localhost:8008", {method: "get_user", 
    body: login_name, displayName, image, email
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        current_user = data;
    })
    */
    const classicButton = document.getElementById('classicButton');
    const aiButton = document.getElementById('aiButton');
    const tournamentButton = document.getElementById('tournamentButton');
    const forza4Button = document.getElementById('forza4Button');
    const avatarImage = document.getElementById('avatarImage');
    const menuContainer = document.querySelector('.menu-container');
    const Settings = document.getElementById('settings-link');
    
    classicButton?.addEventListener('click', () => {
        navigate("/classic", "Modalità Classic");
    });
    
    aiButton?.addEventListener('click', () => {
        navigate("/V.S._AI", "Modalità AI");
    });

    tournamentButton?.addEventListener('click', () => {
        if (current_user.type === "guest")
        {
            alert("You must be logged to use this feature!");
            return;
        }
        navigate("/tournament", "Modalità Torneo");
    });

    forza4Button?.addEventListener('click', () => {
        navigate("/forza4", "Modalità Forza 4");
    })
    avatarImage.addEventListener("click", (event) => {
        menuContainer.classList.toggle("visible");
    });

    Settings?.addEventListener('click', () => {
        navigate("/settings", "Settings");
    });
    
    // Chiusura del menu quando si clicca fuori dall'avatar o dal menu
    document.addEventListener("click", (event) => {
        // Verifica se il clic non è stato effettuato dentro l'avatar o il menu
        if (!avatarImage.contains(event.target) && !menuContainer.contains(event.target)) {
            // Se il clic è avvenuto fuori, nasconde il menu
            menuContainer.classList.remove("visible");
        }
    });
    const profileIcon = document.getElementById("profileIcon");
    if (profileIcon)
    {
        profileIcon.addEventListener("click", () => {
            navigate("/profile", "Profile");
            setTimeout(() => {
                profileHandler();
            }, 100);
        });
    }
    else
        console.error("profile icon not found!");
    const statIcon = document.getElementById("statIcon");
    if (statIcon)
    {
        statIcon.addEventListener("click", () => {
            navigate("/stats", "Stats");
            setTimeout(() => {
                ShowStats();
            }, 100);
        });
    }
    else
        console.error("stat icon not found!");
    const friends = document.getElementById("friends");
    if (friends)
    {
        friends.addEventListener("click", () => {
            if (current_user.type == "guest")
            {
                alert("You must be logged to use this feature!");
                return;
            }
            navigate("/friends", "Friends");
            setTimeout(() => {
                Friendlists();
            }, 100);
        });
    }
    else
        console.error("friend icon not found!");
    const history = document.getElementById("history");
    if (history)
    {
        history.addEventListener("click", () => {
            navigate("/history", "History");
            setTimeout(() => {
                navigate("/tournament/userstats", "Userstats");
            }, 100);
        });
    }
    else 
        console.error("history icon not found!");
};

export function update_image(image)
{
    const checkImageInterval = setInterval(() => {
        const avatarImage = document.getElementById('avatarImage');
        if (avatarImage)
        {
            avatarImage.src = image;
            clearInterval(checkImageInterval);
        }
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
    }, 100);
}