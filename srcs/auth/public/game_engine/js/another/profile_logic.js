import { guests } from "../login/guest_logic.js";
import { current_user } from "../pages/modes.js";

export function bioHandler(me, yourDataSection)
{
    const bioInput = yourDataSection.querySelector('#bioInput');
    const bioDisplaySection = document.querySelector('#bioDisplaySection');
    const bioDisplay = document.querySelector('#bioDisplay');
    const newBio = bioInput.value;
    if (!newBio)
    {
        alert("Please enter a bio.");
        return;
    }
    if (newBio.length >= 400)
    {
        alert("bio too big");
        return;
    }
    alert("bio correctly inserted");
    me.bio = JSON.stringify(newBio);
    bioDisplay.textContent = me.bio.slice(1, -1);
}


export function displaynameHandler(me, yourDataSection)
{
    const changeName = yourDataSection.querySelector('#displayNameInput');
        const newname = changeName.value;
        if (!newname)
        {
            alert("Please enter a name.");
            return;
        }
        const GuestName = getCurrentGuestName(guests);
        if (newname.length < 4)
        {
            alert("Name too short.");
            return;
        }
        if (newname.length >= 15)
        {
            alert("name too long");
            return;
        }
        if (newname !== GuestName && newname != me.display_name)
        {
            alert("new name confirmed!");
            me.display_name = newname;
            changeName.value = me.display_name;
        }
        else
            alert("error inserting new name or name already taken");
}

export function emailHandler(me, yourDataSection, logged)
{
    const emailInput = yourDataSection.querySelector('#emailInput');
    const emailContainer = yourDataSection.querySelector('.email-container');
    if (current_user.type === "login")
    {
        emailInput.value = me.email;
        emailInput.disabled = true;
        emailInput.style.fontSize = "0.5em"; 
        emailInput.style.color =" #09a09b"
    }
    else
    {
        me.email = null;
        emailContainer.style.display = 'none';
        emailInput.style.display = 'none';
    }    
}


export function imageAvatarHandler(me, yourDataSection) {
    const changeProfileImageBtn = yourDataSection.querySelector('#changeProfileImageBtn');
    const imageUploadInput = yourDataSection.querySelector('#imageUploadInput');
    const profileImage = yourDataSection.querySelector('#profileImage');
    changeProfileImageBtn.addEventListener('click', () => {
        imageUploadInput.click();
    });
    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file)
        {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (me.image === e.target.result)
                    alert("Error same image inserted")
                else
                {
                    alert("image correctly inserted");
                    me.image = e.target.result;
                    profileImage.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}