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

const excludedTeams =
    new Set([
        "traveller",
        "travellers",
        "loric",
        "fabled"
    ]);

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
    .filter(
        character =>
            !excludedTeams.has(
                character.team.toLowerCase()
            )
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
   Get Token Images
========================================== */

function getTokenImages(
    character
){

    const goodImage =
        character.image;



    const evilImage =
        goodImage.replace(
            /_g(\.[a-zA-Z]+)$/,
            "_e$1"
        );



    return {
        good:goodImage,
        evil:evilImage
    };

}

/* ==========================================
   Load Image
========================================== */

function loadImage(
    src
){

    return new Promise(
        (resolve,reject) => {

            const image =
                new Image();

            image.crossOrigin =
                "anonymous";

            image.onload =
                () => resolve(
                    image
                );

            image.onerror =
                () => reject(
                    new Error(
                        `Failed to load image: ${src}`
                    )
                );

            image.src =
                src;

        }
    );

}



/* ==========================================
   Draw Character
========================================== */

function drawCharacterImage(
    canvas,
    image
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



    const maxWidth =
        canvas.width * .72;

    const maxHeight =
        canvas.height * .72;



    const scale =
        Math.min(
            maxWidth / image.width,
            maxHeight / image.height
        );



    const width =
        image.width * scale;

    const height =
        image.height * scale;



    const x =
        (canvas.width - width) / 2;

    const y =
        (canvas.height - height) / 2;



    context.drawImage(
        image,
        x,
        y,
        width,
        height
    );

}
/* ==========================================
   Generate
========================================== */

async function generateSelectedCharacter(){

    const slug =
        characterSelect.value;



    if(!slug){
        return;
    }



    const character =
        tokenCharacters[
            slug
        ];



    const images =
        getTokenImages(
            character
        );



    console.log(
        "Generating:",
        slug,
        character
    );



    try{

        generateButton.disabled =
            true;



        const [
            goodImage,
            evilImage
        ] =
            await Promise.all([

                loadImage(
                    images.good
                ),

                loadImage(
                    images.evil
                )

            ]);



        drawCharacterImage(
            goodCanvas,
            goodImage
        );



        drawCharacterImage(
            evilCanvas,
            evilImage
        );



    }catch(error){

        console.error(
            "Token generation failed:",
            error
        );

    }finally{

        generateButton.disabled =
            false;

    }

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
