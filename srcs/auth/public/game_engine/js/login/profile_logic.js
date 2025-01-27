import { guests } from "../login/guest_logic.js";
export function getCurrentGuestName(guest_name)
{
    const currentGuestId = sessionStorage.getItem('currentGuestId');
    if (currentGuestId && Array.isArray(guest_name)) {
        const currentGuest = guest_name.find(guest => guest.id === currentGuestId);
        if (currentGuest)
            return currentGuest.name;
        else
            return 'Guest not found';
    }
    return 'Error: No guest found';
}

export function bioHandler(me, yourDataSection) {
    const bioInput = yourDataSection.querySelector('#bioInput');
    const confirmBioBtn = yourDataSection.querySelector('#confirmBioBtn');
    const bioDisplaySection = document.querySelector('#bioDisplaySection');
    const bioDisplay = document.querySelector('#bioDisplay');
    if (!bioInput || !confirmBioBtn || !bioDisplaySection || !bioDisplay) {
        console.error("One or more elements not found!");
        return;
    }
    confirmBioBtn.addEventListener('click', () => {
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
        me.bio = JSON.stringify(newBio);
        bioDisplay.textContent = JSON.stringify(newBio);
        bioInput.disabled = true;
        confirmBioBtn.style.display = 'none';
        bioDisplaySection.style.display = 'block';
        bioInput.style.color = 'green';
        bioInput.style.fontWeight = 'bold';
        alert("bio correctly inserted");
    });
}


export function displaynameHandler(me, yourDataSection)
{
    const changeName = yourDataSection.querySelector('#displayNameInput');
    const confirmName = yourDataSection.querySelector('#confirmDisplayNameBtn');
    if (!changeName || !confirmName)
    {
        console.error("One or more elements not found!");
        return;
    }
    confirmName.addEventListener('click', () => {
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
            changeName.value = '';
            return;
        }
        if (newname.length >= 15)
        {
            alert("name too long");
            changeName.value = '';
            return;
        }
        if (newname !== GuestName)
        {
            alert("new name confirmed!");
            me.display_name = JSON.stringify(newname);
            changeName.value = me.display_name;
            changeName.disabled = true;
            confirmName.style.display = 'none';
            changeName.style.color = 'green';
            changeName.style.fontWeight = 'bold';
        }
        else
        {
            alert("error inserting new name or name already taken");
            changeName.value = '';
        }
    });
}

export function emailHandler(me, yourDataSection, logged)
{
    const emailInput = yourDataSection.querySelector('#emailInput');
    const emailContainer = yourDataSection.querySelector('.email-container');
    if (!emailInput || !emailContainer)
    {
        console.error("One or more elements not found!");
        return;
    }
    if (logged === 1)
    {
        emailInput.value = me.email;
        emailInput.disabled = true;
        emailInput.style.color = 'green';
    }
    else
    {
        emailContainer.style.display = 'none';
        emailInput.style.display = 'none';
    }    
}


export function imageAvatarHandler(me, yourDataSection) {
    const changeProfileImageBtn = yourDataSection.querySelector('#changeProfileImageBtn');
    const imageUploadInput = yourDataSection.querySelector('#imageUploadInput');
    const profileImage = yourDataSection.querySelector('#profileImage');

    if (!changeProfileImageBtn || !imageUploadInput || !profileImage) {
        console.error("One or more elements not found!");
        return;
    }
    changeProfileImageBtn.addEventListener('click', () => {
        imageUploadInput.click();
    });
    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file)
        {
            const reader = new FileReader();
            reader.onload = (e) => {
                me.image = e.target.result;
                profileImage.src = e.target.result;
                alert("image correctly inserted");
                changeProfileImageBtn.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });
}