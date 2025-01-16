import { navigate } from "../js/main.js";
import { let_me_in } from "../js/pages/login.js";
import { change_name, update_image } from "../js/pages/modes.js";
import { Logged } from "./user.js";

console.log("Valore popup_opened all'inizio:", localStorage.getItem('popup_opened'));

let success = localStorage.getItem('authenticated') === 'true';
let isCurrentTabLogged = sessionStorage.getItem('tab_authenticated') === 'true';
let auth = localStorage.getItem('auth_done') === 'true';
let userDataRefreshed = false;
export let popupOpened = localStorage.getItem('popup_opened') === 'true';
export let user;

window.addEventListener('beforeunload', () => {
    let openTabsCount = parseInt(localStorage.getItem('open_tabs_count') || '0');

    openTabsCount--;
    if (openTabsCount <= 0)
    {
        sessionStorage.clear();
        localStorage.clear();
    }
    else
        localStorage.setItem('open_tabs_count', openTabsCount.toString());
});

if (localStorage.getItem('open_tabs_count') === null)
    localStorage.setItem('open_tabs_count', '1');
else
{
    let openTabsCount = parseInt(localStorage.getItem('open_tabs_count') || '0');
    localStorage.setItem('open_tabs_count', (openTabsCount + 1).toString());
}


window.addEventListener('popstate', () => {
    if (let_me_in === true)
    {
        userDataRefreshed = false;
        refreshUserData();
    }
});

window.addEventListener('storage', (event) => {
    if (event.key === 'authenticated') {
        syncState();
        if (event.newValue === 'true' && !isCurrentTabLogged)
            alert("User already logged in from another tab. close the authenticated tab to login again");
    }
});

function syncState() {
    success = localStorage.getItem('authenticated') === 'true';
    isCurrentTabLogged = sessionStorage.getItem('tab_authenticated') === 'true';
    popupOpened = localStorage.getItem('popup_opened') === 'true';
    auth = localStorage.getItem('auth_done') === 'true';
}

function refreshUserData() {
    if (userDataRefreshed)
        return;
    userDataRefreshed = true;
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData) {
        change_name(userData.login_name);
        update_image(userData.image);
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        syncState();
        refreshUserData();
    }
});

window.addEventListener('unload', () => {
    if (!isCurrentTabLogged || auth === false)
        return;
    if (isCurrentTabLogged) {
        localStorage.setItem('authenticated', 'false');
        localStorage.setItem('auth_done', 'true');
    }
    sessionStorage.setItem('tab_authenticated', 'false');
    sessionStorage.removeItem('popup_opened');
});

function already_logged() {
    if (success && !isCurrentTabLogged)
    {
        alert("User already logged in from another tab. Close the other tab to continue.");
        return true;
    }
    if (popupOpened && !auth)
    {
        alert("Authenticating in progress....\nPlease wait.");
        return true;
    }
    return false;
}

function popupHandling(popup) {
    let popupMonitor;
    if (localStorage.getItem('popup_opened') !== 'true') {
        localStorage.setItem('popup_opened', 'true');
        popupOpened = true;
    }
    if (popupMonitor)
        clearInterval(popupMonitor);
    popupMonitor = setInterval(() => {
        if (popup.closed && auth === false) {
            clearInterval(popupMonitor);
            localStorage.setItem('popup_opened', 'false');
            popupOpened = false;
            return;
        }
    }, 500);
}



function log_in(popup) {
    localStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('tab_authenticated', 'true');
    popup.close();
    navigate("/modes", "Modalità di gioco");
    localStorage.setItem('auth_done', 'true');
}

function get_data(event) {

    if (event.data.authenticated && event.data.user) {
        user = new Logged(
            event.data.user.image,
            event.data.user.name,
            event.data.user.login_name,
            event.data.user.email
        );
    }

    if (user) {
        localStorage.setItem('user_data', JSON.stringify(user));
        refreshUserData();
    }
}

function logging(authData) {
    const popup = window.open(authData.auth_url, 'Login', 'width=800,height=800');
    popupHandling(popup);

    const messageListener = (event) => {
        if (event.origin !== window.location.origin) {
            console.error('Messaggio ricevuto da una origine non valida');
            return;
        }

        if (event.data.authenticated && !success) {
            get_data(event);
            log_in(popup);
            alert("(you are logged successfully if you want to change user you need to close this tab first!)");
            window.removeEventListener('message', messageListener);
        }
    };
    window.addEventListener('message', messageListener);
}

export function performLogin() {
    syncState();
    if (already_logged())
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
