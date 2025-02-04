import { current_user } from "../pages/modes.js";

export function savebio(me, yourDataSection)
{
    const bioInput = yourDataSection.querySelector('#bioInput');
    const bioDisplay = document.querySelector('#bioDisplay');
    const newBio = bioInput.value;

    let polbio = yourDataSection.querySelector('#bioSection');
    polbio.style.width = "50%";

    if (!newBio)
        return ("Error: No Bio saved(Please enter a bio)\n");
    if (newBio.length >= 400)
        return ("Error: Bio too big\n");
    me.bio = JSON.stringify(newBio);
    return("saved bio successfully\n");
}


export function savename(me, yourDataSection)
{
    const changeName = yourDataSection.querySelector('#displayNameInput');
    const newname = changeName.value;
    
    let polname = yourDataSection.querySelector('#changeDisplayName');
    polname.style.width = "50%";
    
    if (!newname)
        return("Error: No Name saved(Please enter a name)\n");
    if (newname.length < 4)
        return("Error: Name too short(" + me.display_name + ")\n");
    if (newname.length >= 15)
        return("Error: Name too long(" + me.display_name + ")\n");
    if (me.display_name !== newname)
    {
        me.display_name = newname;
        return ("Saved name successfully(" + me.display_name + ")\n");
    }
    else
        return ("Error: name already taken(" + me.display_name + ")\n");
}

export function emailHandler(me, yourDataSection)
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


export function saveimage(me, yourDataSection)
{
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
            if (!file.type.startsWith('image/'))
            {
                alert("Error: Please select a valid image file.\n");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = e.target.result;
                me.image = newImage;
                profileImage.src = newImage;
            };
            reader.readAsDataURL(file);
        }
        else
        {
            alert("Error: No file selected.");
            return;
        }
    });
}