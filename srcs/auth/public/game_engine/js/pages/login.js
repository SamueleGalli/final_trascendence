import { guest_login } from "../../login/guest_logic.js";
import { performLogin, popupOpened } from "../../login/login_logic.js";

export default function Login() {
    return `
        <h1 class="text">
            <span class="letter letter-1">F</span>
            <span class="letter letter-2">T</span>
            <span class="letter letter-3">_</span>
            <span class="letter letter-4">T</span>
            <span class="letter letter-5">R</span>
            <span class="letter letter-6">A</span>
            <span class="letter letter-7">N</span>
            <span class="letter letter-8">S</span>
            <span class="letter letter-9">C</span>
            <span class="letter letter-10">E</span>
            <span class="letter letter-11">N</span>
            <span class="letter letter-12">D</span>
            <span class="letter letter-13">E</span>
            <span class="letter letter-14">N</span>
            <span class="letter letter-15">C</span>
            <span class="letter letter-16">E</span>
        </h1>
        <div id="authButtonsContainer">
            <button class="button-style" id="loginButton"><span class="text-animation">LOGIN</span></button>
            <button class="button-style" id="guestButton"><span class="text-animation">OSPITE</span></button>
        </div>
    `;
}

export let let_me_in = false

export function update_state(status)
{
    let_me_in = status;
}

export const addLoginPageHandlers = () => {
    const loginButton = document.getElementById("loginButton");
    const guestButton = document.getElementById("guestButton");

    if (loginButton && guestButton) {
        loginButton.addEventListener("click", () => {
            update_state(true);
            performLogin();
        });
        guestButton.addEventListener("click", () => {
            if (popupOpened === true)
                alert("Authenticating in progress....\nPlease wait.");
            else
            {
                update_state(false);
                guest_login();
            }
        });
    }
};
