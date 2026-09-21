console.log(
    "video-popup-maker.js loaded"
);


let popupCharacters = {};



/* ==========================================
   Elements
========================================== */

const characterSelect =
    document.getElementById(
        "popupCharacter"
    );

const playerInput =
    document.getElementById(
        "popupPlayer"
    );

const abilityInput =
    document.getElementById(
        "popupAbility"
    );

const customIconInput =
    document.getElementById(
        "popupCustomIcon"
    );


const previewPlayer =
    document.getElementById(
        "previewPlayer"
    );

const previewCharacterName =
    document.querySelector(
        ".video-popup-character-name"
    );

const previewCharacterIcon =
    document.getElementById(
        "previewCharacterIcon"
    );

const previewAbility =
    document.getElementById(
        "previewAbility"
    );



/* ==========================================
   Team Colors
========================================== */

const popupTeamColors = {

    Townsfolk:
        "var(--blue)",

    Outsider:
        "var(--blue)",

    Outsiders:
        "var(--blue)",

    Minion:
        "var(--red)",

    Minions:
        "var(--red)",

    Demon:
        "var(--red)",

    Demons:
        "var(--red)",

    Traveller:
        "var(--traveller)",

    Travellers:
        "var(--traveller)",

    Loric:
        "var(--lime)",

    Fabled:
        "var(--copper)"

};



/* ==========================================
   Load Characters
========================================== */

async function loadPopupCharacters(){

    const response =
        await fetch(
            "/data/characters.json"
        );

    if(!response.ok){

        throw new Error(
            "Could not load characters.json"
        );

    }


    popupCharacters =
        await response.json();


    populateCharacterSelect();

}



/* ==========================================
   Character Dropdown
========================================== */

function populateCharacterSelect(){

    characterSelect.innerHTML = "";


    const characters =
        Object.entries(
            popupCharacters
        );


    characters.sort(
        (a,b) =>
            a[1].name.localeCompare(
                b[1].name
            )
    );


    characters.forEach(
        ([slug,character]) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                slug;

            option.textContent =
                character.name;

            characterSelect.appendChild(
                option
            );

        }
    );


    /*
        Start with Noble for our
        test popup.
    */

    if(popupCharacters.noble){

        characterSelect.value =
            "noble";

    }


    updateSelectedCharacter();

}



/* ==========================================
   Selected Character
========================================== */

function updateSelectedCharacter(){

    const slug =
        characterSelect.value;


    const character =
        popupCharacters[slug];


    if(!character){
        return;
    }


    previewCharacterName.textContent =
        character.name;


    abilityInput.value =
        character.ability || "";


    previewAbility.textContent =
        character.ability || "";


    /*
        Custom URL overrides the
        normal character icon.
    */

    previewCharacterIcon.src =
        customIconInput.value.trim() ||
        character.image ||
        "";


    previewCharacterIcon.alt =
        character.name;


    previewCharacterName.style.color =
        popupTeamColors[
            character.team
        ] ||
        "var(--purple)";

}



/* ==========================================
   Live Player Name
========================================== */

playerInput.addEventListener(
    "input",
    () => {

        previewPlayer.textContent =
            playerInput.value ||
            "Player";

    }
);



/* ==========================================
   Live Ability
========================================== */

abilityInput.addEventListener(
    "input",
    () => {

        previewAbility.textContent =
            abilityInput.value;

    }
);



/* ==========================================
   Custom Icon
========================================== */

customIconInput.addEventListener(
    "input",
    () => {

        const character =
            popupCharacters[
                characterSelect.value
            ];


        if(!character){
            return;
        }


        previewCharacterIcon.src =
            customIconInput.value.trim() ||
            character.image ||
            "";

    }
);



/* ==========================================
   Character Change
========================================== */

characterSelect.addEventListener(
    "change",
    () => {

        /*
            Changing characters resets
            the custom icon override.
        */

        customIconInput.value =
            "";

        updateSelectedCharacter();

    }
);



/* ==========================================
   Initialize
========================================== */

async function initializePopupMaker(){

    try{

        await loadPopupCharacters();

    }
    catch(error){

        console.error(
            "Video Popup Maker failed:",
            error
        );

    }

}


initializePopupMaker();
