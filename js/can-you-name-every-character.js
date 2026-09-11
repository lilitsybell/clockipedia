console.log(
    "name-every-character.js loaded"
);


/* ==========================================
   Team Order
========================================== */

const nameEveryCharacterTeams = [

    {
        key:
            "Townsfolk",

        label:
            "Townsfolk"
    },

    {
        key:
            "Outsider",

        label:
            "Outsiders"
    },

    {
        key:
            "Minion",

        label:
            "Minions"
    },

    {
        key:
            "Demon",

        label:
            "Demons"
    },

    {
        key:
            "Traveller",

        label:
            "Travellers"
    },

    {
        key:
            "Loric",

        label:
            "Loric"
    },

    {
        key:
            "Fabled",

        label:
            "Fabled"
    }

];

let nameEveryCharacterGuessed =
    new Set();
let nameEveryCharacterStartTime =
    null;

let nameEveryCharacterElapsedTime =
    0;

let nameEveryCharacterTimerInterval =
    null;

let nameEveryCharacterTimerStarted =
    false;

let nameEveryCharacterPaused =
    false;

let nameEveryCharacterGameEnded =
    false;
/* ==========================================
   Start
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try{

await loadCharacters();

renderNameEveryCharacterBoard();

setupNameEveryCharacterInput();
setupNameEveryCharacterPause();
setupNameEveryCharacterGiveUp();

updateNameEveryCharacterProgress();
updateNameEveryCharacterTeamProgress();

setupNameEveryCharacterShare();
setupNameEveryCharacterPlayAgain();
setupNameEveryCharacterGameOverCopy();
setupNameEveryCharacterPopupClose();

setupNameEveryCharacterRestart();
updateNameEveryCharacterRestartButton();

        }
        catch(error){

            console.error(
                "Name Every Character failed:",
                error
            );

        }

    }
);


/* ==========================================
   Render Board
========================================== */

function renderNameEveryCharacterBoard(){

    const board =
        document.querySelector(
            "#nameEveryCharacterBoard"
        );


    board.innerHTML =
        "";


    nameEveryCharacterTeams.forEach(
        teamInfo => {

            const teamCharacters =
                Object.entries(
                    characters
                )
                .filter(
                    ([
                        slug,
                        character
                    ]) => {

                        return normalizeNameEveryCharacterTeam(
                            character.team
                        ) ===
                        teamInfo.key;

                    }
                )
                .sort(
                    (
                        [, characterA],
                        [, characterB]
                    ) => {

                        return characterA.name.localeCompare(
                            characterB.name
                        );

                    }
                );


            if(
                !teamCharacters.length
            ){

                return;

            }


            const section =
                buildNameEveryCharacterTeam(
                    teamInfo,
                    teamCharacters
                );


            board.appendChild(
                section
            );

        }
    );

}


/* ==========================================
   Build Team
========================================== */

function buildNameEveryCharacterTeam(
    teamInfo,
    teamCharacters
){

    const section =
        document.createElement(
            "section"
        );


    section.className =
        "name-every-character-team";


    section.dataset.team =
        teamInfo.key;


    const header =
        document.createElement(
            "div"
        );


    header.className =
        "name-every-character-team-header";


    const title =
        document.createElement(
            "h2"
        );


    title.className =
        "name-every-character-team-title";


    title.textContent =
        teamInfo.label;


    const count =
        document.createElement(
            "span"
        );


count.className =
    "name-every-character-team-count";


count.dataset.team =
    teamInfo.key;


count.textContent =
    `0 / ${teamCharacters.length}`;


    const grid =
        document.createElement(
            "div"
        );


    grid.className =
        "name-every-character-grid";


    teamCharacters.forEach(
        ([
            slug,
            character
        ]) => {

            grid.appendChild(
                buildNameEveryCharacterSlot(
                    slug,
                    character
                )
            );

        }
    );


    header.appendChild(
        title
    );


    header.appendChild(
        count
    );


    section.appendChild(
        header
    );


    section.appendChild(
        grid
    );


    return section;

}


/* ==========================================
   Build Hidden Character Slot
========================================== */

function buildNameEveryCharacterSlot(
    slug,
    character
){

    const slot =
        document.createElement(
            "div"
        );


    slot.className =
        "name-every-character-slot";


    slot.dataset.character =
        slug;


    const image =
        document.createElement(
            "div"
        );


    image.className =
        "name-every-character-slot-image";


    image.textContent =
        "?";


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "name-every-character-slot-name";


    slot.appendChild(
        image
    );


    slot.appendChild(
        name
    );


    return slot;

}


/* ==========================================
   Normalize Team Names
========================================== */

function normalizeNameEveryCharacterTeam(
    team
){

    const map = {

        Townsfolk:
            "Townsfolk",

        Outsider:
            "Outsider",

        Outsiders:
            "Outsider",

        Minion:
            "Minion",

        Minions:
            "Minion",

        Demon:
            "Demon",

        Demons:
            "Demon",

        Traveller:
            "Traveller",

        Travellers:
            "Traveller",

        Loric:
            "Loric",

        Fabled:
            "Fabled"

    };


    return map[team] ||
        team;

}
/* ==========================================
   Guess Input
========================================== */

function setupNameEveryCharacterInput(){

    const input =
        document.querySelector(
            "#nameEveryCharacterInput"
        );


    input.addEventListener(
        "input",
        () => {
            if(
    !nameEveryCharacterStartTime &&
    input.value.length
){

    startNameEveryCharacterTimer();

}

            const guess =
                normalizeNameEveryCharacterGuess(
                    input.value
                );


            if(!guess){
                return;
            }


const match =
    Object.entries(
        characters
    )
    .find(
        ([
            slug,
            character
        ]) => {

            if(
                nameEveryCharacterGuessed.has(
                    slug
                )
            ){

                return false;

            }


            return normalizeNameEveryCharacterGuess(
                character.name
            ) ===
            guess;

        }
    );


            if(!match){
                return;
            }


            const [
                slug,
                character
            ] =
                match;


            nameEveryCharacterGuessed.add(
                slug
            );


            revealNameEveryCharacter(
                slug,
                character
            );


            input.value =
                "";


            updateNameEveryCharacterProgress();
            updateNameEveryCharacterTeamProgress();
            checkNameEveryCharacterComplete();

        }
    );

}


/* ==========================================
   Normalize Guess
========================================== */

function normalizeNameEveryCharacterGuess(
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
   Reveal Character
========================================== */

function revealNameEveryCharacter(
    slug,
    character
){

    const slot =
        document.querySelector(
            `[data-character="${slug}"]`
        );


    if(!slot){
        return;
    }


    slot.classList.add(
        "guessed"
    );


    const image =
        slot.querySelector(
            ".name-every-character-slot-image"
        );


    const name =
        slot.querySelector(
            ".name-every-character-slot-name"
        );


    image.innerHTML =
        "";


    const token =
        document.createElement(
            "img"
        );


    token.src =
        character.image;


    token.alt =
        character.name;


    image.appendChild(
        token
    );


    name.textContent =
        character.name;

}


/* ==========================================
   Progress
========================================== */

function updateNameEveryCharacterProgress(){

    const progress =
        document.querySelector(
            "#nameEveryCharacterProgress"
        );


    const total =
        Object.keys(
            characters
        ).length;


    progress.textContent =
        `${nameEveryCharacterGuessed.size} / ${total}`;

}
/* ==========================================
   Team Progress
========================================== */

function updateNameEveryCharacterTeamProgress(){

    nameEveryCharacterTeams.forEach(
        teamInfo => {

            const teamCharacters =
                Object.entries(
                    characters
                )
                .filter(
                    ([
                        slug,
                        character
                    ]) => {

                        return normalizeNameEveryCharacterTeam(
                            character.team
                        ) ===
                        teamInfo.key;

                    }
                );


            const guessed =
                teamCharacters.filter(
                    ([
                        slug
                    ]) => {

                        return nameEveryCharacterGuessed.has(
                            slug
                        );

                    }
                ).length;


            const counter =
                document.querySelector(
                    `.name-every-character-team-count[data-team="${teamInfo.key}"]`
                );


            if(!counter){
                return;
            }


            counter.textContent =
                `${guessed} / ${teamCharacters.length}`;

        }
    );

}
/* ==========================================
   Give Up
========================================== */

function setupNameEveryCharacterGiveUp(){

    const button =
        document.querySelector(
            "#nameEveryCharacterGiveUp"
        );


button.addEventListener(
    "click",
    () => {

        const wasRunning =
            nameEveryCharacterTimerInterval !==
            null;


        if(wasRunning){

            pauseNameEveryCharacterTimer();

        }


        const confirmed =
            window.confirm(
                "Give up and reveal all remaining characters?"
            );


        if(!confirmed){

            if(wasRunning){

                resumeNameEveryCharacterTimer();

            }

            return;

        }


        giveUpNameEveryCharacter();

    }
);

}


function giveUpNameEveryCharacter(){
stopNameEveryCharacterTimer();
    Object.entries(
        characters
    )
    .forEach(
        ([
            slug,
            character
        ]) => {

            if(
                nameEveryCharacterGuessed.has(
                    slug
                )
            ){

                return;

            }


            revealMissedNameEveryCharacter(
                slug,
                character
            );

        }
    );


    const input =
        document.querySelector(
            "#nameEveryCharacterInput"
        );


    const button =
        document.querySelector(
            "#nameEveryCharacterGiveUp"
        );


    input.disabled =
        true;


    input.placeholder =
        "Game over";


    button.disabled =
        true;
showNameEveryCharacterGameOver();
}
function showNameEveryCharacterGameOver(){

    const total =
        Object.keys(
            characters
        ).length;


    const guessed =
        nameEveryCharacterGuessed.size;


    const percent =
        Math.round(
            guessed /
            total *
            100
        );


    document.querySelector(
        "#nameEveryCharacterGameOverScore"
    ).textContent =
        `${guessed} / ${total}`;


    document.querySelector(
        "#nameEveryCharacterGameOverPercent"
    ).textContent =
        `${percent}%`;


    document.querySelector(
        "#nameEveryCharacterGameOverTime"
    ).textContent =
        document.querySelector(
            "#nameEveryCharacterTimer"
        ).textContent;


    document.querySelector(
        "#nameEveryCharacterGameOver"
    ).hidden =
        false;

}
/* ==========================================
   Reveal Missed Character
========================================== */

function revealMissedNameEveryCharacter(
    slug,
    character
){

    const slot =
        document.querySelector(
            `[data-character="${slug}"]`
        );


    if(!slot){
        return;
    }


    slot.classList.add(
        "missed"
    );


    const image =
        slot.querySelector(
            ".name-every-character-slot-image"
        );


    const name =
        slot.querySelector(
            ".name-every-character-slot-name"
        );


    image.innerHTML =
        "";


    const token =
        document.createElement(
            "img"
        );


    token.src =
        character.image;


    token.alt =
        character.name;


    image.appendChild(
        token
    );


    name.textContent =
        character.name;

}
/* ==========================================
   Complete Game
========================================== */

function checkNameEveryCharacterComplete(){

    const total =
        Object.keys(
            characters
        ).length;


    if(
        nameEveryCharacterGuessed.size !==
        total
    ){

        return;

    }
stopNameEveryCharacterTimer();
saveNameEveryCharacterBestTime();

    const input =
        document.querySelector(
            "#nameEveryCharacterInput"
        );


    const button =
        document.querySelector(
            "#nameEveryCharacterGiveUp"
        );


    const complete =
        document.querySelector(
            "#nameEveryCharacterComplete"
        );


    input.disabled =
        true;


    input.value =
        "";


    input.placeholder =
        "All characters named!";


    button.disabled =
        true;


    complete.hidden =
        false;
showNameEveryCharacterWinner();
}
/* ==========================================
   Winner Popup
========================================== */

function showNameEveryCharacterWinner(){

    const winner =
        document.querySelector(
            "#nameEveryCharacterWinner"
        );


    const winnerTime =
        document.querySelector(
            "#nameEveryCharacterWinnerTime"
        );


    const timer =
        document.querySelector(
            "#nameEveryCharacterTimer"
        );


    winnerTime.textContent =
        timer.textContent;


    winner.hidden =
        false;

}
/* ==========================================
   Timer
========================================== */

function startNameEveryCharacterTimer(){

    if(
        nameEveryCharacterTimerStarted ||
        nameEveryCharacterGameEnded
    ){
        return;
    }


    nameEveryCharacterTimerStarted =
        true;


    resumeNameEveryCharacterTimer();

}


function resumeNameEveryCharacterTimer(){

    if(
        nameEveryCharacterGameEnded ||
        nameEveryCharacterTimerInterval
    ){
        return;
    }


    nameEveryCharacterPaused =
        false;


    nameEveryCharacterStartTime =
        Date.now();


    nameEveryCharacterTimerInterval =
        setInterval(
            updateNameEveryCharacterTimer,
            250
        );


    updateNameEveryCharacterTimer();

}


function pauseNameEveryCharacterTimer(){

    if(
        !nameEveryCharacterTimerInterval
    ){
        return;
    }


    nameEveryCharacterElapsedTime +=
        Date.now() -
        nameEveryCharacterStartTime;


    clearInterval(
        nameEveryCharacterTimerInterval
    );


    nameEveryCharacterTimerInterval =
        null;


    nameEveryCharacterStartTime =
        null;


    nameEveryCharacterPaused =
        true;


    updateNameEveryCharacterTimer();

}


function updateNameEveryCharacterTimer(){

    let elapsed =
        nameEveryCharacterElapsedTime;


    if(
        nameEveryCharacterTimerInterval &&
        nameEveryCharacterStartTime
    ){

        elapsed +=
            Date.now() -
            nameEveryCharacterStartTime;

    }


    const totalSeconds =
        Math.floor(
            elapsed / 1000
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    const timer =
        document.querySelector(
            "#nameEveryCharacterTimer"
        );


    timer.textContent =
        `${minutes}:${String(seconds).padStart(2, "0")}`;

}


function stopNameEveryCharacterTimer(){

    if(
        nameEveryCharacterTimerInterval
    ){

        nameEveryCharacterElapsedTime +=
            Date.now() -
            nameEveryCharacterStartTime;


        clearInterval(
            nameEveryCharacterTimerInterval
        );


        nameEveryCharacterTimerInterval =
            null;

    }


    nameEveryCharacterStartTime =
        null;


    nameEveryCharacterGameEnded =
        true;
updateNameEveryCharacterRestartButton();

    updateNameEveryCharacterTimer();

}
/* ==========================================
   Pause
========================================== */
function setupNameEveryCharacterPause(){

    const pauseButton =
        document.querySelector(
            "#nameEveryCharacterPause"
        );


    const resumeButton =
        document.querySelector(
            "#nameEveryCharacterResume"
        );


    pauseButton.addEventListener(
        "click",
        pauseNameEveryCharacterGame
    );


    resumeButton.addEventListener(
        "click",
        resumeNameEveryCharacterGame
    );

}
function pauseNameEveryCharacterGame(){

    if(
        nameEveryCharacterGameEnded ||
        !nameEveryCharacterTimerStarted ||
        nameEveryCharacterPaused
    ){
        return;
    }


    pauseNameEveryCharacterTimer();


    const input =
        document.querySelector(
            "#nameEveryCharacterInput"
        );


    const board =
        document.querySelector(
            "#nameEveryCharacterBoard"
        );


    const overlay =
        document.querySelector(
            "#nameEveryCharacterPauseOverlay"
        );


    const button =
        document.querySelector(
            "#nameEveryCharacterPause"
        );


    input.disabled =
        true;


    board.hidden =
        true;


    overlay.hidden =
        false;


    button.disabled =
        true;

}


function resumeNameEveryCharacterGame(){

    if(
        !nameEveryCharacterPaused ||
        nameEveryCharacterGameEnded
    ){
        return;
    }


    const input =
        document.querySelector(
            "#nameEveryCharacterInput"
        );


    const board =
        document.querySelector(
            "#nameEveryCharacterBoard"
        );


    const overlay =
        document.querySelector(
            "#nameEveryCharacterPauseOverlay"
        );


    const button =
        document.querySelector(
            "#nameEveryCharacterPause"
        );


    overlay.hidden =
        true;


    board.hidden =
        false;


    input.disabled =
        false;


    button.disabled =
        false;


    resumeNameEveryCharacterTimer();


    input.focus();

}
/* ==========================================
   Share Result
========================================== */

function setupNameEveryCharacterShare(){

    const button =
        document.querySelector(
            "#nameEveryCharacterShare"
        );


    button.addEventListener(
        "click",
        shareNameEveryCharacterResult
    );

}

async function shareNameEveryCharacterResult(){

    const time =
        document.querySelector(
            "#nameEveryCharacterWinnerTime"
        ).textContent;


    const status =
        document.querySelector(
            "#nameEveryCharacterShareStatus"
        );


    const url =
        window.location.href;


    const text =
`🏆 Can You Name Every Character?

I named every Blood on the Clocktower character!

⏱️ Time: ${time}
✅ ${Object.keys(characters).length} / ${Object.keys(characters).length}

${url}`;


    try{

        await navigator.clipboard.writeText(
            text
        );


        status.textContent =
            "Result copied!";


        const button =
            document.querySelector(
                "#nameEveryCharacterShare"
            );


        const originalText =
            button.textContent;


        button.textContent =
            "Copied!";


        setTimeout(
            () => {

                button.textContent =
                    originalText;


                status.textContent =
                    "";

            },
            2000
        );

    }
    catch(error){

        console.error(
            "Copy failed:",
            error
        );


        status.textContent =
            "Could not copy result.";

    }

}
function setupNameEveryCharacterPlayAgain(){

    document
        .querySelectorAll(
            ".name-every-character-play-again"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        window.location.reload();

                    }
                );

            }
        );

}
/* ==========================================
   Best Time
========================================== */

function getNameEveryCharacterFinalMilliseconds(){

    return nameEveryCharacterElapsedTime;

}


function saveNameEveryCharacterBestTime(){

    const time =
        getNameEveryCharacterFinalMilliseconds();


    if(!time){
        return;
    }


    const currentBest =
        Number(
            localStorage.getItem(
                "nameEveryCharacterBestTime"
            )
        );


    if(
        !currentBest ||
        time < currentBest
    ){

        localStorage.setItem(
            "nameEveryCharacterBestTime",
            time
        );

    }


    loadNameEveryCharacterBestTime();

}


function loadNameEveryCharacterBestTime(){

    const best =
        Number(
            localStorage.getItem(
                "nameEveryCharacterBestTime"
            )
        );


    const element =
        document.querySelector(
            "#nameEveryCharacterBest"
        );


    if(!best){

        element.textContent =
            "Best: —";

        return;

    }


    const totalSeconds =
        Math.floor(
            best / 1000
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    element.textContent =
        `Best: ${minutes}:${String(seconds).padStart(2, "0")}`;

}
function setupNameEveryCharacterGameOverCopy(){

    const button =
        document.querySelector(
            "#nameEveryCharacterGameOverCopy"
        );


    button.addEventListener(
        "click",
        async () => {

            const total =
                Object.keys(
                    characters
                ).length;


            const guessed =
                nameEveryCharacterGuessed.size;


            const percent =
                Math.round(
                    guessed /
                    total *
                    100
                );


            const time =
                document.querySelector(
                    "#nameEveryCharacterGameOverTime"
                ).textContent;


            const text =
`Can You Name Every Character?

I named ${guessed} / ${total} Blood on the Clocktower characters (${percent}%).

⏱️ Time: ${time}

${window.location.href}`;


            await navigator.clipboard.writeText(
                text
            );


            const original =
                button.textContent;


            button.textContent =
                "Copied!";


            setTimeout(
                () => {

                    button.textContent =
                        original;

                },
                2000
            );

        }
    );

}
/* ==========================================
   Close Result Popups
========================================== */

function setupNameEveryCharacterPopupClose(){

    const winner =
        document.querySelector(
            "#nameEveryCharacterWinner"
        );


    const gameOver =
        document.querySelector(
            "#nameEveryCharacterGameOver"
        );


    if(winner){

        winner.addEventListener(
            "click",
            event => {

                if(
                    event.target === winner ||
                    event.target.classList.contains(
                        "name-every-character-winner-backdrop"
                    )
                ){

                    winner.hidden =
                        true;

                }

            }
        );

    }


    if(gameOver){

        gameOver.addEventListener(
            "click",
            event => {

                if(
                    event.target === gameOver ||
                    event.target.classList.contains(
                        "name-every-character-game-over-backdrop"
                    )
                ){

                    gameOver.hidden =
                        true;

                }

            }
        );

    }

}
function setupNameEveryCharacterRestart(){

    const button =
        document.querySelector(
            "#nameEveryCharacterRestart"
        );


    if(!button){
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if(
                !nameEveryCharacterGameEnded
            ){

                const confirmed =
                    window.confirm(
                        "Restart the game? Your current progress will be lost."
                    );


                if(!confirmed){
                    return;
                }

            }


            window.location.reload();

        }
    );

}
function updateNameEveryCharacterRestartButton(){

    const button =
        document.querySelector(
            "#nameEveryCharacterRestart"
        );


    if(!button){
        return;
    }


    button.textContent =
        nameEveryCharacterGameEnded
            ? "Play Again"
            : "Restart";

}
