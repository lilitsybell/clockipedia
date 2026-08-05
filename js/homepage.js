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
    const container =
        document.getElementById(
            "randomCharacter"
        );
    if(!container){
        return;
    }
    container.innerHTML = `
        <img src="${character.image}">
        <h3>
            ${character.name}
        </h3>
        <p>
            ${character.team || ""}
        </p>
        <p>
            ${character.ability || ""}
        </p>
    `;
}
/* ==========================================
   Start Homepage
========================================== */
async function initializeHomepage(){
    try{
        await loadHomepageCharacters();
        showRandomCharacter();
        const button =
            document.getElementById(
                "randomCharacterButton"
            );
        if(button){
            button.addEventListener(
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
