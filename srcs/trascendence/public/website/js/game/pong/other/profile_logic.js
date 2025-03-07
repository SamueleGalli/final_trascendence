import { current_user } from "../../../pages/modes.js";

export function savebio(me, yourDataSection)
{
    const bioInput = yourDataSection.querySelector('#bioInput');
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
        return("Error: Name too short(" + newname + ")\n");
    if (newname.length >= 15)
        return("Error: Name too long(" + newname + ")\n");
    if (me.display_name !== newname)
    {
        me.display_name = newname;
        return ("Saved name successfully(" + newname + ")\n");
    }
    else
        return ("Error: name already taken(" + newname + ")\n");
}

export function emailHandler(me, yourDataSection) {
    const emailInput = yourDataSection.querySelector('#emailInput');

    emailInput.value = me.email || "";
    emailInput.disabled = false;
    emailInput.style.fontSize = "1em";
}

export function saveimage(me, yourDataSection)
{
    //const changeProfileImageBtn = yourDataSection.querySelector('#changeProfileImageBtn');
    const imageUploadInput = yourDataSection.querySelector('#imageUploadInput');
    const profileImage = yourDataSection.querySelector('#profileImage');
    
    profileImage.addEventListener('click', () => {
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