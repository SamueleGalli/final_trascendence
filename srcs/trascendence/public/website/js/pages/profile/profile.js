import { current_user, updateUserProfile } from "../modes.js";
import { emailHandler } from "../../game/pong/other/profile_logic.js";
import { profile, profiles } from "../../login/user.js";
import { savebio, saveimage, savename } from "../../game/pong/other/profile_logic.js";

export default function Profile() {
  return `
    <div class="profile-page">
      <div class="profile-card">
        <!-- Immagine cliccabile -->
        <div id="profileImageSection" class="profile-image-container">
          <img id="profileImage" src="null" alt="Profile Image">
          <input type="file" id="imageUploadInput" accept="image/*">
        </div>
        <!-- Informazioni -->
        <section id="yourData" class="profile-info">
          <h3 id="myName"></h3>
          <div id="changeDisplayName" class="form-group display-name-group">
            <label for="displayNameInput">Change your display name:</label>
            <input type="text" id="displayNameInput" class="input-field" autocomplete="off" placeholder="Insert your new name">
            <span id="displayNameLabel" style="display: none;"></span>
          </div>
          <div class="form-group" id="emailtext">
            <label for="emailInput" class="email-label">Your email:</label>
            <input type="email" id="emailInput" class="input-field" autocomplete="off" placeholder="Enter your email">
          </div>
          <div id="bioSection" class="form-group bio-group">
            <label for="bioInput">Modify your bio:</label>
            <textarea id="bioInput" class="input-field" autocomplete="off" placeholder="Insert bio here"></textarea>
          </div>
        </section>
      </div>
      <div class="profile-actions">
        <button id="save" class="button-style">Save Changes</button>
        <button id="back" class="button-style" onclick="history.back()">Back To Menu</button>
      </div>
    </div>
  `;
}

export let me = new profile(null, null, null, null, null, null);

function insert_user_data() {
  me.display_name = current_user.display_name;
  me.realname = current_user.realname || null;
  me.image = current_user.image;
  me.email = current_user.email || null;
  me.bio = current_user.bio || "";
  profiles.push(me);
}

export function profileHandler() {
  if (current_user === null) {
    access_denied();
    return;
  }
  insert_user_data();
  document.querySelector("#profileImage").src = me.image;
  document.getElementById("imageUploadInput").style.display = "none";
  
  // Seleziono l'intera scheda e, all'interno, la sezione delle informazioni
  const card = document.querySelector(".profile-card");
  const infoContainer = card.querySelector("#yourData");

  updateDisplayNames(infoContainer);
  emailHandler(me, infoContainer);
  
  // Pre-compila il campo bio se già salvato
  const bioInput = infoContainer.querySelector("#bioInput");
  bioInput.value = me.bio;
  
  const save = document.querySelector("#save");
  saveimage(me, card);
  save.addEventListener("click", () => {
    saveProfile(infoContainer);
  });
}

function saveProfile(infoContainer) {
  let saving = "saved image successfully\n";
  current_user.image = me.image;
  
  saving += savebio(me, infoContainer);
  current_user.bio = me.bio;
  
  saving += savename(me, infoContainer);
  current_user.display_name = me.display_name;
  
  // Salvataggio email
  const emailInput = infoContainer.querySelector("#emailInput");
  if (emailInput) {
    current_user.email = emailInput.value;
    me.email = emailInput.value;
    saving += "saved email successfully\n";
  } else {
    saving += "Error: Email input not found\n";
  }
  
  alert(saving);
  updateUserProfile(current_user);
  history.back();
}

function updateDisplayNames(infoContainer) {
  let myName = infoContainer.querySelector("#myName");
  myName.innerText = `the actual name ${current_user.display_name}`;
}
