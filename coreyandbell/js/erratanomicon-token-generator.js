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
/* ==========================================
   Draw Paint Blob
========================================== */

function drawPaintBlob(
    context,
    random,
    x,
    y,
    radius
){

    const points = 18;

    context.beginPath();

    for(
        let i = 0;
        i < points;
        i++
    ){

        const angle =
            (
                Math.PI * 2 * i
            ) / points;

        const variation =
            .72 +
            random() * .5;

        const currentRadius =
            radius * variation;

        const px =
            x +
            Math.cos(angle) *
            currentRadius;

        const py =
            y +
            Math.sin(angle) *
            currentRadius;

        if(i === 0){

            context.moveTo(
                px,
                py
            );

        }else{

            context.lineTo(
                px,
                py
            );

        }

    }

    context.closePath();
    context.fill();

}



/* ==========================================
   Draw Green Paint
========================================== */

function drawGreenSplotch(
    context,
    seed
){

    const random =
        createRandom(
            hashString(seed)
        );



    const green =
        "#819900";



    context.save();

    context.fillStyle =
        green;



    /*
        Main paint patches.

        These are intentionally separated
        rather than forming one giant blob.
    */

    const blobCount =
        3 +
        Math.floor(
            random() * 3
        );



    for(
        let i = 0;
        i < blobCount;
        i++
    ){

        const angle =
            random() *
            Math.PI *
            2;

        const distance =
            95 +
            random() * 115;

        const x =
            300 +
            Math.cos(angle) *
            distance;

        const y =
            300 +
            Math.sin(angle) *
            distance;

        const radius =
            45 +
            random() * 55;



        drawPaintBlob(
            context,
            random,
            x,
            y,
            radius
        );

    }



    /*
        Medium splatters
    */

    const mediumCount =
        35 +
        Math.floor(
            random() * 25
        );



    for(
        let i = 0;
        i < mediumCount;
        i++
    ){

        const angle =
            random() *
            Math.PI *
            2;

        const distance =
            110 +
            random() * 175;

        const x =
            300 +
            Math.cos(angle) *
            distance;

        const y =
            300 +
            Math.sin(angle) *
            distance;

        const radius =
            2 +
            random() * 9;



        context.globalAlpha =
            .55 +
            random() * .45;



        context.beginPath();

        context.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        context.fill();

    }



    /*
        Fine paint speckles
    */

    const speckCount =
        180 +
        Math.floor(
            random() * 120
        );



    for(
        let i = 0;
        i < speckCount;
        i++
    ){

        const angle =
            random() *
            Math.PI *
            2;

        const distance =
            120 +
            random() * 210;

        const x =
            300 +
            Math.cos(angle) *
            distance;

        const y =
            300 +
            Math.sin(angle) *
            distance;

        const radius =
            .5 +
            random() * 2.4;



        context.globalAlpha =
            .3 +
            random() * .7;



        context.beginPath();

        context.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        context.fill();

    }



    /*
        Dry brush scratches
    */

    const streakCount =
        25 +
        Math.floor(
            random() * 20
        );



    context.lineCap =
        "round";



    for(
        let i = 0;
        i < streakCount;
        i++
    ){

        const angle =
            random() *
            Math.PI *
            2;

        const distance =
            130 +
            random() * 160;

        const x =
            300 +
            Math.cos(angle) *
            distance;

        const y =
            300 +
            Math.sin(angle) *
            distance;

        const length =
            15 +
            random() * 55;

        const strokeAngle =
            random() *
            Math.PI *
            2;



        context.globalAlpha =
            .25 +
            random() * .5;

        context.lineWidth =
            1 +
            random() * 4;



        context.beginPath();

        context.moveTo(
            x,
            y
        );

        context.lineTo(
            x +
            Math.cos(
                strokeAngle
            ) *
            length,

            y +
            Math.sin(
                strokeAngle
            ) *
            length
        );

        context.strokeStyle =
            green;

        context.stroke();

    }



    context.restore();

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
        canvas.width * 1;

    const maxHeight =
        canvas.height * 1;



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
