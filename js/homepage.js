console.log("homepage.js updated 8/05/26 11:49");
let homepageCharacters = [];
let currentCharacter = null;
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
    currentCharacter = character;
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
    updateInteractionCard(character);
}
function updateInteractionCard(character){

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
    const interaction =
        getRandomInteractionForCharacter(
            character.name
        );
    const fact =
        document.getElementById(
            "interactionFact"
        );
    if(!interaction){
        fact.textContent =
            "No interactions found.";
        return;
    }
    fact.innerHTML =
        formatCharacters(
            interaction.text
        );
}
/* ==========================================
   Start Homepage
========================================== */
async function initializeHomepage(){
    try{
await loadHomepageCharacters();
await loadInteractions();
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
