import { user } from "../login/login_logic.js";
import { guests } from "../login/guest_logic.js";
import {getCurrentGuestName, handle_profile} from "../login/profile_logic.js";
import { profile , profiles} from "../login/user.js";

export default function Profile()
{
    return `
    <h1 class="text">
        <span class="letter letter-1">Y</span>
        <span class="letter letter-2">O</span>
        <span class="letter letter-3">U</span>
        <span class="letter letter-4">R</span>
        <span class="letter letter-5"> </span>
        <span class="letter letter-6">_</span>
        <span class="letter letter-7"> </span>
        <span class="letter letter-8">P</span>
        <span class="letter letter-9">R</span>
        <span class="letter letter-10">O</span>
        <span class="letter letter-11">F</span>
        <span class="letter letter-12">I</span>
        <span class="letter letter-13">L</span>
        <span class="letter letter-14">E</span>
    </h1>
    <div id="yourData">
        <label for="emailInput" class="email-label" style="color: green;">Insert your email:</label>
        <input 
        type="email" 
        id="emailInput" 
        class="email-input" 
        placeholder="yourname@exemple.com" 
        required 
        />
        <button class="button-style" id="confirmEmailBtn">Confirm Email</button>
        <h3 style="color: green;">
        <h3 style="color: green;">
            the actual name ${
                user && user.login_name ? user.login_name :
                (guests && Array.isArray(guests) && guests.length > 0 ? getCurrentGuestName() : 'Error: Name not found')
            }
        </h3>
        <div id="changeDisplayName">
            <label for="displayNameInput" class="display-name-label" style="color: green;">Change your display name:</label>
            <input 
            type="text" 
            id="displayNameInput" 
            class="display-name-input" 
            placeholder="Insert your new name"
            />
            <button class="button-style" id="confirmDisplayNameBtn">Confirm Name</button>
        </div>

        <div id="bioSection">
            <label for="bioInput" class="bio-label" style="color: green;">Modify your bio:</label>
            <textarea 
            id="bioInput" 
            class="bio-input"
            placeholder="Insert bio here"
            ></textarea>
            <button class="button-style" id="confirmBioBtn">Confirm Bio</button>
        </div>

        <div id="profileImageSection">
            <h2 style="color: green;">Profile Image</h2>
            <img 
                id="profileImage" 
                src="${user && user.image ? user.image : 'game_engine/images/guest.jpg'}" 
                alt="Profile Image" 
                class="profile-image"
            />
            <button class="button-style" id="changeProfileImageBtn">Change Image</button>
        </div>
        <button class="button-style" id="SaveChangeButton" style="color: green;">Save Changes</button>
    </div>
    `;
};


export let me;

function insert_user_data() {
    if (user)
    {
        me = new profile(null, null, null, null);
        if (user.email) me.email = user.email;
        if (user.image) me.avatar = user.image;
        if (user.login_name) me.display_name = user.login_name;
        profiles.push(me);
        return (1);
    }
    else if (guests)
    {
        me = new profile(null, null, null, null);
        const currentGuestId = sessionStorage.getItem('currentGuestId');
        const currentGuest = guests.find(guest => guest.id === currentGuestId);
        if (currentGuest) me.display_name = currentGuest.name;
    }
    else
        alert("Unknown error occurred\n");
}

export function profileHandler()
{
    let logged = 0;
    if (insert_user_data() === 1)
        logged = 1;
    const yourDataSection = document.querySelector('#yourData');
    handle_profile(me, profile, profiles, yourDataSection, logged);
}