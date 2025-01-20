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
        me.bio = newBio;
        bioDisplay.textContent = newBio;
        bioInput.disabled = true;
        confirmBioBtn.style.display = 'none';
        bioDisplaySection.style.display = 'block';
        bioInput.style.color = 'green';
        bioInput.style.fontWeight = 'bold';
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
        if (newname !== GuestName)
        {
            alert("new name confirmed!");
            me.name = newname;
            changeName.value = newname;
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

export function emailHandler(me, yourDataSection, logged) {
    const emailInput = yourDataSection.querySelector('#emailInput');
    const confirmEmailBtn = yourDataSection.querySelector('#confirmEmailBtn');
    const responseMessage = yourDataSection.querySelector('#responseMessage');
    if (!emailInput || !confirmEmailBtn || !responseMessage) {
        console.error("One or more elements not found!");
        return;
    }
    if (logged === 1)
        {
        emailInput.value = me.email;
        emailInput.disabled = true;
        emailInput.style.color = 'green';
        confirmEmailBtn.style.display = 'none';
    } 
    else
    {
        confirmEmailBtn.addEventListener('click', () => {
            const email = emailInput.value;
            if (!email)
            {
                alert("No email inserted.");
                return;
            }

            if (validateEmail(email))
            {
                alert("Email confirmed!");
                me.email = email;
                emailInput.value = email;
                emailInput.disabled = true;
                confirmEmailBtn.style.display = 'none';
                emailInput.style.color = 'green';
                emailInput.style.fontWeight = 'bold';
                //send_verification_email(email, responseMessage);
            }
            else
            {
                alert("Invalid email format.");
                emailInput.value = '';
            }
        });
    }
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

/*function send_verification_email(email, responseMessage) {
    fetch(`/send-verification-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
    })
    .then(response => response.text())
    .then(data => {
        responseMessage.textContent = data;
        if (data.includes("success"))
            responseMessage.style.color = 'green';
        else
            responseMessage.style.color = 'red';
        document.getElementById('emailInput').disabled = true;
        document.getElementById('confirmEmailBtn').disabled = true;
    })
    .catch(error => {
        console.error("Error sending verification email:", error);
        responseMessage.textContent = "There was an error sending the email. Please try again later.";
        responseMessage.style.color = 'red';
    });
}*/