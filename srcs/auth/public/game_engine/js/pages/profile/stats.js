import { profile } from "../../login/user.js";
import { show_full_bio } from "../../game/pong/other/bio_cleaner.js";
import { current_user } from "../modes.js";

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

function insert_stats(mystats, SEmail, SName, SImage, RealName)
{
    let biobutton = document.querySelector("#showBioBtn");
    highlight_title(mystats, mystats.realname, biobutton);
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

    if (mystats.realname)
    {            
        RealName.style.display = "block";
        RealName.innerText = mystats.realname;
        RealName.style.color = " #09a09b";
        RealName.style.fontSize = "3em";
    }
}

export function ShowStats()
{
    let cont_stat = document.querySelector("#stats-container");
    cont_stat.style.position = 'relative';
    cont_stat.style.top = '-200px'; 
    let mystats = new profile(null, null, null, null, null, null);
    mystats.display_name = current_user.display_name;
    mystats.realname = current_user.realname;
    mystats.image = current_user.image;
    mystats.email = current_user.email;
    mystats.bio = current_user.bio;
    let SEmail = document.querySelector("#showemail");
    let SName = document.querySelector("#showname");
    let SImage = document.querySelector("#showimage");
    let RealName = document.querySelector("#realname");
    insert_stats(mystats, SEmail, SName, SImage, RealName);
}