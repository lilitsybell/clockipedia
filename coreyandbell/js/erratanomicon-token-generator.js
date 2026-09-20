console.log(
    "erratanomicon-token-generator.js loaded"
);



let tokenCharacters = {};



/* ==========================================
   Elements
========================================== */

const characterSelect =
    document.getElementById(
        "tokenCharacter"
    );

const generateButton =
    document.getElementById(
        "generateToken"
    );

const goodCanvas =
    document.getElementById(
        "goodTokenCanvas"
    );

const evilCanvas =
    document.getElementById(
        "evilTokenCanvas"
    );



/* ==========================================
   Load Characters
========================================== */

async function loadTokenCharacters(){

    const response =
        await fetch(
            "/data/characters.json"
        );



    if(!response.ok){

        throw new Error(
            "Failed to load characters.json."
        );

    }



    tokenCharacters =
        await response.json();

}



/* ==========================================
   Build Character Dropdown
========================================== */

function buildCharacterDropdown(){

    const characters =
        Object.entries(
            tokenCharacters
        )
        .map(
            ([slug,character]) => ({
                slug,
                ...character
            })
        )
        .sort(
            (a,b) =>
                a.name.localeCompare(
                    b.name
                )
        );



    characters.forEach(
        character => {

            const option =
                document.createElement(
                    "option"
                );



            option.value =
                character.slug;

            option.textContent =
                character.name;



            characterSelect.appendChild(
                option
            );

        }
    );

}



/* ==========================================
   Clear Canvas
========================================== */

function clearCanvas(
    canvas
){

    const context =
        canvas.getContext(
            "2d"
        );



    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}



/* ==========================================
   Generate
========================================== */

function generateSelectedCharacter(){

    const slug =
        characterSelect.value;



    if(!slug){
        return;
    }



    const character =
        tokenCharacters[
            slug
        ];



    console.log(
        "Generating:",
        slug,
        character
    );



    clearCanvas(
        goodCanvas
    );

    clearCanvas(
        evilCanvas
    );

}



/* ==========================================
   Events
========================================== */

generateButton.addEventListener(
    "click",
    generateSelectedCharacter
);



/* ==========================================
   Initialize
========================================== */

async function initializeTokenGenerator(){

    try{

        await loadTokenCharacters();

        buildCharacterDropdown();



        console.log(
            "Token generator characters:",
            Object.keys(
                tokenCharacters
            ).length
        );

    }catch(error){

        console.error(
            "Token generator failed:",
            error
        );

    }

}



initializeTokenGenerator();
