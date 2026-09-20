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
/* ==========================================
   Get Token Images
========================================== */

function getTokenImages(
    character
){

    const baseImage =
        character.image;



    const goodImage =
        baseImage.replace(
            /_[ge](\.[a-zA-Z]+)$/,
            "_g$1"
        );



    const evilImage =
        baseImage.replace(
            /_[ge](\.[a-zA-Z]+)$/,
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
   Seeded Random
========================================== */

function hashString(
    string
){

    let hash = 2166136261;

    for(
        let i = 0;
        i < string.length;
        i++
    ){

        hash ^=
            string.charCodeAt(i);

        hash =
            Math.imul(
                hash,
                16777619
            );

    }

    return hash >>> 0;

}



function createRandom(
    seed
){

    return function(){

        seed +=
            0x6D2B79F5;

        let t =
            seed;

        t =
            Math.imul(
                t ^ t >>> 15,
                t | 1
            );

        t ^=
            t +
            Math.imul(
                t ^ t >>> 7,
                t | 61
            );

        return (
            (
                t ^ t >>> 14
            ) >>> 0
        ) / 4294967296;

    };

}



/* ==========================================
   Draw Green Brush Splotch
========================================== */
/* ==========================================
   Draw Paint Blob
========================================== */

/* ==========================================
   Get Erratanomicon Splotch
========================================== */

function getSplotchInfo(
    seed
){

    const random =
        createRandom(
            hashString(seed)
        );



    const number =
        1 +
        Math.floor(
            random() * 25
        );



    const rotation =
        Math.floor(
            random() * 4
        ) * 90;



    const flipX =
        random() < .5
            ? -1
            : 1;



    const flipY =
        random() < .5
            ? -1
            : 1;



    return {

        src:
            `/images/erratanomicon/erratanomicon-splotch-${number}.png`,

        rotation,

        flipX,

        flipY

    };

}
/* ==========================================
   Draw Character
========================================== */

async function drawCharacterImage(
    canvas,
    image,
    seed
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



    /*
        Get this character's splotch.
    */

    const splotchInfo =
        getSplotchInfo(
            seed
        );



    const splotchImage =
        await loadImage(
            splotchInfo.src
        );



    /*
        Draw splotch.
    */

    context.save();



    context.translate(
        canvas.width / 2,
        canvas.height / 2
    );



    context.rotate(
        splotchInfo.rotation *
        Math.PI / 180
    );



    context.scale(
        splotchInfo.flipX,
        splotchInfo.flipY
    );



    const splotchSize =
        canvas.width * 1;



    context.drawImage(
        splotchImage,
        -splotchSize / 2,
        -splotchSize / 2,
        splotchSize,
        splotchSize
    );



    context.restore();



    /*
        Draw official character artwork.
    */

    const maxWidth =
        canvas.width * .86;

    const maxHeight =
        canvas.height * .86;



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


await drawCharacterImage(
    goodCanvas,
    goodImage,
    `${slug}-good`
);



await drawCharacterImage(
    evilCanvas,
    evilImage,
    `${slug}-evil`
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
