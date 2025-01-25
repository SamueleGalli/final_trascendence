import { me } from "./profile.js";
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
        <id="showname" class="editable">
        <id="showemail" class="editable">
        <id="showbio" class="editable">
        <id="showimage" class="editable">
        <button class="button-style" id="show_game_stats">show game stats</button>
        <button class="button-style" id="show_friends">show friends</button>
    </div>
    `;
}

export function ShowStats()
{
    let SEmail = document.querySelector("#showemail");
    let SName = document.querySelector("#showname");
    let SBio = document.querySelector("#showbio");
    let SImage = document.querySelector("#showimage");
    alert("good so far");
    if (me.email === null)
        SEmail.style.display = "none";
    else
        SEmail.innerText = me.email;
    SName.innerText = me.display_name;
    if (me.bio === null)
        SBio.style.display = "none";
    else
        SBio.innerText = me.email;
    SImage.innerText = me.image;
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