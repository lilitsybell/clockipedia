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
    const token =
        document.getElementById(
            "characterToken"
        );
    const card =
        document.querySelector(
            ".home-interaction-card"
        );
    // Collapse card toward token
    if(card){
        card.classList.add(
            "card-spin"
        );
    }
    // Spin token
    if(token){
        token.classList.remove(
            "token-spin"
        );
        void token.offsetWidth;
        token.classList.add(
            "token-spin"
        );
    }
    // Wait for animation, then update
    setTimeout(() => {
        document.getElementById(
            "tokenImage"
        ).src =
            character.image;
        document.getElementById(
            "tokenImage"
        ).alt =
            character.name;
        updateInteractionCard(
            character
        );
        if(card){
            card.classList.remove(
                "card-spin"
            );
        }
    },350);
}
function getShortInteractionForCharacter(characterName){
    const maxLength = 200;
    const possible =
        interactions.filter(interaction =>
            interaction.text.includes(
                `[${characterName}]`
            ) &&
            interaction.text.length <= maxLength
        );
    if(!possible.length){
        return null;
    }
    return possible[
        Math.floor(
            Math.random() * possible.length
        )
    ];
}
function updateInteractionCard(character){
const teamColors = {
    "Townsfolk":"blue",
    "Outsiders":"blue",
    "Minions":"red",
    "Demons":"red",
    "Travellers":"traveller",
    "Loric":"lime",
    "Fabled":"copper"
};
const teamNames = {
    "Townsfolk":"Townsfolk",
    "Outsiders":"Outsider",
    "Minions":"Minion",
    "Demons":"Demon",
    "Travellers":"Traveller",
    "Loric":"Loric",
    "Fabled":"Fabled"
};
const teamClass =
    teamColors[
        character.team?.trim()
    ] || "blue";

const card =
    document.querySelector(
        ".home-interaction-card"
    );

if(card){
    card.className =
        "home-interaction-card " + teamClass;
}
    const team =
        document.getElementById(
            "interactionTeam"
        );
team.textContent =
    character.team
        ? `(${teamNames[character.team] || character.team})`
        : "";
team.className = teamClass;
    const name =
        document.getElementById(
            "interactionCharacter"
        );
    name.textContent =
        character.name;
name.className = teamClass;
    document.getElementById(
        "interactionAbility"
    ).textContent =
        character.ability || "";
    const interaction =
        getShortInteractionForCharacter(
            character.name
        );
    const fact =
        document.getElementById(
            "interactionFact"
        );
   fact.className =
    "interaction-fact " + teamClass;
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
