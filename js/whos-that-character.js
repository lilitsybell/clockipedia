console.log(
    "whos-that-character.js loaded"
);


let whosThatCharacterCurrent = null;

let whosThatCharacterGameCharacters = [];

let whosThatCharacterIndex = 0;

let whosThatCharacterTries = 3;

let whosThatCharacterScore = 0;

const whosThatCharacterGameLength = 10;


/* ==========================================
   Start Game
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try{

            await loadCharacters();

setupWhosThatCharacterGame();

startWhosThatCharacterGame();

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

}

/* ==========================================
   Start New Game
========================================== */

function startWhosThatCharacterGame(){

    const entries =
        Object.entries(
            characters
        );


    const shuffled =
        [...entries]
        .sort(
            () =>
                Math.random() - .5
        );


    whosThatCharacterGameCharacters =
        shuffled
        .slice(
            0,
            whosThatCharacterGameLength
        );


    whosThatCharacterIndex = 0;

    whosThatCharacterScore = 0;

    loadWhosThatCharacterRound();

}
/* ==========================================
   Load Round
========================================== */

function loadWhosThatCharacterRound(){

    if(
        whosThatCharacterIndex >=
        whosThatCharacterGameCharacters.length
    ){

        return;

    }


    const [
        slug,
        character
    ] =
        whosThatCharacterGameCharacters[
            whosThatCharacterIndex
        ];


    whosThatCharacterCurrent = {
        slug,
        ...character
    };


    whosThatCharacterTries = 3;


    showWhosThatCharacterSilhouette();

    updateWhosThatCharacterStatus();


    const input =
        document.querySelector(
            "#whosThatCharacterInput"
        );


    const message =
        document.querySelector(
            "#whosThatCharacterMessage"
        );

    input.value = "";
    input.disabled = false;

    message.textContent = "";
message.className =
    "whos-that-character-message";


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


    const reveal =
        document.querySelector(
            "#whosThatCharacterReveal"
        );


    reveal.classList.remove(
        "revealed"
    );


    reveal.style.opacity =
        "0";


    silhouette.classList.remove(
        "revealed"
    );


    silhouette.style.opacity =
        "1";


    reveal.src =
        whosThatCharacterCurrent.image;


    reveal.alt =
        whosThatCharacterCurrent.name;


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


    requestAnimationFrame(
        () => {

            reveal.style.opacity = "";

            silhouette.style.opacity = "";

        }
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
   Team Color
========================================== */

function getWhosThatCharacterTeamColor(
    team
){

    const colors = {

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


    return colors[team] ||
        "var(--purple)";

}
/* ==========================================
   Show Team Color Hint
========================================== */

function showWhosThatCharacterTeamColor(){

    const silhouette =
        document.querySelector(
            "#whosThatCharacterSilhouette"
        );


    silhouette.style.background =
        getWhosThatCharacterTeamColor(
            whosThatCharacterCurrent.team
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


    /* ======================================
       Correct Guess
    ====================================== */

if(guess === answer){

    whosThatCharacterScore +=
        whosThatCharacterTries;


    updateWhosThatCharacterStatus();


    revealWhosThatCharacter();


    message.className =
        "whos-that-character-message correct";


    message.textContent =
        `Correct! It's ${whosThatCharacterCurrent.name}. +${whosThatCharacterTries} points`;


    input.disabled = true;


    setTimeout(
        () => {

            whosThatCharacterIndex++;


            if(
                whosThatCharacterIndex >=
                whosThatCharacterGameLength
            ){

                finishWhosThatCharacterGame();

                return;

            }


            loadWhosThatCharacterRound();

        },
        1200
    );


    return;

}


    /* ======================================
       Wrong Guess
    ====================================== */

    whosThatCharacterTries--;


    updateWhosThatCharacterStatus();


    /* First Wrong Guess */

    if(whosThatCharacterTries === 2){

        showWhosThatCharacterTeamColor();

message.className =
    "whos-that-character-message hint";
const article =
    whosThatCharacterCurrent.team === "Outsider" ||
    whosThatCharacterCurrent.team === "Outsiders"
        ? "an"
        : "a";


message.textContent =
    `Not quite! Here's a hint: It's ${article} ${whosThatCharacterCurrent.team}.`;


        input.value = "";

        input.focus();

        return;

    }


    /* Second Wrong Guess */

    if(whosThatCharacterTries === 1){

        revealWhosThatCharacter();

message.className =
    "whos-that-character-message hint";
message.textContent =
    "Not that either! Here is the full image.";


        input.value = "";

        input.focus();

        return;

    }


    /* Third Wrong Guess */
message.className =
    "whos-that-character-message wrong";
message.textContent =
    `Sorry, it was ${whosThatCharacterCurrent.name}.`;


    input.disabled = true;


    setTimeout(
        () => {

whosThatCharacterIndex++;


if(
    whosThatCharacterIndex >=
    whosThatCharacterGameLength
){

    finishWhosThatCharacterGame();

    return;

}


loadWhosThatCharacterRound();

        },
        1200
    );

}
/* ==========================================
   Reveal Character
========================================== */
function revealWhosThatCharacter(){

    const silhouette =
        document.querySelector(
            "#whosThatCharacterSilhouette"
        );


    const reveal =
        document.querySelector(
            "#whosThatCharacterReveal"
        );


    silhouette.classList.add(
        "revealed"
    );


    reveal.classList.add(
        "revealed"
    );

}
/* ==========================================
   Update Status
========================================== */

function updateWhosThatCharacterStatus(){

    const progress =
        document.querySelector(
            "#whosThatCharacterProgress"
        );


    const tries =
        document.querySelector(
            "#whosThatCharacterTries"
        );


    const score =
        document.querySelector(
            "#whosThatCharacterScore"
        );


    progress.textContent =
        `${whosThatCharacterIndex + 1} / ${whosThatCharacterGameLength}`;


    tries.textContent =
        whosThatCharacterTries;


    score.textContent =
        `${whosThatCharacterScore} / 30`;

}
/* ==========================================
   Finish Game
========================================== */

function finishWhosThatCharacterGame(){

    const input =
        document.querySelector(
            "#whosThatCharacterInput"
        );


    const guessButton =
        document.querySelector(
            "#whosThatCharacterGuess"
        );


    const nextButton =
        document.querySelector(
            "#whosThatCharacterNext"
        );


    const message =
        document.querySelector(
            "#whosThatCharacterMessage"
        );


    input.disabled =
        true;


    guessButton.disabled =
        true;


    nextButton.hidden =
        true;


    message.textContent =
        `Game complete! Final score: ${whosThatCharacterScore} / 30`;

}
