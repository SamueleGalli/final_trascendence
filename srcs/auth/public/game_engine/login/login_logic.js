import { navigate } from "../js/main.js";
import { update_image } from "../js/pages/modes.js";

let success = localStorage.getItem('authenticated') === 'true';
let isCurrentTabLogged = sessionStorage.getItem('tab_authenticated') === 'true';
export let popupOpened = localStorage.getItem('popup_opened') === 'true';
let auth = localStorage.getItem('auth_done') === 'true';

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
        localStorage.setItem('popup_opened', 'true');
        const popup = window.open(data.auth_url, 'Login', 'width=800,height=800');
        
        const popupMonitor = setInterval(() => {
            if (popup.closed && auth === false) {
                clearInterval(popupMonitor);
                localStorage.setItem('popup_opened', 'false'); // Reset popup_opened
            }
        }, 500);

        const messageListener = (event) => {
            if (event.data.authenticated && !success) {
                success = true;
                isCurrentTabLogged = true;
                localStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('tab_authenticated', 'true');
                popup.close();
                navigate("/modes", "Modalità di gioco");
                update_image('game_engine/images/rbakhaye.jpg');
                localStorage.setItem('auth_done', 'true');
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
