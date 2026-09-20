console.log(
    "erratanomicon-character-generator.js loaded"
);

let sourceCharacters = {};

const generateButton =
    document.getElementById(
        "generateCharacters"
    );

const output =
    document.getElementById(
        "generatorOutput"
    );


/* ==========================================
   Load Characters
========================================== */

async function loadCharacters(){

    const response =
        await fetch(
            "/data/characters.json"
        );

    if(!response.ok){

        throw new Error(
            "Failed to load characters.json."
        );

    }

    sourceCharacters =
        await response.json();

}


/* ==========================================
   Allowed Teams
========================================== */

function isErratanomiconCharacter(
    character
){

    const team =
        character.team
        .toLowerCase();

    return [
        "townsfolk",
        "outsider",
        "outsiders",
        "minion",
        "minions",
        "demon",
        "demons"
    ].includes(
        team
    );

}


/* ==========================================
   Create Character
========================================== */

function createErratanomiconCharacter(
    slug,
    character
){

    return {

        id:
            slug,

        name:
            character.name,

        team:
            character.team,

        ability:
            character.ability,

        image: [
            `/coreyandbell/data/erratanomicon-images/${slug}_erratanomicon_g.png`,
            `/coreyandbell/data/erratanomicon-images/${slug}_erratanomicon_e.png`
        ]

    };

}


/* ==========================================
   Generate Database
========================================== */

function generateDatabase(){

    const characters =
        Object.entries(
            sourceCharacters
        )
        .filter(
            ([slug,character]) =>
                isErratanomiconCharacter(
                    character
                )
        )
        .map(
            ([slug,character]) =>
                createErratanomiconCharacter(
                    slug,
                    character
                )
        );



    output.textContent =
        JSON.stringify(
            characters,
            null,
            4
        );



    console.log(
        "Generated characters:",
        characters
    );

}


/* ==========================================
   Events
========================================== */

generateButton.addEventListener(
    "click",
    generateDatabase
);


/* ==========================================
   Initialize
========================================== */

async function initializeGenerator(){

    try{

        await loadCharacters();

        console.log(
            "Loaded characters:",
            Object.keys(
                sourceCharacters
            ).length
        );

    }catch(error){

        console.error(
            "Character generator failed:",
            error
        );

        output.textContent =
            "Could not load characters.";

    }

}

initializeGenerator();
