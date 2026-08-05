console.log("homepage.js updated 8/04/26 22:01");
let homepageCharacters = [];
/* ==========================================
   Load Characters
========================================== */
async function loadHomepageCharacters(){
    const response =
        await fetch("/data/characters.json");
    if(!response.ok){
        throw new Error(
            "Failed to load characters.json"
        );
    }
    const data =
        await response.json();
    homepageCharacters =
        Object.values(data);
    console.log(
        "Loaded homepage characters:",
        homepageCharacters.length
    );
}
/* ==========================================
   Random Character
========================================== */
function showRandomCharacter(){
    if(!homepageCharacters.length){
        return;
    }
    const character =
        homepageCharacters[
            Math.floor(
                Math.random() *
                homepageCharacters.length
            )
        ];
    document.getElementById(
        "tokenImage"
    ).src =
        character.image;
    document.getElementById(
        "tokenImage"
    ).alt =
        character.name;
    document.getElementById(
        "tokenName"
    ).textContent =
        character.name;
    document.getElementById(
        "interactionCharacter"
    ).textContent =
        character.name;
    document.getElementById(
        "interactionTeam"
    ).textContent =
        character.team || "";
    document.getElementById(
        "interactionAbility"
    ).textContent =
        character.ability || "";
    document.getElementById(
        "interactionFact"
    ).textContent =
        "Loading interaction...";
}
/* ==========================================
   Start Homepage
========================================== */
async function initializeHomepage(){
    try{
        await loadHomepageCharacters();
        showRandomCharacter();
const token =
    document.getElementById(
        "characterToken"
    );
if(token){
    token.addEventListener(
        "click",
        showRandomCharacter
    );
}
    }
    catch(error){
        console.error(
            "Homepage failed:",
            error
        );
    }
}
initializeHomepage();
