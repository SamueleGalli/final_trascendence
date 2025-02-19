
import { navigate } from "../main.js";
import { update_image, change_name, updateUserProfile, current_user} from "../pages/modes.js";
import { user, profile} from "./user.js";

export let popupOpened = false;
export let new_user = new user();

export function pop_false()
{
    popupOpened = false;
    localStorage.setItem('popup_opened', 'false');
}

function checkLoginRestrictions()
{
    if (localStorage.getItem('your_profile'))
    {
        alert("user already logged in");
        return false;
    }
    return true;
}

function popupHandling(popup)
{
    popupOpened = true;
    localStorage.setItem('popup_opened', 'true');

    let popupMonitor = setInterval(() => {
        if (popup.closed)
        {
            clearInterval(popupMonitor);
            localStorage.setItem('popup_opened', 'false');
            popupOpened = false;
            try
            {
                get_data();
                navigate("/modes", "Modalità di gioco");
                alert("You are logged in successfully.\nTo change user, close this tab first!");
            }
            catch (error)
            {
                console.error("Errore nel recupero dati:", error);
            }
        }
    }, 500);
}

function get_data()
{
    let startTime = performance.now();
    fetch("http://localhost:8008", {
        method: "get_user",
        body: JSON.stringify({params: { display_name: "sgalli" }})
    })
    
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok)
            throw new Error(`Errore nella risposta dal server: ${response.status}`);
        return response.text();
    })
    .then(text => {
        console.log("Raw response text:", text);
        try {
            const data = JSON.parse(text);
            console.log("Parsed data:", data);
            
            if (data.status === "no users found" || !data.user || data.user.length === 0) {
                console.log("No user found");
            } else {
                console.log("User data found", data.user);
                new_user.email = data.user[0].email;
                new_user.login_name = data.user[0].display_name;
                new_user.realname = data.user[0].realname;
                new_user.image = data.user[0].image;
                new_user.bio = data.user[0].bio;
                new_user.type = "login";
                console.log("user = ",new_user);
                change_name(new_user.login_name);
                update_image(new_user.image);
                let current_user = new profile(
                    new_user.email,
                    new_user.login_name,
                    new_user.realname,
                    new_user.bio,
                    new_user.image,
                    new_user.type
                );
                updateUserProfile(current_user);
                console.log("time elapsed: ", startTime());
            }
        } catch (error)
        {
            console.error("Errore durante il parsing dei dati:", error);
        }
    })
    .catch(error => console.error("Errore nel fetch:", error));
}

export function performLogin()
{
    if (!checkLoginRestrictions())
        return;
    fetch('/auth/login')
    .then(response => response.json())
    .then(data => {
        const popup = window.open(data.auth_url, 'Login', 'width=800,height=800');
        popupHandling(popup);
    })
    .catch(error => {
        console.error("Errore di rete:", error);
        localStorage.setItem('authenticated', 'false');
    });
}
