import { me } from "./profile.js";
import { guests } from "../login/guest_logic.js";
import { user } from "../login/login_logic.js";
import { getCurrentGuestImage, getCurrentGuestName } from "../login/profile_logic.js";

/*only logged
Match History
including 1v1 games
dates
and relevant details*/
export default function Stats()
{
    return `
    <h1 class="text">
    <span class="letter letter-1">Y</span>
    <span class="letter letter-2">O</span>
    <span class="letter letter-3">U</span>
    <span class="letter letter-4">R</span>
    <span class="letter letter-5"> </span>
    <span class="letter letter-6">_</span>
    <span class="letter letter-7"> </span>
    <span class="letter letter-8">S</span>
    <span class="letter letter-9">T</span>
    <span class="letter letter-10">A</span>
    <span class="letter letter-11">T</span>
    <span class="letter letter-12">S</span>
    </h1>
    <div>
        <h2>Your Name</h2>
        <div id="showname" class="editable"></div>
        <div id="showemail" class="editable"></div>
        <div id="showbio" class="editable"></div>
        <h2>Your Image</h2>
        <div id="showimage" class="editable"></div>
        <div id="realname" class="editable></div>
        <button class="button-style" id="show_game_stats">show game stats</button>
        <button class="button-style" id="show_friends">show friends</button>
    </div>
    `;
}

function update_user_guest(SEmail, SName, SBio, SImage, RealName)
{
    if (user)
    {
        SEmail.style.display = "block";
        SEmail.innerHTML = `<h2>Your Email</h2><div class="editable">${user.email}</div>`;
        SEmail.style.fontSize = "4em"; 
        SName.style.display = "block";
        SName.innerHTML = `<h2>Your Name</h2><div class="editable">${user.login_name}</div>`;
        SName.style.fontSize = "4em"; 
        SBio.innerText = "none";
        SImage.style.display = "block";
        SImage.innerHTML = `<img src="${user.image}" alt="Guest Image" style="max-width: 100px; border-radius: 50%;">`;
        RealName.style.display = "block";
        RealName.innerHTML = `<h2>Your Real Name</h2><div class="editable">${user.name}</div>`;
        RealName.style.fontSize = "4em";
    }
    else
    {
        console.log(guests);
        SEmail.style.display = "none";
        SName.style.display = "block";
        SName.style.color = "green";
        let g_name = getCurrentGuestName(guests);
        SName.innerText = g_name;
        SName.style.fontSize = "4em"; 
        SBio.style.display = "none";
        SImage.style.display = "block";
        let g_image = getCurrentGuestImage(guests);
        SImage.innerHTML = `<img src="${g_image}" alt="Guest Image" style="width: 100%; max-width: 500px; heigh: auto; border-radius: 10px 20px 30px 40px;">`;
        RealName.style.display = "none";
    }
}

export function ShowStats()
{
    let SEmail = document.querySelector("#showemail");
    let SName = document.querySelector("#showname");
    let SBio = document.querySelector("#showbio");
    let SImage = document.querySelector("#showimage");
    let RealName = document.querySelector("#realname");
    if (!me)
        update_user_guest(SEmail, SName, SBio, SImage, RealName);
    else
    {
        if (me.email.empty())
            SEmail.style.display = "none";
        else
        {
            SEmail.style.display = "block";
            SEmail.innerHTML = `<h2>Your Email</h2><div class="editable">${me.email}</div>`;
            SEmail.style.fontSize = "4em"; 
        }
        SName.style.display = "block";
        SName.innerText = me.display_name;
        SName.style.fontSize = "4em"; 
        if (me.bio === null)
            SBio.style.display = "none";
        else
        {
            SBio.style.display = "block";
            SBio.innerHTML = `<h2>Your Bio</h2><div class="editable">${me.bio}</div>`;
            SBio.style.fontSize = "4em"; 
        }
        SImage.style.display = "block";
        SImage.innerHTML = `<img src="${me.image}" alt="Guest Image" style="max-width: 100px; border: 2px solid blue;">`;
        if (user)
        {            
            RealName.style.display = "block";
            RealName.innerHTML = `<h2>Your Real Name</h2><div class="editable">${user.name}</div>`;
            RealName.style.fontSize = "4em"; 
        }
    }
    /*let game_stats = document.querySelector("#show_game_stats");
    game_stats.addEventListener("click", () =>
    {
        showGameStats();
    })
    let friends = document.querySelector("#show_friends");
    friends.addEventListener("click", () =>
    {
        ShowFriends();
    })*/
}

//function show_game_stats()