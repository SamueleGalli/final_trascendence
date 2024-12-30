import { navigate } from "../js/main.js";

let success = localStorage.getItem('authenticated') === 'true';
let one_time = localStorage.getItem('one_time') === '1' ? 1 : 0;

function syncState() {
    success = localStorage.getItem('authenticated') === 'true';
    one_time = localStorage.getItem('one_time') === '1' ? 1 : 0;
}

window.addEventListener('unload', () => {
    if (success === true) {
        updateOneTime(0);
    }
});

// Rimuovi il setInterval
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        syncState();
    }
});

export function performLogin() {
    syncState();
    if (success === true && one_time === 1) {
        alert("User already logged in. Please close the tab and click again on login.");
        return;
    }
    else if (success === true && one_time === 0)
    {
        updateOneTime(1);
        navigate("/modes", "Modalità di gioco");
        return;
    }
    fetch('/auth/login')
        .then(response => response.json())
        .then(data => {
            const popup = window.open(data.auth_url, 'Login', 'width=800,height=800');
            window.addEventListener('message', function(event) {
                if (event.data.authenticated && success === false && one_time === 0) {
                    success = true;
                    localStorage.setItem('authenticated', 'true');
                    updateOneTime(1);
                    popup.close();
                    navigate("/modes", "Modalità di gioco");
                    return;
                }
            });
        })
        .catch(error => {
            console.error("Errore di rete:", error);
            localStorage.setItem('authenticated', 'false');
        });
}

function updateOneTime(value) {
    one_time = value;
    localStorage.setItem('one_time', value === 0 ? '0' : '1');
}
