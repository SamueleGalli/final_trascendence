import { me } from "../pages/profile.js";
import { user } from "../login/login_logic.js";
import { guests, currentGuestId} from "../login/guest_logic.js";
import { profile } from "../login/user.js";
import { show_full_bio } from "../another/bio_cleaner.js";

export default function Stats()
{
    return `
    <h1 class="text">
        <span class="letter">Y</span>
        <span class="letter">O</span>
        <span class="letter">U</span>
        <span class="letter">R</span>
        <span class="letter"> </span>
        <span class="letter">S</span>
        <span class="letter">T</span>
        <span class="letter">A</span>
        <span class="letter">T</span>
        <span class="letter">S</span>
    </h1>
    <div id="stats-container">
        <div id="title"><h2>Your Name</h2></div>
        <div id="showname" class="editable"></div>
        <div id="myemail"><h2>Your Email</h2></div>
        <div id="showemail" class="editable"></div>
        <div id="myBio"><h2>Your Bio</h2></div>
        <button id="showBioBtn" class="button-style">Show Full Bio</button>
        <div id="youimage"><h2>Your Image</h2></div>
        <img id="showimage" alt="Profile Image" style="max-width: 200px; max-height: 200px; display: none;">
        <div id="myrealname"><h2>Your Real Name</h2></div>
        <div id="realname" class="editable"></div>
    </div>
    `;
}

function highlight_title(mystats, user_realname, biobutton)
{
    let title = document.querySelector("#title");
    let email_title = document.querySelector("#myemail");
    let rnametitle = document.querySelector("#myrealname");
    let titleimage = document.querySelector("#youimage");
    let biotitle = document.querySelector("#myBio");
    if (!mystats.bio)
    {
        biobutton.style.display = "none";
        biotitle.style.display = "none";
    }
    if (!mystats.email)
        email_title.style.display = "none";
    if (!user_realname)
        rnametitle.style.display = "none";
    let elements = [title, email_title, rnametitle, titleimage, biotitle];
    elements.forEach(el => {
        if (el)
        {
            el.style.color = " #09a09b";
            el.style.fontSize = "1.5em";
        }
    });
}

function insert_stats(mystats, user_realname, SEmail, SName, SImage, RealName)
{
    let biobutton = document.querySelector("#showBioBtn");
    highlight_title(mystats, user_realname, biobutton);
    if (!mystats.email)
        SEmail.style.display = "none";
    else
    {
        SEmail.style.display = "block";
        SEmail.innerText = mystats.email;
        SEmail.style.color = " #09a09b";
        SEmail.style.fontSize = "3em"; 
    }
    SName.style.display = "block";
    SName.innerText = mystats.display_name;
    SName.style.color = " #09a09b";
    SName.style.fontSize = "3em";
    if (mystats.bio)
        show_full_bio(mystats.bio, biobutton);
    SImage.src = mystats.image;
    SImage.style.display = "block";
    SImage.style.width = "150px";
    SImage.style.height = "150px";

    if (user_realname)
    {            
        RealName.style.display = "block";
        RealName.innerText = user_realname;
        RealName.style.color = " #09a09b";
        RealName.style.fontSize = "3em";
    }
}

export function ShowStats()
{
    let cont_stat = document.querySelector("#stats-container");
    cont_stat.style.position = 'relative';
    cont_stat.style.top = '-200px'; 
    let mystats = new profile(null, null, null, null, null);
    let user_realname;
    if (user)
    {
        mystats.display_name = user.login_name;
        user_realname = user.name;
        mystats.email = user.email;
        if (me)
            mystats.bio = me.bio;
        else
            mystats.bio = null;
        mystats.email = user.email;
        mystats.image = user.image;
    }
    else
    {
        if (guests)
        {
            const currentGuest = guests.find(guest => guest.id === currentGuestId);
            if (me)
                mystats.bio = me.bio;
            else
                mystats.bio = null;
            mystats.display_name = currentGuest.name;
            mystats.image = currentGuest.image;
        }
    }
    let SEmail = document.querySelector("#showemail");
    let SName = document.querySelector("#showname");
    let SImage = document.querySelector("#showimage");
    let RealName = document.querySelector("#realname");
    insert_stats(mystats, user_realname, SEmail, SName, SImage, RealName);
}