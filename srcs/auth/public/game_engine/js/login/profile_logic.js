export function getCurrentGuestName(guests) {
    const currentGuestId = sessionStorage.getItem('currentGuestId');
    if (currentGuestId && Array.isArray(guests)) {
        const currentGuest = guests.find(guest => guest.id === currentGuestId);
        return currentGuest ? currentGuest.name : 'Guest not found';
    }
    return 'Error: No guest found';
}

export function handle_profile(me, profile, profiles, yourDataSection, logged)
{
    if (emailHandler(me, profile, profiles, yourDataSection, logged) === 1)
        alert("invalid email");
    if (displaynameHandler(me, profile, profiles, yourDataSection, logged) === 1)
        alert("invalid display name");
    if (bioHandler(me, profile, profiles, yourDataSection, logged) === 1)
        alert("invalid bio");
    if (imageAvatarHandler(me, profile, profiles, yourDataSection, logged) === 1)
        alert("invalid image");
    else
        alert("unknown error occured");
}

function emailHandler(me, profile, profiles, yourDataSection, logged) {
    console.log("email checker");
    const emailInput = yourDataSection.querySelector('#emailInput');
    const confirmEmailBtn = yourDataSection.querySelector('#confirmEmailBtn');
    if (!emailInput || !confirmEmailBtn) {
        console.error("One or more elements not found!");
        return;
    }

    if (logged === 1)
    {
        emailInput.value = me.email;
        emailInput.disabled = true;
        confirmEmailBtn.style.display = 'none';
    }
    else
    {
        confirmEmailBtn.addEventListener('click', () => {
            const email = emailInput.value;
            if (validateEmail(email))
            {
                alert("Email confirmed!");
                me.email = email;
                emailInput.value = '';
            }
            else
                alert("Invalid email format.");
        });
    }
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}