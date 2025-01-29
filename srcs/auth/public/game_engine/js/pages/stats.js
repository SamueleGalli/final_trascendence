import { getCurrentGuestName, getCurrentGuestImage } from "../login/profile_logic.js";
import { me } from "../pages/profile.js";
import { user } from "../login/login_logic.js";
import { guests } from "../login/guest_logic.js";

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
        <div id="showbio" class="editable"></div>
        <div id="youimage"><h2>Your Image</h2></div>
        <img id="showimage" alt="Profile Image" style="max-width: 200px; max-height: 200px; display: none;">
        <div id="myrealname"><h2>Your Real Name</h2></div>
        <div id="realname" class="editable"></div>
    </div>
    `;
}

function user_data(SEmail, SName, SBio, SImage, RealName)
{
    statsContainer.style.width = "100%"
    SEmail.style.display = "block";
    SEmail.innerText = user.email;
    SEmail.style.fontSize = "4em";
    SName.style.display = "block";
    SName.innerText = user.login_name;
    SName.style.fontSize = "4em"; 
    SBio.style.display = "none";
    SImage.style.display = "block";
    const imageElement = document.getElementById("showimage");
    imageElement.src = user.image;
    imageElement.style.display = "block";
    RealName.style.display = "block";
    RealName.innerText = user.name;
    RealName.style.fontSize = "4em";
    let user_data = [SEmail, SName, RealName];
    user_data.forEach(el => el.style.color = " #09a09b");
}

function update_user_guest(SEmail, SName, SBio, SImage, RealName)
{
    if (user)
        user_data(SEmail, SName, SBio, SImage, RealName);
    else
    {
        SEmail.style.display = "none";
        SName.style.display = "block";
        SName.style.color = " #09a09b";
        SName.innerText = getCurrentGuestName(guests);
        SName.style.fontSize = "4em";
        SName.style.color = " #09a09b";
        SBio.style.display = "none";
        SImage.style.display = "block";
        const imageElement = document.getElementById("showimage");
        imageElement.src = getCurrentGuestImage(guests);
        imageElement.style.display = "block";
        RealName.style.display = "none";
    }
}

function css_in_javascript(SEmail, SName, SBio, SImage, RealName)
{
    let title = document.querySelector("#title");
    let Yimage = document.querySelector("#youimage");
    let gamestats = document.querySelector("#show_game_stats");
    let friends = document.querySelector("#show_friends");
    let elements = [SEmail, SName, SBio, SImage,
    RealName, title, Yimage, gamestats, friends];
    elements.forEach(el => el.style.color = " #09a09b");
    title.style.fontSize = "1.5em";
    Yimage.style.fontSize = "2em";
    gamestats.style.fontSize = "2em";
    friends.style.fontSize = "2em";
}

export function ShowStats()
{
    let SEmail = document.querySelector("#showemail");
    let SName = document.querySelector("#showname");
    let SBio = document.querySelector("#showbio");
    let SImage = document.querySelector("#showimage");
    let RealName = document.querySelector("#myrealname");
    css_in_javascript(SEmail, SName, SBio, SImage, RealName);
    if (!me)
        update_user_guest(SEmail, SName, SBio, SImage, RealName);
    else
    {
        if (!me.email || me.email.trim() === "")
            SEmail.style.display = "none";
        else
        {
            SEmail.style.display = "block";
            SEmail.innerText = me.email;
        }
        SName.style.display = "block";
        SName.innerText = me.display_name;
        if (!me.bio)
            SBio.style.display = "none";
        else
        {
            SBio.style.display = "block";
            SBio.innerText = me.bio;
        }
        SImage.style.display = "block";
        SImage.innerText = me.image;
        if (user)
        {            
            RealName.style.display = "block";
            RealName.innerText =user.name;
        }
    }
}