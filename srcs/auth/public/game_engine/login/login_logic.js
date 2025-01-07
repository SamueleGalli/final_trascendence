import { navigate } from "../js/main.js";
import { update_image } from "../js/pages/modes.js";
import { Logged } from "./user.js";

let success = localStorage.getItem('authenticated') === 'true';
let isCurrentTabLogged = sessionStorage.getItem('tab_authenticated') === 'true';
let auth = localStorage.getItem('auth_done') === 'true';
export let user;
export let popupOpened = localStorage.getItem('popup_opened') === 'true';

function syncState() {
    success = localStorage.getItem('authenticated') === 'true';
    isCurrentTabLogged = sessionStorage.getItem('tab_authenticated') === 'true';
    popupOpened = localStorage.getItem('popup_opened') === 'true';
    auth = localStorage.getItem('auth_done') === 'true';
}


document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        syncState();
    }
});

window.addEventListener('unload', () => {
    if (isCurrentTabLogged) {
        localStorage.setItem('authenticated', 'false');
        localStorage.setItem('auth_done', 'true');
    }
    sessionStorage.setItem('tab_authenticated', 'false');
    sessionStorage.removeItem('popup_opened');
});

function already_logged()
{
    syncState();
    if (isCurrentTabLogged) {
        alert("User already logged in this tab.");
        return (1);
    }
    if (success && !isCurrentTabLogged) {
        alert("User already logged in from another tab. Close the other tab to continue.");
        return (1);
    }
    if (popupOpened === true && !auth) {
        alert("Authenticating in progress....\nPlease wait.");
        return (1);
    }
    return (0);
}

function popupHandling(popup)
{
    localStorage.setItem('popup_opened', 'true');
    popupOpened = true;
    const popupMonitor = setInterval(() => {
        if (popup.closed && auth === false) {
            clearInterval(popupMonitor);
            localStorage.setItem('popup_opened', 'false');
            popupOpened = false;
            return;
        }
    }, 500);
}

function log_in(popup, success, isCurrentTabLogged, event)
{
    success = true;
    isCurrentTabLogged = true;
    /*if (event.data.authenticated && event.data.user) {
        user = new Logged(
            event.data.user.image, 
            event.data.user.name, 
            event.data.user.login_name, 
            event.data.user.email
        );
    }
    console.log("Dati utente:", user);
    console.log("Nome utente:", user.name);
    console.log("Email:", user.email);
    console.log("Login:", user.login_name);
    localStorage.setItem('user_data', JSON.stringify(user));
    */
    localStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('tab_authenticated', 'true');
    popup.close();
    navigate("/modes", "Modalità di gioco");
    /*console.log("user.name =", user.name);
    console.log("user.login_name =", user.login_name);
    console.log("user.email =", user.email);*/
    localStorage.setItem('auth_done', 'true');
    update_image('game_engine/images/rbakhaye.jpg');
}

export function performLogin() {
    syncState();
    if (already_logged() == 1)  
        return;
    fetch('/auth/login')
    .then(response => response.json())
    .then(data => {
        if (auth === true) {
            localStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('tab_authenticated', 'true');
            navigate("/modes", "Modalità di gioco");
            update_image('game_engine/images/rbakhaye.jpg');
            return;
        }
        const popup = window.open(data.auth_url, 'Login', 'width=800,height=800');  
        popupHandling(popup);
        const messageListener = (event) => {
            if (event.origin !== window.location.origin) {
                console.error('Messaggio ricevuto da una origine non valida');
                return;
            }           
            if (event.data.authenticated && !success)
            {
                log_in(popup, success, isCurrentTabLogged, event)
                window.removeEventListener('message', messageListener);
            }
        };

        window.addEventListener('message', messageListener);
    })
    .catch(error => {
        console.error("Errore di rete:", error);
        localStorage.setItem('authenticated', 'false');
    });
}
