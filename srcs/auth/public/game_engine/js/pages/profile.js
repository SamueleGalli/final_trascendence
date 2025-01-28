import { let_me_in } from "./login.js";
import { user } from "../login/login_logic.js";
import { guests, currentGuestId } from "../login/guest_logic.js";
import {
getCurrentGuestName, emailHandler,
displaynameHandler, bioHandler,
imageAvatarHandler, getCurrentGuestImage
} from "../login/profile_logic.js";
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
    <div class="email-container" id="emailtext">
        <label for="emailInput" class="email-label">Your email:</label>
        <input
            type="email" 
            id="emailInput" 
            class="email-input" 
            color=" #09a09b"
        />
    </div>
    <h3 id="myName">
    </h3>
    <div id="changeDisplayName">
        <label for="displayNameInput" class="display-name-label">Change your display name:</label>
        <input 
            style="font-size: 1.5em;"
            type="text" 
            id="displayNameInput" 
            class="display-name-input" 
            placeholder="Insert your new name"
        />
        <button class="button-style" id="confirmDisplayNameBtn">Confirm Name</button>
        <span id="displayNameLabel" style="display: none;  font-weight: bold;"></span>
    </div>
    <div id="bioSection">
        <label for="longbioInput" class="bio-label">Modify your bio:</label>
        <textarea
            style="font-size: 0.3em;"
            id="bioInput" 
            class="bio-input"
            placeholder="Insert bio here"
            rows="5" 
            cols="40"
        ></textarea>
        <button class="button-style" id="confirmBioBtn">Confirm Bio</button>
    </div>
    <div id="bioDisplaySection" style="display: none;">
        <h3>Your Bio:</h3>
        <p id="bioDisplay" style="white-space: pre-wrap;"></p>
    </div>
    <div id="profileImageSection">
        <h2>Profile Image</h2>
        <img 
            id="profileImage" 
            src="${user && user.image ? user.image : 
            getCurrentGuestImage(guests)}" 
            alt="Profile Image" 
            class="profile-image"
        />
        <input 
            type="file" 
            id="imageUploadInput" 
            accept="image/*" 
            style="display: none;"
        />
        <button class="button-style" id="changeProfileImageBtn">Change Image</button>
    </div>
    `;
};

export let me;

function insert_user_data()
{
    if (let_me_in === true)
    {
        me = new profile(null, null, null, null);
        if (user.email)
            me.email = user.email;
        if (user.image)
            me.avatar = user.image;
        if (user.login_name)
            me.display_name = user.login_name;
        profiles.push(me);
        return (1);
    }
    else
    {
        me = new profile(null, null, null, null);
        const currentGuest = guests.find(guest => guest.id === currentGuestId);
        if (currentGuest)
        {
            me.display_name = currentGuest.name;
            me.image = currentGuest.image;
        }
    }
}

export function profileHandler()
{
    let logged = 0;
    if (insert_user_data())
        logged = 1;
    const yourDataSection = document.querySelector('#yourData');
    fixnames(yourDataSection);
    emailHandler(me, yourDataSection, logged);
    displaynameHandler(me, yourDataSection);
    bioHandler(me, yourDataSection);
    imageAvatarHandler(me, yourDataSection, logged);
    window.addEventListener('popstate', () => {
        if (window.location.pathname === '/profile') {
            alert("saved changed correctly updated");
        }
    });
}

function fixnames(yourDataSection)
{
    let myName = yourDataSection.querySelector("#myName");
    myName.style.fontSize = "1.6em";
    myName.style.fontFamily = "'Liberty', sans-serif";
    let Name = `the actual name ${
        user && user.login_name ? user.login_name :
        (guests.length > 0 && getCurrentGuestName(guests))
        }`;
    myName.innerText = Name;
    let display_name = yourDataSection.querySelector("#changeDisplayName");
    display_name.style.color =" #09a09b"
    display_name.style.fontSize = "2em";
    display_name.style.fontFamily = "'Liberty', sans-serif";
    let myBio = yourDataSection.querySelector("#bioSection");
    myBio.style.fontSize = "5em";
    myBio.style.fontFamily = "'Liberty', sans-serif";
    myBio.style.color =" #09a09b"
    let myImage = yourDataSection.querySelector("#profileImageSection");
    myImage.style.fontSize = "1.6em";
    myImage.style.fontFamily = "'Liberty', sans-serif";
    myImage.style.color =" #09a09b"
    let emailtext = yourDataSection.querySelector("#emailtext");
    emailtext.style.fontSize = "2em";
    emailtext.style.fontFamily = "'Liberty', sans-serif";
    emailtext.style.color =" #09a09b"
}