import { navigate } from "../js/main.js";
export let success = localStorage.getItem('authenticated') === 'true';

export function performLogin() {
    fetch('/auth/login')
        .then(response => response.json())
        .then(data => {
            const popup = window.open(data.auth_url, 'Login', 'width=600,height=400');
            window.addEventListener('message', function(event) {
                if (event.data.authenticated) {
                    success = true;
                    localStorage.setItem('authenticated', 'true'); 
                    popup.close(); 
                    navigate("/modes", "Modalità di gioco"); 
                }
                else {
                    console.log("User not logged in");
                }
            });
        })
        .catch(error => {
            console.error("Errore di rete:", error);
        });
}