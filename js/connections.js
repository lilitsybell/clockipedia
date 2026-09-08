console.log(
    "connections.js loaded"
);


/* ==========================================
   Game State
========================================== */

let newestSolvedGroup = null;

let connectionsPuzzles = [];

let connectionsPuzzle = null;

let connectionsIsCustom = false;
let connectionsCustomCode = "";

let connectionsCharacters = [];

let selectedCharacters =
    new Set();

let solvedGroups = [];

let mistakesRemaining = 4;

let connectionsGuesses = [];

let connectionsFinished = false;

let connectionsWon = false;

let connectionsArchiveDate = null;

/* ==========================================
   Start Game
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try{

            await loadCharacters();

            await loadConnectionsPuzzle();

            setupConnectionsControls();
setupConnectionsShare();

setupConnectionsArchive();

renderConnectionsGame();


            if(connectionsFinished){

                showConnectionsResults(
                    connectionsWon
                );


                document.querySelector(
                    "#connectionsSubmit"
                ).disabled = true;

            }

        }
        catch(error){

            console.error(
                "Connections failed:",
                error
            );

        }

    }
);


/* ==========================================
   Load Puzzle
========================================== */
async function loadConnectionsPuzzle(){

    const params =
        new URLSearchParams(
            window.location.search
        );


    const customCode =
        params.get(
            "custom"
        );


    /* ======================================
       Custom Puzzle
    ====================================== */

    if(customCode){

        connectionsIsCustom =
            true;

        connectionsCustomCode =
            customCode;


        connectionsPuzzle =
            decodeConnectionsCustomPuzzle(
                customCode
            );


        validateConnectionsCustomPuzzle(
            connectionsPuzzle
        );


        connectionsPuzzle.custom =
            true;


        if(
            !loadConnectionsState()
        ){

            connectionsCharacters =
                connectionsPuzzle.groups
                    .flatMap(
                        group =>
                            group.characters
                    );


            shuffleArray(
                connectionsCharacters
            );


            saveConnectionsState();

        }


        return;

    }


    /* ======================================
       Daily Puzzle
    ====================================== */

    connectionsIsCustom =
        false;


    const response =
        await fetch(
            "/data/games/connections.json"
        );


    if(!response.ok){

        throw new Error(
            "Could not load connections puzzle."
        );

    }


    connectionsPuzzles =
        await response.json();


    const requestedPuzzle =
        Number(
            params.get(
                "puzzle"
            )
        );


    const today =
        getConnectionsDate();


    if(requestedPuzzle){

        const puzzleFromURL =
            connectionsPuzzles.find(
                puzzle =>
                    puzzle.id ===
                    requestedPuzzle
            );


        if(
            !puzzleFromURL ||
            puzzleFromURL.date > today
        ){

            throw new Error(
                "This Connections puzzle is not available yet."
            );

        }


        connectionsPuzzle =
            puzzleFromURL;

    }
    else{

        connectionsPuzzle =
            connectionsPuzzles.find(
                puzzle =>
                    puzzle.date ===
                    today
            );


        if(!connectionsPuzzle){

            throw new Error(
                "There is no Connections puzzle for today."
            );

        }

    }


    updateConnectionsURL();


    if(
        !loadConnectionsState()
    ){

        connectionsCharacters =
            connectionsPuzzle.groups
                .flatMap(
                    group =>
                        group.characters
                );


        shuffleArray(
            connectionsCharacters
        );


        saveConnectionsState();

    }

}
function decodeConnectionsCustomPuzzle(
    code
){

    try{

        let base64 =
            code
                .replaceAll(
                    "-",
                    "+"
                )
                .replaceAll(
                    "_",
                    "/"
                );


        while(
            base64.length % 4
        ){

            base64 +=
                "=";

        }


        const binary =
            atob(
                base64
            );


        const bytes =
            Uint8Array.from(
                binary,
                character =>
                    character.charCodeAt(0)
            );


        const json =
            new TextDecoder()
                .decode(
                    bytes
                );


        return JSON.parse(
            json
        );

    }
    catch(error){

        throw new Error(
            "This custom Connections link is invalid."
        );

    }

}
/* ==========================================
   Current Date
========================================== */

function getConnectionsDate(){

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


/* ==========================================
   Update URL
========================================== */

function updateConnectionsURL(){

    if(
        connectionsIsCustom
    ){

        return;

    }


    const url =
        new URL(
            window.location.href
        );


    url.searchParams.set(
        "puzzle",
        connectionsPuzzle.id
    );


    window.history.replaceState(
        {},
        "",
        url
    );

}


/* ==========================================
   Controls
========================================== */

function setupConnectionsControls(){

    const submitButton =
        document.querySelector(
            "#connectionsSubmit"
        );


    const shuffleButton =
        document.querySelector(
            "#connectionsShuffle"
        );


    const deselectButton =
        document.querySelector(
            "#connectionsDeselect"
        );


    submitButton.addEventListener(
        "click",
        submitConnectionsSelection
    );


    shuffleButton.addEventListener(
        "click",
        () => {

            if(connectionsFinished){
                return;
            }


            shuffleArray(
                connectionsCharacters
            );


            renderConnectionsGrid();


            saveConnectionsState();

        }
    );


    deselectButton.addEventListener(
        "click",
        () => {

            if(connectionsFinished){
                return;
            }


            selectedCharacters.clear();


            renderConnectionsGrid();


            updateSubmitButton();


            saveConnectionsState();

        }
    );

}


/* ==========================================
   Render Full Game
========================================== */

function renderConnectionsGame(){

    renderConnectionsPuzzleMeta();

    renderSolvedGroups();

    renderConnectionsGrid();

    renderMistakes();

    updateSubmitButton();

}


/* ==========================================
   Puzzle Meta
========================================== */
function renderConnectionsPuzzleMeta(){

    const number =
        document.querySelector(
            "#connectionsPuzzleHeaderNumber"
        );

    const date =
        document.querySelector(
            "#connectionsPuzzleDate"
        );

    const author =
        document.querySelector(
            "#connectionsAuthor"
        );

    const archive =
        document.querySelector(
            "#connectionsArchiveButton"
        );


    if(
        connectionsIsCustom
    ){

        number.textContent =
            "Custom Puzzle";


        date.hidden =
            true;


        const dividers =
            document.querySelectorAll(
                ".connections-meta-divider"
            );


        if(
            dividers[0]
        ){

            dividers[0].hidden =
                true;

        }


        author.textContent =
            connectionsPuzzle.author;


        if(archive){

            archive.hidden =
                true;

        }


        return;

    }

if(connectionsIsCustom){

    number.textContent =
        "Custom Puzzle";

}
else{

    number.textContent =
        `Puzzle #${connectionsPuzzle.id}`;

}

    date.hidden =
        false;


    const dividers =
        document.querySelectorAll(
            ".connections-meta-divider"
        );


    if(
        dividers[0]
    ){

        dividers[0].hidden =
            false;

    }


    const puzzleDate =
        parseConnectionsDate(
            connectionsPuzzle.date
        );


    const formattedDate =
        new Date(
            puzzleDate.year,
            puzzleDate.month - 1,
            puzzleDate.day
        )
        .toLocaleDateString(
            "en-US",
            {
                month:
                    "long",

                day:
                    "numeric",

                year:
                    "numeric"
            }
        );


    date.textContent =
        formattedDate;


    author.textContent =
        connectionsPuzzle.author ||
        "Unknown";


    if(archive){

        archive.hidden =
            false;

    }

}
/* ==========================================
   Render Grid
========================================== */

function renderConnectionsGrid(){

    const grid =
        document.querySelector(
            "#connectionsGrid"
        );


    grid.innerHTML = "";


    connectionsCharacters
        .filter(
            id =>
                !isCharacterSolved(id)
        )
        .forEach(
            characterId => {

                grid.appendChild(
                    buildCharacterTile(
                        characterId
                    )
                );

            }
        );

}


/* ==========================================
   Character Tile
========================================== */

function buildCharacterTile(
    characterId
){

    const character =
        characters[characterId];


    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "connections-tile";


    button.dataset.character =
        characterId;


    if(
        selectedCharacters.has(
            characterId
        )
    ){

        button.classList.add(
            "selected"
        );

    }


    const image =
        document.createElement(
            "img"
        );


    image.src =
        character?.image || "";


    image.alt =
        character?.name ||
        characterId;


    const name =
        document.createElement(
            "span"
        );


    name.textContent =
        character?.name ||
        characterId;


    button.appendChild(
        image
    );


    button.appendChild(
        name
    );


    button.addEventListener(
        "click",
        () => {

            toggleCharacterSelection(
                characterId
            );

        }
    );


    return button;

}


/* ==========================================
   Selection
========================================== */

function toggleCharacterSelection(
    characterId
){

    if(connectionsFinished){
        return;
    }


    if(
        selectedCharacters.has(
            characterId
        )
    ){

        selectedCharacters.delete(
            characterId
        );

    }
    else{

        if(
            selectedCharacters.size >= 4
        ){

            return;

        }


        selectedCharacters.add(
            characterId
        );

    }


    renderConnectionsGrid();


    updateSubmitButton();


    saveConnectionsState();

}


/* ==========================================
   Correct Animation
========================================== */

function animateCorrectSelection(){

    const grid =
        document.querySelector(
            "#connectionsGrid"
        );


    if(!grid){
        return;
    }


    const gridRect =
        grid.getBoundingClientRect();


    const centerX =
        gridRect.left +
        gridRect.width / 2;


    const centerY =
        gridRect.top +
        gridRect.height / 2;


    selectedCharacters.forEach(
        characterId => {

            const tile =
                document.querySelector(
                    `[data-character="${characterId}"]`
                );


            if(!tile){
                return;
            }


            const rect =
                tile.getBoundingClientRect();


            const tileCenterX =
                rect.left +
                rect.width / 2;


            const tileCenterY =
                rect.top +
                rect.height / 2;


            tile.style.setProperty(
                "--collapse-x",
                `${centerX - tileCenterX}px`
            );


            tile.style.setProperty(
                "--collapse-y",
                `${centerY - tileCenterY}px`
            );


            tile.classList.add(
                "correct-collapse"
            );

        }
    );

}


/* ==========================================
   Wrong Animation
========================================== */

function animateWrongSelection(){

    selectedCharacters.forEach(
        characterId => {

            const tile =
                document.querySelector(
                    `[data-character="${characterId}"]`
                );


            if(tile){

                tile.classList.add(
                    "wrong-shake"
                );

            }

        }
    );

}


/* ==========================================
   Submit Selection
========================================== */

async function submitConnectionsSelection(){

    if(
        connectionsFinished ||
        selectedCharacters.size !== 4
    ){

        return;

    }


    const selected =
        [...selectedCharacters];


    connectionsGuesses.push(
        selected
    );


    const matchedGroup =
        connectionsPuzzle.groups
            .find(
                group =>
                    groupMatchesSelection(
                        group,
                        selected
                    )
            );


    /* ======================================
       Correct Guess
    ====================================== */

    if(matchedGroup){

        animateCorrectSelection();


        await waitConnections(
            460
        );


        newestSolvedGroup =
            matchedGroup;


        solvedGroups.push(
            matchedGroup
        );


        selectedCharacters.clear();


        showConnectionsMessage(
            "Correct!",
            "success"
        );


        renderConnectionsGame();


        if(
            solvedGroups.length ===
            connectionsPuzzle.groups.length
        ){

            connectionsFinished =
                true;


            connectionsWon =
                true;


            saveConnectionsState();


            showConnectionsResults(
                true
            );

        }
        else{

            saveConnectionsState();

        }

    }


    /* ======================================
       Incorrect Guess
    ====================================== */

    else{

        animateWrongSelection();


        await waitConnections(
            360
        );


        mistakesRemaining--;


        const oneAway =
            isConnectionsOneAway(
                selected
            );


        selectedCharacters.clear();


        if(oneAway){

            showConnectionsMessage(
                "One away...",
                "error"
            );

        }
        else{

            showConnectionsMessage(
                "Not quite. Try again.",
                "error"
            );

        }


        renderConnectionsGame();


        if(
            mistakesRemaining <= 0
        ){

            endConnectionsGame();

        }
        else{

            saveConnectionsState();

        }

    }

}


/* ==========================================
   Match Group
========================================== */

function groupMatchesSelection(
    group,
    selected
){

    if(
        group.characters.length !==
        selected.length
    ){

        return false;

    }


    return group.characters.every(
        character =>
            selected.includes(
                character
            )
    );

}


/* ==========================================
   One Away
========================================== */

function isConnectionsOneAway(
    selected
){

    return connectionsPuzzle.groups
        .some(
            group => {

                if(
                    solvedGroups.includes(
                        group
                    )
                ){

                    return false;

                }


                const matches =
                    selected.filter(
                        character =>
                            group.characters.includes(
                                character
                            )
                    ).length;


                return matches === 3;

            }
        );

}


/* ==========================================
   Solved Groups
========================================== */

function renderSolvedGroups(){

    const container =
        document.querySelector(
            "#connectionsSolved"
        );


    container.innerHTML = "";


    solvedGroups.forEach(
        group => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "connections-solved-group";


            if(
                group ===
                newestSolvedGroup
            ){

                row.classList.add(
                    "newly-solved"
                );

            }


            row.dataset.color =
                group.color;


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                group.name;


            const names =
                document.createElement(
                    "span"
                );


            names.textContent =
                group.characters
                    .map(
                        id =>
                            characters[id]?.name ||
                            id
                    )
                    .join(", ");


            row.appendChild(
                title
            );


            row.appendChild(
                names
            );


            container.appendChild(
                row
            );

        }
    );


    newestSolvedGroup =
        null;

}


/* ==========================================
   Mistakes
========================================== */

function renderMistakes(){

    const container =
        document.querySelector(
            "#connectionsMistakes"
        );


    container.innerHTML = "";


    for(
        let i = 0;
        i < mistakesRemaining;
        i++
    ){

        const dot =
            document.createElement(
                "span"
            );


        container.appendChild(
            dot
        );

    }

}


/* ==========================================
   Submit Button
========================================== */

function updateSubmitButton(){

    const button =
        document.querySelector(
            "#connectionsSubmit"
        );


    button.disabled =
        connectionsFinished ||
        selectedCharacters.size !== 4;

}


/* ==========================================
   Solved Character Check
========================================== */

function isCharacterSolved(
    characterId
){

    return solvedGroups.some(
        group =>
            group.characters.includes(
                characterId
            )
    );

}


/* ==========================================
   Message
========================================== */

function showConnectionsMessage(
    text,
    type
){

    const message =
        document.querySelector(
            "#connectionsMessage"
        );


    message.hidden =
        false;


    message.textContent =
        text;


    message.className =
        "connections-message " +
        type;

}


/* ==========================================
   End Game
========================================== */

function endConnectionsGame(){

    connectionsFinished =
        true;


    connectionsWon =
        false;


    connectionsPuzzle.groups.forEach(
        group => {

            if(
                !solvedGroups.includes(
                    group
                )
            ){

                solvedGroups.push(
                    group
                );

            }

        }
    );


    renderConnectionsGame();


    showConnectionsMessage(
        "No mistakes remaining. The remaining groups have been revealed.",
        "lose"
    );


    saveConnectionsState();


    showConnectionsResults(
        false
    );

}


/* ==========================================
   Results
========================================== */

function showConnectionsResults(
    won
){

    const results =
        document.querySelector(
            "#connectionsResults"
        );


    const title =
        document.querySelector(
            "#connectionsResultsTitle"
        );


    const text =
        document.querySelector(
            "#connectionsResultsText"
        );


    const number =
        document.querySelector(
            "#connectionsPuzzleNumber"
        );


    results.hidden =
        false;


    number.textContent =
        `Puzzle #${connectionsPuzzle.id}`;


    if(won){

        if(
            mistakesRemaining === 4
        ){

            title.textContent =
                "Perfect Game!";


            text.textContent =
                "You found every connection without making a mistake.";

        }
        else{

            title.textContent =
                "Puzzle Solved!";


            const mistakes =
                4 -
                mistakesRemaining;


            text.textContent =
                `You found all four connections with ${mistakes} ${
                    mistakes === 1
                        ? "mistake"
                        : "mistakes"
                }.`;

        }

    }
    else{

        title.textContent =
            "So Close!";


        text.textContent =
            "The remaining connections have been revealed.";

    }


    renderConnectionsResultGrid();

}


/* ==========================================
   Result Grid
========================================== */

function renderConnectionsResultGrid(){

    const grid =
        document.querySelector(
            "#connectionsResultGrid"
        );


    grid.innerHTML = "";


    connectionsGuesses.forEach(
        guess => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "connections-result-row";


            guess.forEach(
                characterId => {

                    const square =
                        document.createElement(
                            "span"
                        );


                    const group =
                        connectionsPuzzle.groups
                            .find(
                                group =>
                                    group.characters.includes(
                                        characterId
                                    )
                            );


                    if(group){

                        square.dataset.color =
                            group.color;

                    }


                    row.appendChild(
                        square
                    );

                }
            );


            grid.appendChild(
                row
            );

        }
    );

}


/* ==========================================
   Shuffle
========================================== */

function shuffleArray(
    array
){

    for(
        let i =
            array.length - 1;
        i > 0;
        i--
    ){

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

}


/* ==========================================
   Wait
========================================== */

function waitConnections(
    milliseconds
){

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


/* ==========================================
   Share Results
========================================== */

function setupConnectionsShare(){

    const button =
        document.querySelector(
            "#connectionsShare"
        );


    button.addEventListener(
        "click",
        shareConnectionsResults
    );

}
function getConnectionsShareTitle(){

    if(connectionsIsCustom){

        return (
            "Clockipedia Character Connections " +
            "(Custom Puzzle)"
        );

    }


    return (
        "Clockipedia Character Connections #" +
        connectionsPuzzle.id
    );

}


function getConnectionsShareURL(){

    if(connectionsIsCustom){

        return window.location.href;

    }


    return (
        window.location.origin +
        "/games/character-connections.html" +
        "?puzzle=" +
        connectionsPuzzle.id
    );

}

async function shareConnectionsResults(){

    const symbols = {

        green:
            "🟩",

        blue:
            "🟦",

        purple:
            "🟪",

        yellow:
            "🟧"

    };


    const rows =
        connectionsGuesses
            .map(
                guess => {

                    return guess
                        .map(
                            characterId => {

                                const group =
                                    connectionsPuzzle.groups
                                        .find(
                                            group =>
                                                group.characters.includes(
                                                    characterId
                                                )
                                        );


                                return group
                                    ? symbols[
                                        group.color
                                    ] || "⬜"
                                    : "⬜";

                            }
                        )
                        .join("");

                }
            )
            .join("\n");


const puzzleURL =
    getConnectionsShareURL();


const shareTitle =
    getConnectionsShareTitle();


const result =
`${shareTitle}

${rows}

${puzzleURL}`;


    try{

        await navigator.clipboard.writeText(
            result
        );


        const button =
            document.querySelector(
                "#connectionsShare"
            );


        button.textContent =
            "Copied!";


        setTimeout(
            () => {

                button.textContent =
                    "Share Results";

            },
            1800
        );

    }
    catch(error){

        console.error(
            "Could not copy results:",
            error
        );

    }

}


/* ==========================================
   Local Storage
========================================== */

function getConnectionsStorageKey(){

    if(
        connectionsIsCustom
    ){

        return (
            "clockipedia-connections-custom-" +
            hashConnectionsCustomCode(
                connectionsCustomCode
            )
        );

    }


    return (
        "clockipedia-connections-" +
        connectionsPuzzle.id
    );

}
function hashConnectionsCustomCode(
    text
){

    let hash =
        0;


    for(
        let i = 0;
        i < text.length;
        i++
    ){

        hash =
            (
                (hash << 5) -
                hash
            ) +
            text.charCodeAt(i);


        hash |=
            0;

    }


    return Math.abs(
        hash
    );

}


/* ==========================================
   Save Game
========================================== */

function saveConnectionsState(){

    if(!connectionsPuzzle){
        return;
    }


    const state = {

        order:
            connectionsCharacters,

        selected:
            [...selectedCharacters],

        solvedGroups:
            solvedGroups.map(
                group =>
                    group.name
            ),

        mistakesRemaining:
            mistakesRemaining,

        guesses:
            connectionsGuesses,

        finished:
            connectionsFinished,

        won:
            connectionsWon

    };


    localStorage.setItem(
        getConnectionsStorageKey(),
        JSON.stringify(
            state
        )
    );

}


/* ==========================================
   Load Saved Game
========================================== */

function loadConnectionsState(){

    const saved =
        localStorage.getItem(
            getConnectionsStorageKey()
        );


    if(!saved){
        return false;
    }


    try{

        const state =
            JSON.parse(
                saved
            );


        connectionsCharacters =
            state.order || [];


        selectedCharacters =
            new Set(
                state.selected || []
            );


        solvedGroups =
            (state.solvedGroups || [])
                .map(
                    groupName =>
                        connectionsPuzzle.groups
                            .find(
                                group =>
                                    group.name ===
                                    groupName
                            )
                )
                .filter(Boolean);


        mistakesRemaining =
            state.mistakesRemaining ?? 4;


        connectionsGuesses =
            state.guesses || [];


        connectionsFinished =
            state.finished || false;


        connectionsWon =
            state.won || false;


        return true;

    }
    catch(error){

        console.error(
            "Could not restore Connections game:",
            error
        );


        return false;

    }

}
/* ==========================================
   Connections Archive
========================================== */

function setupConnectionsArchive(){

    const openButton =
        document.querySelector(
            "#connectionsArchiveButton"
        );

    const closeButton =
        document.querySelector(
            "#connectionsArchiveClose"
        );

    const backdrop =
        document.querySelector(
            ".connections-archive-backdrop"
        );

    const previous =
        document.querySelector(
            "#connectionsArchivePrevious"
        );

    const next =
        document.querySelector(
            "#connectionsArchiveNext"
        );

    const todayButton =
        document.querySelector(
            "#connectionsArchiveToday"
        );


    openButton.addEventListener(
        "click",
        openConnectionsArchive
    );


    closeButton.addEventListener(
        "click",
        closeConnectionsArchive
    );


    backdrop.addEventListener(
        "click",
        closeConnectionsArchive
    );


    previous.addEventListener(
        "click",
        () => {

            connectionsArchiveDate =
                new Date(
                    connectionsArchiveDate
                        .getFullYear(),
                    connectionsArchiveDate
                        .getMonth() - 1,
                    1
                );


            renderConnectionsArchive();

        }
    );


    next.addEventListener(
        "click",
        () => {

            connectionsArchiveDate =
                new Date(
                    connectionsArchiveDate
                        .getFullYear(),
                    connectionsArchiveDate
                        .getMonth() + 1,
                    1
                );


            renderConnectionsArchive();

        }
    );


    todayButton.addEventListener(
        "click",
        goToTodayConnectionsPuzzle
    );


    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key ===
                "Escape"
            ){

                closeConnectionsArchive();

            }

        }
    );

}


/* ==========================================
   Open Archive
========================================== */

function openConnectionsArchive(){

    const modal =
        document.querySelector(
            "#connectionsArchiveModal"
        );


    const puzzleDate =
        parseConnectionsDate(
            connectionsPuzzle.date
        );


    connectionsArchiveDate =
        new Date(
            puzzleDate.year,
            puzzleDate.month - 1,
            1
        );


    modal.hidden =
        false;


    renderConnectionsArchive();

}


/* ==========================================
   Close Archive
========================================== */

function closeConnectionsArchive(){

    const modal =
        document.querySelector(
            "#connectionsArchiveModal"
        );


    modal.hidden =
        true;

}


/* ==========================================
   Render Archive
========================================== */

function renderConnectionsArchive(){

    renderConnectionsArchiveMonth();

    renderConnectionsArchiveCalendar();

    updateConnectionsArchiveNavigation();

}


/* ==========================================
   Month Heading
========================================== */

function renderConnectionsArchiveMonth(){

    const heading =
        document.querySelector(
            "#connectionsArchiveMonth"
        );


    heading.textContent =
        connectionsArchiveDate
            .toLocaleDateString(
                "en-US",
                {
                    month:
                        "long",

                    year:
                        "numeric"
                }
            );

}


/* ==========================================
   Render Calendar
========================================== */

function renderConnectionsArchiveCalendar(){

    const calendar =
        document.querySelector(
            "#connectionsArchiveCalendar"
        );


    calendar.innerHTML =
        "";


    const year =
        connectionsArchiveDate
            .getFullYear();


    const month =
        connectionsArchiveDate
            .getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    const startingWeekday =
        firstDay.getDay();


    const daysInMonth =
        lastDay.getDate();


    /* ======================================
       Blank cells before month
    ====================================== */

    for(
        let i = 0;
        i < startingWeekday;
        i++
    ){

        calendar.appendChild(
            buildConnectionsEmptyCalendarDay()
        );

    }


    /* ======================================
       Month days
    ====================================== */

    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ){

        calendar.appendChild(
            buildConnectionsCalendarDay(
                year,
                month,
                day
            )
        );

    }

}


/* ==========================================
   Calendar Day
========================================== */

function buildConnectionsCalendarDay(
    year,
    month,
    day
){

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "connections-calendar-day";


    const dateKey =
        formatConnectionsDateKey(
            year,
            month + 1,
            day
        );


    const today =
        getConnectionsDate();


    const puzzle =
        connectionsPuzzles.find(
            puzzle =>
                puzzle.date ===
                dateKey
        );


    const number =
        document.createElement(
            "span"
        );


    number.className =
        "connections-calendar-day-number";


    number.textContent =
        day;


    button.appendChild(
        number
    );


    if(dateKey === today){

        button.classList.add(
            "today"
        );

    }


    if(!puzzle){

        button.classList.add(
            "no-puzzle"
        );


        button.disabled =
            true;


        return button;

    }


    if(dateKey > today){

        button.classList.add(
            "future"
        );


        button.disabled =
            true;


        return button;

    }


    button.classList.add(
        "has-puzzle"
    );


    if(
        puzzle.id ===
        connectionsPuzzle.id
    ){

        button.classList.add(
            "current-puzzle"
        );

    }


    const state =
        getConnectionsSavedState(
            puzzle.id
        );


    if(state){

        renderConnectionsCalendarStatus(
            button,
            state
        );

    }


    button.addEventListener(
        "click",
        () => {

            openConnectionsPuzzle(
                puzzle.id
            );

        }
    );


    return button;

}


/* ==========================================
   Empty Calendar Cell
========================================== */

function buildConnectionsEmptyCalendarDay(){

    const cell =
        document.createElement(
            "div"
        );


    cell.className =
        "connections-calendar-day no-puzzle";


    return cell;

}


/* ==========================================
   Calendar Status
========================================== */

function renderConnectionsCalendarStatus(
    button,
    state
){

    if(state.finished){

        const rating =
            document.createElement(
                "img"
            );


        rating.className =
            "connections-calendar-rating";


        if(
            state.won &&
            state.mistakesRemaining === 4
        ){

            rating.src =
                "/images/connections/score-perfect.png";

            rating.alt =
                "Perfect";

        }
        else if(
            state.won &&
            state.mistakesRemaining === 3
        ){

            rating.src =
                "/images/connections/score-three-star.png";

            rating.alt =
                "Three stars";

        }
        else if(
            state.won &&
            state.mistakesRemaining === 2
        ){

            rating.src =
                "/images/connections/score-two-star.png";

            rating.alt =
                "Two stars";

        }
        else if(
            state.won &&
            state.mistakesRemaining === 1
        ){

            rating.src =
                "/images/connections/score-one-star.png";

            rating.alt =
                "One star";

        }
        else{

            rating.src =
                "/images/connections/score-failed.png";

            rating.alt =
                "Failed";

        }


        button.appendChild(
            rating
        );


        return;

    }


    if(
        state.guesses?.length ||
        state.solvedGroups?.length
    ){

        const progress =
            document.createElement(
                "span"
            );


        progress.className =
            "connections-calendar-progress";


        progress.textContent =
            "In Progress";


        button.appendChild(
            progress
        );

    }

}

/* ==========================================
   Saved Puzzle State
========================================== */

function getConnectionsSavedState(
    puzzleId
){

    const saved =
        localStorage.getItem(
            "clockipedia-connections-" +
            puzzleId
        );


    if(!saved){
        return null;
    }


    try{

        return JSON.parse(
            saved
        );

    }
    catch(error){

        return null;

    }

}


/* ==========================================
   Archive Navigation
========================================== */

function updateConnectionsArchiveNavigation(){

    const previous =
        document.querySelector(
            "#connectionsArchivePrevious"
        );


    const next =
        document.querySelector(
            "#connectionsArchiveNext"
        );


    const releasedPuzzles =
        connectionsPuzzles.filter(
            puzzle =>
                puzzle.date <=
                getConnectionsDate()
        );


    if(!releasedPuzzles.length){

        previous.disabled =
            true;


        next.disabled =
            true;


        return;

    }


    const dates =
        releasedPuzzles.map(
            puzzle =>
                parseConnectionsDate(
                    puzzle.date
                )
        );


    const earliest =
        new Date(
            Math.min(
                ...dates.map(
                    date =>
                        new Date(
                            date.year,
                            date.month - 1,
                            1
                        ).getTime()
                )
            )
        );


    const today =
        new Date();


    const latest =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );


    previous.disabled =
        connectionsArchiveDate <=
        earliest;


    next.disabled =
        connectionsArchiveDate >=
        latest;

}


/* ==========================================
   Open Puzzle
========================================== */

function openConnectionsPuzzle(
    puzzleId
){

    window.location.href =
        `${window.location.pathname}?puzzle=${puzzleId}`;

}


/* ==========================================
   Today's Puzzle
========================================== */

function goToTodayConnectionsPuzzle(){

    const today =
        getConnectionsDate();


    const puzzle =
        connectionsPuzzles.find(
            puzzle =>
                puzzle.date ===
                today
        );


    if(!puzzle){
        return;
    }


    openConnectionsPuzzle(
        puzzle.id
    );

}


/* ==========================================
   Date Helpers
========================================== */

function parseConnectionsDate(
    date
){

    const [
        year,
        month,
        day
    ] =
        date
            .split("-")
            .map(Number);


    return {
        year,
        month,
        day
    };

}


function formatConnectionsDateKey(
    year,
    month,
    day
){

    return (
        year +
        "-" +
        String(month)
            .padStart(
                2,
                "0"
            ) +
        "-" +
        String(day)
            .padStart(
                2,
                "0"
            )
    );

}
function validateConnectionsCustomPuzzle(
    puzzle
){

    if(
        !puzzle ||
        !Array.isArray(
            puzzle.groups
        ) ||
        puzzle.groups.length !== 4
    ){

        throw new Error(
            "This custom Connections puzzle is invalid."
        );

    }


    const validColors =
        new Set([
            "green",
            "yellow",
            "blue",
            "purple"
        ]);


    const allCharacters =
        [];


    puzzle.groups.forEach(
        group => {

            if(
                typeof group.name !==
                    "string" ||
                !group.name.trim()
            ){

                throw new Error(
                    "This custom Connections puzzle has an invalid category."
                );

            }


            if(
                !validColors.has(
                    group.color
                )
            ){

                throw new Error(
                    "This custom Connections puzzle has an invalid group color."
                );

            }


            if(
                !Array.isArray(
                    group.characters
                ) ||
                group.characters.length !== 4
            ){

                throw new Error(
                    "Each custom Connections group must contain four characters."
                );

            }


            group.characters.forEach(
                slug => {

                    if(
                        !characters[slug]
                    ){

                        throw new Error(
                            `Unknown character: ${slug}`
                        );

                    }


                    allCharacters.push(
                        slug
                    );

                }
            );

        }
    );


    if(
        new Set(
            allCharacters
        ).size !== 16
    ){

        throw new Error(
            "Each character may only appear once."
        );

    }


    puzzle.author =
        typeof puzzle.author ===
            "string" &&
        puzzle.author.trim()
            ? puzzle.author.trim()
            : "Anonymous";

}
