import { navigate } from "../main.js";
import { update_image, change_name, updateUserProfile, current_user} from "../pages/modes.js";
import { user, profile} from "./user.js";

export let popupOpened = false;
export let new_user;

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

function popupHandling(popup) {
    let popupMonitor;
    popupOpened = true;
    localStorage.setItem('popup_opened', 'true');
    if (popupMonitor)
        clearInterval(popupMonitor);
    popupMonitor = setInterval(() => {
        if (popup.closed && (current_user === null || current_user === undefined))
        {
            clearInterval(popupMonitor);
            localStorage.setItem('popup_opened', 'false');
            popupOpened = false;
            return;
        }
    }, 500);
}

function log_in(popup)
{
    popup.close();
    navigate("/modes", "Modalità di gioco");
}


function get_data(event) {
    if (event.data.authenticated && event.data.user)
    {
        new_user = new user(
            event.data.user.image,
            event.data.user.name,
            event.data.user.login_name,
            event.data.user.email
        );
        change_name(new_user.login_name);
        update_image(new_user.image);
        let current_user = new profile(
            new_user.email,
            new_user.login_name,
            new_user.realname,
            new_user.bio,
            new_user.image,
            "login"
        );
        updateUserProfile(current_user);
    }
}

function logging(authData) {
    const popup = window.open(authData.auth_url, 'Login', 'width=800,height=800');
    popupHandling(popup);
    const messageListener = (event) => {
        if (event.origin !== window.location.origin)
        {
            console.error('Messaggio ricevuto da una origine non valida');
            return;
        }
        if (event.data.authenticated)
        {
            get_data(event);
            log_in(popup);
            alert("You are logged in successfully.\n To change user, close this tab first!");
            window.removeEventListener('message', messageListener);
        }
    };
    window.addEventListener('message', messageListener);
}

export function performLogin()
{
    if (!checkLoginRestrictions())
        return;
    fetch('/auth/login')
    .then(response => response.json())
    .then(data => {
        logging(data);
    })
    .catch(error => {
        console.error("Errore di rete:", error);
        localStorage.setItem('authenticated', 'false');
    });
}