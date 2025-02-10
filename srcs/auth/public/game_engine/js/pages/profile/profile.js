import { current_user, updateUserProfile} from "../modes.js";
import { emailHandler} from "../../game/pong/other/profile_logic.js";
import { profile , profiles} from "../../login/user.js";
import { savebio, saveimage, savename } from "../../game/pong/other/profile_logic.js";

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
            class="profile_form__field"
            placeholder="Insert your new name"
        />
        <span id="displayNameLabel" style="display: none;  font-weight: bold;"></span>
    </div>
    <div id="bioSection">
        <label for="bioInput" class="bio-label">Modify your bio:</label>
        <textarea
            style="font-size: 0.5em; width: 60%; height: 100px;"
            id="bioInput" 
            class="profile_form__field"
            placeholder="Insert bio here"
        ></textarea>
    </div>
    <div id="bioDisplaySection" style="display: none;">
        <h3>Your Bio:</h3>
        <p id="bioDisplay" style="white-space: pre-wrap;"></p>
    </div>
    <div id="profileImageSection">
        <h2>Profile Image</h2>
        <img 
            id="profileImage" 
            src="${current_user.image}" 
            alt="Profile Image" 
            class="profile-image"
        />
        <input 
            type="file" 
            id="imageUploadInput" 
            accept="image/*" 
            style="display: none;"
        />
        <!--<button class="button-style" id="changeProfileImageBtn">Change Image</button> -->
        <button id="save" class="button-style"><span class="text-animation">Save Changes</span></button>
        <button onclick="history.back()" class="button-style">
            <span class="text-animation">Back To Menu</span>
        </button>
    </div>
    `;
};

export let me = new profile(null, null, null, null, null, null);
function insert_user_data()
{
    me.display_name = current_user.display_name;
    me.realname = current_user.realname || null;
    me.image = current_user.image;
    me.email = current_user.email || null;
    profiles.push(me);
}

export function profileHandler()
{
    insert_user_data();
    const yourDataSection = document.querySelector('#yourData');
    fixnames(yourDataSection);
    emailHandler(me, yourDataSection);
    const save = yourDataSection.querySelector('#save');
    saveimage(me, yourDataSection);
    save.addEventListener('click', () => {
        saved(yourDataSection);
    });
}

function saved(yourDataSection)
{
    let saving = "saved image successfully\n";
    current_user.image = me.image;
    saving += savebio(me, yourDataSection);
    current_user.bio = me.bio;
    saving += savename(me, yourDataSection);
    current_user.display_name = me.display_name;
    alert(saving);
    updateUserProfile(current_user);
    history.back();
}

function fixnames(yourDataSection)
{
    yourDataSection.style.marginTop = '-20';

    let myName = yourDataSection.querySelector("#myName");
    myName.style.fontSize = "1.6em";
    myName.style.fontFamily = "'Liberty', sans-serif";
    myName.style.color = " #09a09b"; 
    let Name = `the actual name ${current_user.display_name}`;
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