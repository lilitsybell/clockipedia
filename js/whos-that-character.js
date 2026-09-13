console.log(
    "whos-that-character.js loaded"
);


let whosThatCharacterCurrent = null;

let whosThatCharacterGameCharacters = [];

let whosThatCharacterIndex = 0;

let whosThatCharacterTries = 3;

let whosThatCharacterScore = 0;

const whosThatCharacterGameLength = 10;

let whosThatCharacterRotation = 0;

let whosThatCharacterArchiveDate = null;

const whosThatCharacterStartDate =
    "2026-09-12";

let whosThatCharacterPuzzleDate =
    getWhosThatCharacterToday();

/* ==========================================
   Daily Puzzle Rules
========================================== */

const whosThatCharacterTeamLimits = {
    Townsfolk:4,
    Outsiders:3,
    Minions:3,
    Demons:3,
    Travellers:2,
    Fabled:2,
    Loric:2
};


const whosThatCharacterRequiredTeams = [
    "Townsfolk",
    "Outsiders",
    "Minions",
    "Demons",
    "Travellers",
    "Fabled",
    "Loric"
];
/* ==========================================
   Start Game
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try{

await loadCharacters();

setupWhosThatCharacterGame();
setupWhosThatCharacterArchive();

updateWhosThatCharacterPuzzleDetails();

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

    whosThatCharacterGameCharacters =
        generateWhosThatCharacterPuzzle(
            whosThatCharacterPuzzleDate
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


whosThatCharacterCurrent =
    whosThatCharacterGameCharacters[
        whosThatCharacterIndex
    ];


    whosThatCharacterTries = 3;
whosThatCharacterRotation =
    Math.floor(
        Math.random() * 361
    ) - 180;

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
async function showWhosThatCharacterSilhouette(){

    const silhouette =
        document.querySelector(
            "#whosThatCharacterSilhouette"
        );


    const reveal =
        document.querySelector(
            "#whosThatCharacterReveal"
        );


    const imageUrl =
        whosThatCharacterCurrent.image;


    /*
       Hide everything while the new
       character is prepared.
    */

    silhouette.style.transition =
        "none";

    reveal.style.transition =
        "none";


    silhouette.style.opacity =
        "0";

    reveal.style.opacity =
        "0";


    /*
       Preload the character artwork.
       This prevents the black square from
       appearing before the mask exists.
    */

    await new Promise(
        resolve => {

            const image =
                new Image();


            image.onload =
                resolve;

            image.onerror =
                resolve;


            image.src =
                imageUrl;


            if(image.complete){
                resolve();
            }

        }
    );


    /*
       Make sure we are still displaying
       the same round.
    */

    if(
        !whosThatCharacterCurrent ||
        whosThatCharacterCurrent.image !== imageUrl
    ){
        return;
    }


    /*
       Prepare the silhouette.
    */

    silhouette.style.webkitMaskImage =
        `url("${imageUrl}")`;

    silhouette.style.maskImage =
        `url("${imageUrl}")`;


    silhouette.style.setProperty(
        "--character-image",
        `url("${imageUrl}")`
    );


    silhouette.style.backgroundColor =
        "var(--black)";


    silhouette.style.transform =
        `rotate(${whosThatCharacterRotation}deg)`;


    /*
       Prepare the full artwork at
       the exact same angle.
    */

    reveal.src =
        imageUrl;


    reveal.alt =
        whosThatCharacterCurrent.name;


    reveal.style.transform =
        `rotate(${whosThatCharacterRotation}deg)`;


    /*
       Force the browser to finish applying
       the starting state.
    */

    void silhouette.offsetWidth;


    /*
       Turn transitions back on.
    */

    silhouette.style.transition =
        "";

    reveal.style.transition =
        "";


    /*
       Now that the mask is ready,
       show the silhouette.
    */

    silhouette.style.opacity =
        "1";

}

/* ==========================================
   Normalize Guess
========================================== */

function normalizeWhosThatCharacterTeam(
    team
){

    const teams = {
        Townsfolk:"Townsfolk",

        Outsider:"Outsiders",
        Outsiders:"Outsiders",

        Minion:"Minions",
        Minions:"Minions",

        Demon:"Demons",
        Demons:"Demons",

        Traveller:"Travellers",
        Travellers:"Travellers",

        Fabled:"Fabled",

        Loric:"Loric"
    };


    return teams[team] || null;

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


silhouette.style.backgroundColor =
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

    showWhosThatCharacterFullImage();


    message.className =
        "whos-that-character-message hint";


    message.textContent =
        "Not that either! Here is the full image.";


    input.value = "";

    input.focus();

    return;

}

/* Third Wrong Guess */

revealWhosThatCharacter();


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
/* ==========================================
   Show Full Image Hint
========================================== */

function showWhosThatCharacterFullImage(){

    const silhouette =
        document.querySelector(
            "#whosThatCharacterSilhouette"
        );


    const reveal =
        document.querySelector(
            "#whosThatCharacterReveal"
        );


    silhouette.style.opacity =
        "0";


    reveal.style.opacity =
        "1";


    reveal.style.transform =
        `rotate(${whosThatCharacterRotation}deg)`;

}


/* ==========================================
   Final Reveal
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


    silhouette.style.opacity =
        "0";


    reveal.style.opacity =
        "1";


    reveal.style.transform =
        "rotate(0deg)";

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


    const message =
        document.querySelector(
            "#whosThatCharacterMessage"
        );


    input.disabled =
        true;


    guessButton.disabled =
        true;


    message.textContent =
        `Game complete! Final score: ${whosThatCharacterScore} / 30`;

}
/* ==========================================
   Archive Setup
========================================== */

function setupWhosThatCharacterArchive(){

    const openButton =
        document.querySelector(
            "#whosThatCharacterArchiveButton"
        );

    const closeButton =
        document.querySelector(
            "#whosThatCharacterArchiveClose"
        );

    const backdrop =
        document.querySelector(
            ".daily-archive-backdrop"
        );

    const previous =
        document.querySelector(
            "#whosThatCharacterArchivePrevious"
        );

    const next =
        document.querySelector(
            "#whosThatCharacterArchiveNext"
        );

    const todayButton =
        document.querySelector(
            "#whosThatCharacterArchiveToday"
        );


    openButton.addEventListener(
        "click",
        openWhosThatCharacterArchive
    );


    closeButton.addEventListener(
        "click",
        closeWhosThatCharacterArchive
    );


    backdrop.addEventListener(
        "click",
        closeWhosThatCharacterArchive
    );


    previous.addEventListener(
        "click",
        () => {

            whosThatCharacterArchiveDate =
                new Date(
                    whosThatCharacterArchiveDate
                        .getFullYear(),
                    whosThatCharacterArchiveDate
                        .getMonth() - 1,
                    1
                );

            renderWhosThatCharacterArchive();

        }
    );


    next.addEventListener(
        "click",
        () => {

            whosThatCharacterArchiveDate =
                new Date(
                    whosThatCharacterArchiveDate
                        .getFullYear(),
                    whosThatCharacterArchiveDate
                        .getMonth() + 1,
                    1
                );

            renderWhosThatCharacterArchive();

        }
    );


    todayButton.addEventListener(
        "click",
        () => {

            whosThatCharacterArchiveDate =
                new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                );

            renderWhosThatCharacterArchive();

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if(event.key === "Escape"){
                closeWhosThatCharacterArchive();
            }

        }
    );

}
/* ==========================================
   Open / Close Archive
========================================== */

function openWhosThatCharacterArchive(){

    const modal =
        document.querySelector(
            "#whosThatCharacterArchiveModal"
        );

    const now =
        new Date();

    whosThatCharacterArchiveDate =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

    modal.hidden =
        false;

    renderWhosThatCharacterArchive();

}


function closeWhosThatCharacterArchive(){

    const modal =
        document.querySelector(
            "#whosThatCharacterArchiveModal"
        );

    modal.hidden =
        true;

}
/* ==========================================
   Render Archive
========================================== */

function renderWhosThatCharacterArchive(){

    const heading =
        document.querySelector(
            "#whosThatCharacterArchiveMonth"
        );

    heading.textContent =
        whosThatCharacterArchiveDate
            .toLocaleDateString(
                "en-US",
                {
                    month:"long",
                    year:"numeric"
                }
            );

}
/* ==========================================
   Daily Puzzle Date
========================================== */

function getWhosThatCharacterToday(){

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


function getWhosThatCharacterPuzzleNumber(
    dateString
){

    const start =
        new Date(
            `${whosThatCharacterStartDate}T00:00:00`
        );

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    const difference =
        Math.round(
            (
                date - start
            ) /
            86400000
        );

    return difference + 1;

}
function updateWhosThatCharacterPuzzleDetails(){

    const numberElement =
        document.querySelector(
            "#whosThatCharacterPuzzleNumber"
        );

    const dateElement =
        document.querySelector(
            "#whosThatCharacterPuzzleDate"
        );

    const puzzleNumber =
        getWhosThatCharacterPuzzleNumber(
            whosThatCharacterPuzzleDate
        );

    const puzzleDate =
        new Date(
            `${whosThatCharacterPuzzleDate}T00:00:00`
        );


    numberElement.textContent =
        `Puzzle #${puzzleNumber}`;


    dateElement.textContent =
        puzzleDate.toLocaleDateString(
            "en-US",
            {
                month:"long",
                day:"numeric",
                year:"numeric"
            }
        );

}
/* ==========================================
   Normalize Team Name
========================================== */

function normalizeWhosThatCharacterTeam(
    team
){

    const teams = {
        Townsfolk:"Townsfolk",

        Outsider:"Outsiders",
        Outsiders:"Outsiders",

        Minion:"Minions",
        Minions:"Minions",

        Demon:"Demons",
        Demons:"Demons",

        Traveller:"Travellers",
        Travellers:"Travellers",

        Fabled:"Fabled",

        Loric:"Loric"
    };


    return teams[team] || null;

}
/* ==========================================
   Generate Daily Puzzle
========================================== */
/* ==========================================
   Seeded Random
========================================== */

function getWhosThatCharacterSeed(
    dateString
){

    let seed = 0;


    for(
        let i = 0;
        i < dateString.length;
        i++
    ){

        seed =
            (
                seed * 31 +
                dateString.charCodeAt(i)
            ) >>> 0;

    }


    return seed;

}


function createWhosThatCharacterRandom(
    seed
){

    return function(){

        seed +=
            0x6D2B79F5;


        let value =
            seed;


        value =
            Math.imul(
                value ^ value >>> 15,
                value | 1
            );


        value ^=
            value +
            Math.imul(
                value ^ value >>> 7,
                value | 61
            );


        return (
            (
                value ^
                value >>> 14
            ) >>> 0
        ) / 4294967296;

    };

}
function generateWhosThatCharacterPuzzle(
    dateString
){

    const seed =
        getWhosThatCharacterSeed(
            dateString
        );

    const random =
        createWhosThatCharacterRandom(
            seed
        );


    const pools = {};


    whosThatCharacterRequiredTeams
        .forEach(
            team => {

                pools[team] = [];

            }
        );


    Object.entries(characters)
        .forEach(
            ([slug, character]) => {

                const team =
                    normalizeWhosThatCharacterTeam(
                        character.team
                    );

                if(!team){
                    return;
                }

                pools[team].push({
                    slug,
                    ...character
                });

            }
        );


    const puzzle = [];

    const counts = {};


    whosThatCharacterRequiredTeams
        .forEach(
            team => {

                counts[team] = 0;

            }
        );


    /*
        First guarantee one character
        from every required team.
    */

    whosThatCharacterRequiredTeams
        .forEach(
            team => {

                const pool =
                    pools[team];

                if(!pool.length){
                    throw new Error(
                        `No characters available for ${team}.`
                    );
                }


                const index =
                    Math.floor(
                        random() *
                        pool.length
                    );


                const character =
                    pool.splice(
                        index,
                        1
                    )[0];


                puzzle.push(
                    character
                );

                counts[team]++;

            }
        );


    /*
        Fill the remaining slots while
        respecting each team's maximum.
    */

    while(
        puzzle.length <
        whosThatCharacterGameLength
    ){

        const availableTeams =
            whosThatCharacterRequiredTeams
                .filter(
                    team =>
                        counts[team] <
                        whosThatCharacterTeamLimits[team] &&
                        pools[team].length
                );


        if(!availableTeams.length){

            throw new Error(
                "Unable to generate daily puzzle."
            );

        }


        const team =
            availableTeams[
                Math.floor(
                    random() *
                    availableTeams.length
                )
            ];


        const pool =
            pools[team];


        const characterIndex =
            Math.floor(
                random() *
                pool.length
            );


        const character =
            pool.splice(
                characterIndex,
                1
            )[0];


        puzzle.push(
            character
        );

        counts[team]++;

    }


    /*
        Shuffle the final 10 characters
        using the same seeded random source.
    */

    for(
        let i = puzzle.length - 1;
        i > 0;
        i--
    ){

        const j =
            Math.floor(
                random() *
                (i + 1)
            );


        [
            puzzle[i],
            puzzle[j]
        ] = [
            puzzle[j],
            puzzle[i]
        ];

    }


    return puzzle;

}
