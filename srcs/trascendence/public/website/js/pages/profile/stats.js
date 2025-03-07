import { profile } from "../../login/user.js";
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
        <div id="shortBio" class="editable"></div>
        <div id="youimage"><h2>Your Image</h2></div>
        <img id="showimage" alt="Profile Image" style="max-width: 200px; max-height: 200px; display: none;">
        <div id="myrealname"><h2>Your Real Name</h2></div>
        <div id="realname" class="editable"></div>
    </div>
    `;
}
function handle_bio(littlebio, mystats)
{
    littlebio.style.color = " #09a09b";
    littlebio.style.fontSize = "3em";
    let bioCleaned = mystats.bio.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    const bioLines = bioCleaned.split('\n');
    const firstThreeLines = bioLines.slice(0, 3).join('<br>');
    const bioToDisplay = bioLines.length > 3 ? firstThreeLines + "<br>..." : firstThreeLines;
    littlebio.innerHTML = `<p style="text-indent: 20px;">${bioToDisplay}</p>`;

    const showFullBioBtn = document.createElement('button');
    showFullBioBtn.innerText = "Show Full Bio";
    showFullBioBtn.classList.add("button-style");
    showFullBioBtn.style.marginTop = "10px";
    littlebio.appendChild(showFullBioBtn);

    showFullBioBtn.addEventListener('click', () => {

        littlebio.innerHTML = `<p style="text-indent: 20px;">${bioCleaned}</p>`;

        const showLessBtn = document.createElement('button');
        showLessBtn.innerText = "Show Less";
        showLessBtn.classList.add("button-style");
        showLessBtn.style.marginTop = "10px";
        littlebio.appendChild(showLessBtn);

        showFullBioBtn.remove();

        showLessBtn.addEventListener('click', () => {
            handle_bio(littlebio, mystats);
        });
    });
}

function highlight_title(mystats, user_realname)
{

    let title = document.querySelector("#title");
    let email_title = document.querySelector("#myemail");
    let rnametitle = document.querySelector("#myrealname");
    let titleimage = document.querySelector("#youimage");
    let biotitle = document.querySelector("#myBio");
    if (!mystats.bio)
        biotitle.style.display = "none";
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
    let littlebio = document.querySelector("#shortBio");
    highlight_title(mystats, mystats.realname);
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
        handle_bio(littlebio, mystats)
    SImage.src = mystats.image;
    SImage.style.display = "block";
    SImage.style.width = "150px";
    SImage.style.height = "150px";
    SImage.style.marginLeft = "auto";
    SImage.style.marginRight = "auto";
    SImage.style.position = "relative";

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