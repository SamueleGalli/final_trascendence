import { navigate } from "../js/main.js";
import { change_name, update_image } from "../js/pages/modes.js";
import { Logged } from "./user.js";

let success = localStorage.getItem('authenticated') === 'true';
let isCurrentTabLogged = sessionStorage.getItem('tab_authenticated') === 'true';
let auth = localStorage.getItem('auth_done') === 'true';
let userDataRefreshed = false;
let popupMonitor;
export let popupOpened = localStorage.getItem('popup_opened') === 'true';

function syncState() {
    const previousState = {
        success: success,
        isCurrentTabLogged: isCurrentTabLogged,
        popupOpened: popupOpened,
        auth: auth
    };

    success = localStorage.getItem('authenticated') === 'true';
    isCurrentTabLogged = sessionStorage.getItem('tab_authenticated') === 'true';
    popupOpened = localStorage.getItem('popup_opened') === 'true';
    auth = localStorage.getItem('auth_done') === 'true';

    if (JSON.stringify(previousState) === JSON.stringify({
        success, isCurrentTabLogged, popupOpened, auth
    })) {
        return;
    }
}


function refreshUserData() {
    if (userDataRefreshed)
        return;
    userDataRefreshed = true;

    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData)
    {
        change_name(userData.login_name);
        update_image(userData.image);
    }
}

window.addEventListener('popstate', () => {
    userDataRefreshed = false;
    refreshUserData();
});

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
    syncState();

    if (isCurrentTabLogged)
    {
        isCurrentTabLogged = false;
        sessionStorage.setItem('tab_authenticated', 'false');
        return;
    }

    if (success && !isCurrentTabLogged) {
        alert("User already logged in from another tab. Close the other tab to continue.");
        return 1;
    }

    if (popupOpened === true && !auth) {
        alert("Authenticating in progress....\nPlease wait.");
        return 1;
    }

    return 0;
}


function popupHandling(popup) {
    localStorage.setItem('popup_opened', 'true');
    popupOpened = true;

    
    if (popupMonitor) {
        clearInterval(popupMonitor);
    }

    popupMonitor = setInterval(() => {
        if (popup.closed && auth === false) {
            clearInterval(popupMonitor); 
            localStorage.setItem('popup_opened', 'false');
            popupOpened = false;
            return;
        }
    }, 500);
}

function log_in(popup, success, isCurrentTabLogged, event) {

    localStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('tab_authenticated', 'true');
    popup.close();
    navigate("/modes", "Modalità di gioco");
    localStorage.setItem('auth_done', 'true');
}

function get_data(event) {
    let user;

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

export function performLogin() {
    syncState();
    if (already_logged() == 1)  
        return;

    fetch('/auth/login')
    .then(response => response.json())
    .then(data => {
        if (auth === true) {
            const userData = JSON.parse(localStorage.getItem('user_data'));
            const user = new Logged(
                userData.image, 
                userData.name, 
                userData.login_name, 
                userData.email
            );
            change_name(user.login_name);
            update_image(user.image);
            localStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('tab_authenticated', 'true');
            navigate("/modes", "Modalità di gioco");
            return;
        }

        const popup = window.open(data.auth_url, 'Login', 'width=800,height=800');
        popupHandling(popup);

        const messageListener = (event) => {
            if (event.origin !== window.location.origin) {
                console.error('Messaggio ricevuto da una origine non valida');
                return;
            }           
            if (event.data.authenticated && !success) {
                get_data(event);
                log_in(popup, success, isCurrentTabLogged, event);
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
