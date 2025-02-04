import { navigate } from "../main.js";
import { update_image, change_name, current_user, updateUserProfile } from "../pages/modes.js";
import { Logged} from "./user.js";

let success = false;
let isCurrentTabLogged = false;
let auth = false;
export let popupOpened = false;
export let user;

window.addEventListener('load', () => {
    success = false;
    isCurrentTabLogged = false;
    auth = false;
    popupOpened = false;
    if (!localStorage.getItem('authenticated_tab_id'))
    {
        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem('open_tabs_count', '1');
    }
    else
    {
        let openTabsCount = parseInt(localStorage.getItem('open_tabs_count') || '0');
        localStorage.setItem('open_tabs_count', (openTabsCount + 1).toString());
    }
});

const TAB_ID = generateTabId();

function generateTabId() {
    const randomPart = Math.random().toString(36).substring(2, 11);
    return `${Date.now()}-${randomPart}`;
}

function isAnotherTabLoggedIn() {
    const authenticatedTabId = localStorage.getItem('authenticated_tab_id');
    return authenticatedTabId && authenticatedTabId !== TAB_ID && localStorage.getItem('authenticated') === 'true';
}



function setTabAuthenticationState(isAuthenticated) {
    if (isAuthenticated)
        localStorage.setItem('authenticated_tab_id', TAB_ID);
    else
    {
        const authenticatedTabId = localStorage.getItem('authenticated_tab_id');
        if (authenticatedTabId === TAB_ID)
            localStorage.removeItem('authenticated_tab_id');
    }
}

function checkLoginRestrictions() {
    if (isAnotherTabLoggedIn()) {
        alert('You are already logged in from another tab. Please close it to log in here.');
        return false;
    }
    return true;
}

window.addEventListener('storage', (event) => {
    if (event.key === 'authenticated_tab_id') {
        syncState();
        if (isAnotherTabLoggedIn()) {
            alert('You are already logged in from another tab.');
        }
    }
    if (event.key === 'open_tabs_count') {
        const openTabsCount = parseInt(event.newValue || '0');
        if (openTabsCount === 0) {
            resetGlobalState();
        }
    }
});

function resetGlobalState()
{
    success = false;
    isCurrentTabLogged = false;
    auth = false;
    sessionStorage.clear();
    localStorage.clear();
}

window.addEventListener('beforeunload', () => {
    if (localStorage.getItem('authenticated_tab_id') === TAB_ID)
    {
        localStorage.removeItem('authenticated_tab_id');
        setTabAuthenticationState(false);
    }
    let openTabsCount = parseInt(localStorage.getItem('open_tabs_count') || '0');
    openTabsCount = Math.max(0, openTabsCount - 1);

    if (openTabsCount === 0)
        resetGlobalState();
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

function syncState() {
    success = localStorage.getItem('authenticated') === 'true';
    isCurrentTabLogged = sessionStorage.getItem('tab_authenticated') === 'true';
    popupOpened = localStorage.getItem('popup_opened') === 'true';
    auth = localStorage.getItem('auth_done') === 'true';
}

window.addEventListener('unload', () => {
    if (!isCurrentTabLogged || auth === false)
        return;
    if (isCurrentTabLogged)
    {
        localStorage.setItem('authenticated', 'false');
        localStorage.setItem('auth_done', 'true');
    }
    sessionStorage.setItem('tab_authenticated', 'false');
    sessionStorage.removeItem('popup_opened');
});

function already_logged() {
    if (popupOpened && !auth) {
        alert("Authenticating in progress....\nPlease wait.");
        return true;
    }
    return false;
}

function popupHandling(popup) {
    let popupMonitor;
    popupOpened = true;
    localStorage.setItem('popup_opened', 'true');
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
    setTabAuthenticationState(true);
    localStorage.setItem('authenticated_tab_id', TAB_ID);
    popup.close();
    localStorage.setItem('popup_opened', 'false');
    popupOpened = false;
    success = true;
    auth = true;
    navigate("/modes", "Modalità di gioco");
    localStorage.setItem('auth_done', 'true');
}


function get_data(event) {
    if (event.data.authenticated && event.data.user)
    {
        user = new Logged(
            event.data.user.image,
            event.data.user.name,
            event.data.user.login_name,
            event.data.user.email
        );
        change_name(user.login_name);
        update_image(user.image);
        current_user.image = user.image;
        current_user.display_name = user.login_name;
        current_user.type = "login";
        current_user.email = user.email;
        current_user.realname = user.name;
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
            alert("You are logged in successfully. To change user, close this tab first!");
            window.removeEventListener('message', messageListener);
        }
    };
    window.addEventListener('message', messageListener);
}

export function performLogin() {
    syncState();
    if (!checkLoginRestrictions())
        return;
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