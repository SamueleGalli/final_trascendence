import { user } from "../../login/login_logic.js";
import { guests } from "../../login/guest_logic.js";
import { profile, profiles } from "../../login/user.js";

export let me;

const Profile = () => {
    document.addEventListener('DOMContentLoaded', function () {
        your_profile();
    });

    return `
    <h1 class="text">
        <span class="letter letter-1">Y</span>
        <span class="letter letter-2">O</span>
        <span class="letter letter-3">U</span>
        <span class="letter letter-4">R</span>
        <span class="letter letter-5">_</span>
        <span class="letter letter-6">P</span>
        <span class="letter letter-7">R</span>
        <span class="letter letter-8">O</span>
        <span class="letter letter-9">F</span>
        <span class="letter letter-10">I</span>
        <span class="letter letter-11">L</span>
        <span class="letter letter-12">E</span>
    </h1>
    <div id="yourData">
        <label for="emailInput" class="email-label">Inserisci la tua email:</label>
        <input 
        type="email" 
        id="emailInput" 
        class="email-input" 
        placeholder="tuonome@esempio.com" 
        required 
        />
        <button id="confirmEmailBtn">Conferma Email</button>

        <div id="changeDisplayName">
            <label for="displayNameInput" class="display-name-label">Modifica il tuo nome di visualizzazione:</label>
            <input 
            type="text" 
            id="displayNameInput" 
            class="display-name-input" 
            placeholder="Inserisci il tuo nome"
            />
            <button id="confirmDisplayNameBtn">Conferma Nome</button>
        </div>

        <div id="bioSection">
            <label for="bioInput" class="bio-label">Modifica la tua bio:</label>
            <textarea 
            id="bioInput" 
            class="bio-input" 
            placeholder="Scrivi qualcosa su di te..."
            ></textarea>
            <button id="confirmBioBtn">Conferma Bio</button>
        </div>

        <div id="box1" class="box">
            <!-- Quadrato vuoto 1 -->
            <p>Quadrato 1</p>
        </div>

        <div id="box2" class="box">
            <!-- Quadrato vuoto 2 -->
            <p>Quadrato 2</p>
        </div>

        <div id="profileImageSection">
            <h2>Immagine del profilo</h2>
            <img 
                id="profileImage" 
                src="${user.image ? user.image : 'game_engine/images/guest.jpg'}" 
                alt="Profile Image" 
                class="profile-image"
            />
            <button id="changeProfileImageBtn">Cambia Immagine</button>
        </div>
    </div>
    `;
};

//da qui in poi non va nulla devo capire perche

function insert_user_data() {
    if (user) {
        console.log("logged");
        me = new profile(null, null, null, null);
        if (user.email) me.email = user.email;
        if (user.image) me.avatar = user.image;
        if (user.login_name) me.display_name = user.login_name;
        profiles.push(me);
    } else if (guests) {
        console.log("guest");
        me = new profile(null, null, null, null);
        const currentGuestId = sessionStorage.getItem('currentGuestId');
        const currentGuest = guests.find(guest => guest.id === currentGuestId);
        if (currentGuest) me.display_name = currentGuest.name;
    } else {
        alert("Unknown error occurred\n");
    }
}

export default Profile;

function your_profile() {
    const profileContainer = document.querySelector('#yourData');
    console.log('Rendering profile...');
    insert_user_data();

    if (me.email) {
        profileContainer.innerHTML = `
        <h1>Sei già registrato!</h1>
        <p>Il tuo indirizzo email è: <strong>${me.email}</strong></p>
        <button id="logoutButton">Esci</button>
        `;
        document.querySelector('#logoutButton').addEventListener('click', function() {
            sessionStorage.clear();
            location.reload();
        });
    } else {
        // Se l'utente non è registrato, chiediamo di inserire l'email
        profileContainer.innerHTML = `
        <h1>Benvenuto, ${me.display_name || "Ospite"}!</h1>
        <label for="emailInput" class="email-label">Inserisci la tua email:</label>
        <input 
        type="email" 
        id="emailInput" 
        class="email-input" 
        placeholder="tuonome@esempio.com" 
        required 
        />
        <button id="confirmEmailBtn">Conferma Email</button>
        `;

        const emailInput = document.querySelector('#emailInput');
        const confirmEmailBtn = document.querySelector('#confirmEmailBtn');

        if (emailInput && confirmEmailBtn) {
            confirmEmailBtn.addEventListener('click', function () {
                const email = emailInput.value;
                if (validateEmail(email)) {
                    me.email = email;
                    sendConfirmationEmail(me.email, false);
                } else {
                    alert("Per favore, inserisci un'email valida.");
                }
            });
        }
    }
}

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

async function sendConfirmationEmail(email, isLogged) {
    const message = isLogged
        ? "Grazie per esserti registrato! Il tuo profilo è stato salvato."
        : "Grazie per aver visitato il nostro sito! Il tuo profilo è temporaneo.";
    
    try {
        const response = await fetch('/send-confirmation-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message }),
        });
        
        const result = await response.json();
        if (result.success) {
            alert(`Email inviata a ${email}: ${message}`);
        } else {
            alert('Errore durante l\'invio dell\'email.');
        }
    } catch (error) {
        console.error('Errore durante l\'invio:', error);
    }
}