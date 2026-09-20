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

function drawGreenSplotch(
    context,
    seed
){

    const random =
        createRandom(
            hashString(seed)
        );



    context.save();

    context.translate(
        300,
        300
    );



    const rotation =
        (
            random() * 18 -
            9
        ) *
        Math.PI / 180;

    context.rotate(
        rotation
    );



    context.fillStyle =
        "#80a52b";



    /*
        Main irregular paint body
    */

    context.beginPath();

    const points = 34;

    for(
        let i = 0;
        i < points;
        i++
    ){

        const angle =
            (
                Math.PI * 2 * i
            ) / points;



        const horizontal =
            215 +
            random() * 55;

        const vertical =
            190 +
            random() * 60;



        const x =
            Math.cos(angle) *
            horizontal;

        const y =
            Math.sin(angle) *
            vertical;



        if(i === 0){

            context.moveTo(
                x,
                y
            );

        }else{

            context.lineTo(
                x,
                y
            );

        }

    }

    context.closePath();
    context.fill();



    /*
        Rough brush streaks around
        the outside.
    */

    for(
        let i = 0;
        i < 45;
        i++
    ){

        const side =
            random() < .5
                ? -1
                : 1;



        const x =
            side *
            (
                190 +
                random() * 85
            );

        const y =
            -180 +
            random() * 360;



        const width =
            25 +
            random() * 80;

        const height =
            3 +
            random() * 13;



        context.globalAlpha =
            .35 +
            random() * .55;



        context.fillRect(
            x -
            (
                side < 0
                    ? width
                    : 0
            ),
            y,
            width,
            height
        );

    }



    context.restore();

    context.globalAlpha =
        1;

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
drawGreenSplotch(
    context,
    image.src
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
