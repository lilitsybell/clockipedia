console.log(
    "whos-that-character.js loaded"
);


let whosThatCharacterCurrent = null;


/* ==========================================
   Start Game
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try{

            await loadCharacters();

            setupWhosThatCharacterGame();

            chooseWhosThatCharacter();

        }
        catch(error){

            console.error(
                "Who's That Character failed:",
                error
            );

        }

    }
);


/* ==========================================
   Setup
========================================== */

function setupWhosThatCharacterGame(){

    const guessButton =
        document.querySelector(
            "#whosThatCharacterGuess"
        );


    const input =
        document.querySelector(
            "#whosThatCharacterInput"
        );


    const nextButton =
        document.querySelector(
            "#whosThatCharacterNext"
        );


    guessButton.addEventListener(
        "click",
        submitWhosThatCharacterGuess
    );


    input.addEventListener(
        "keydown",
        event => {

            if(event.key === "Enter"){

                submitWhosThatCharacterGuess();

            }

        }
    );


    nextButton.addEventListener(
        "click",
        chooseWhosThatCharacter
    );

}


/* ==========================================
   Choose Random Character
========================================== */

function chooseWhosThatCharacter(){

    const entries =
        Object.entries(
            characters
        );


    if(!entries.length){
        return;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            entries.length
        );


    const [
        slug,
        character
    ] =
        entries[
            randomIndex
        ];


    whosThatCharacterCurrent = {
        slug,
        ...character
    };


    showWhosThatCharacterSilhouette();


    const input =
        document.querySelector(
            "#whosThatCharacterInput"
        );


    const message =
        document.querySelector(
            "#whosThatCharacterMessage"
        );


    const nextButton =
        document.querySelector(
            "#whosThatCharacterNext"
        );


    input.value = "";
    input.disabled = false;

    message.textContent = "";

    nextButton.hidden = true;


    input.focus();

}


/* ==========================================
   Show Silhouette
========================================== */

function showWhosThatCharacterSilhouette(){

    const silhouette =
        document.querySelector(
            "#whosThatCharacterSilhouette"
        );


    silhouette.style.background =
        "var(--black)";


    silhouette.style.webkitMaskImage =
        `url("${whosThatCharacterCurrent.image}")`;


    silhouette.style.maskImage =
        `url("${whosThatCharacterCurrent.image}")`;


    silhouette.style.setProperty(
        "--character-image",
        `url("${whosThatCharacterCurrent.image}")`
    );

}


/* ==========================================
   Normalize Guess
========================================== */

function normalizeWhosThatCharacterGuess(
    text
){

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]/g,
            ""
        );

}


/* ==========================================
   Submit Guess
========================================== */

function submitWhosThatCharacterGuess(){

    if(!whosThatCharacterCurrent){
        return;
    }


    const input =
        document.querySelector(
            "#whosThatCharacterInput"
        );


    const message =
        document.querySelector(
            "#whosThatCharacterMessage"
        );


    const nextButton =
        document.querySelector(
            "#whosThatCharacterNext"
        );


    const guess =
        normalizeWhosThatCharacterGuess(
            input.value
        );


    if(!guess){
        return;
    }


    const answer =
        normalizeWhosThatCharacterGuess(
            whosThatCharacterCurrent.name
        );


    if(guess === answer){

        message.textContent =
            `Correct! It's ${whosThatCharacterCurrent.name}.`;


        revealWhosThatCharacter();


        input.disabled = true;

        nextButton.hidden = false;

    }
    else{

        message.textContent =
            "Not quite — try again.";


        input.select();

    }

}


/* ==========================================
   Reveal Character
========================================== */

function revealWhosThatCharacter(){

    const silhouette =
        document.querySelector(
            "#whosThatCharacterSilhouette"
        );


    silhouette.style.webkitMaskImage =
        "none";


    silhouette.style.maskImage =
        "none";


    silhouette.style.background =
        `url("${whosThatCharacterCurrent.image}") center / contain no-repeat`;

}
