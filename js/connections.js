console.log(
    "connections.js loaded"
);
let newestSolvedGroup = null;
let connectionsPuzzles = [];
let connectionsPuzzle = null;
let connectionsCharacters = [];
let selectedCharacters =
    new Set();
let solvedGroups = [];
let mistakesRemaining = 4;
let connectionsGuesses = [];
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
            setupConnectionsPlayAgain();
            renderConnectionsGame();
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
const params =
    new URLSearchParams(
        window.location.search
    );


const requestedPuzzle =
    Number(
        params.get("puzzle")
    );


const puzzleFromURL =
    connectionsPuzzles.find(
        puzzle =>
            puzzle.id ===
            requestedPuzzle
    );


if(puzzleFromURL){

    connectionsPuzzle =
        puzzleFromURL;

}
else{

    connectionsPuzzle =
        connectionsPuzzles[
            Math.floor(
                Math.random() *
                connectionsPuzzles.length
            )
        ];

}
updateConnectionsURL();
    connectionsCharacters =
        connectionsPuzzle.groups
            .flatMap(
                group =>
                    group.characters
            );


    shuffleArray(
        connectionsCharacters
    );

}
function updateConnectionsURL(){

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

            shuffleArray(
                connectionsCharacters
            );

            renderConnectionsGrid();

        }
    );


    deselectButton.addEventListener(
        "click",
        () => {

            selectedCharacters.clear();

            renderConnectionsGrid();

            updateSubmitButton();

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

}
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
    selectedCharacters
        .forEach(
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
function animateWrongSelection(){

    selectedCharacters
        .forEach(
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

async function submitConnectionsSelection(){

    if(
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

    showConnectionsResults(
        true
    );

}

    }
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
    return group.characters
        .every(
            character =>
                selected.includes(
                    character
                )
        );
}
function isConnectionsOneAway(
    selected
){
    return connectionsPuzzle.groups
        .some(group => {
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
        });
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
        (
            group,
            index
        ) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "connections-solved-group";
if(group === newestSolvedGroup){

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
newestSolvedGroup = null;
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
        selectedCharacters.size !== 4;

}


/* ==========================================
   Solved Character Check
========================================== */

function isCharacterSolved(
    characterId
){

    return solvedGroups
        .some(
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

    connectionsPuzzle.groups
        .forEach(
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


    document.querySelector(
        "#connectionsSubmit"
    ).disabled = true;
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


    results.hidden = false;


    number.textContent =
        `Puzzle #${connectionsPuzzle.id}`;


    if(won){

        if(mistakesRemaining === 4){

            title.textContent =
                "Perfect Game!";

            text.textContent =
                "You found every connection without making a mistake.";

        }
        else{

            title.textContent =
                "Puzzle Solved!";

            const mistakes =
                4 - mistakesRemaining;


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

function shuffleArray(array){

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


async function shareConnectionsResults(){
const symbols = {
    green: "🟩",
    blue: "🟦",
    purple: "🟪",
    yellow: "🟨"
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
    ? symbols[group.color]
    : "";
                            }
                        )
                        .join("");

                }
            )
            .join("\n");


const puzzleURL =
    `${window.location.origin}${window.location.pathname}?puzzle=${connectionsPuzzle.id}`;


const result =
`Clockipedia Character Connections #${connectionsPuzzle.id}

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
   Play Again
========================================== */

function setupConnectionsPlayAgain(){

    const button =
        document.querySelector(
            "#connectionsPlayAgain"
        );


    button.addEventListener(
        "click",
        playRandomConnectionsPuzzle
    );

}


function playRandomConnectionsPuzzle(){

    if(
        connectionsPuzzles.length <= 1
    ){

        return;

    }


    const availablePuzzles =
        connectionsPuzzles.filter(
            puzzle =>
                puzzle.id !==
                connectionsPuzzle.id
        );


    connectionsPuzzle =
        availablePuzzles[
            Math.floor(
                Math.random() *
                availablePuzzles.length
            )
        ];

updateConnectionsURL();
    resetConnectionsPuzzle();

}
function resetConnectionsPuzzle(){

    selectedCharacters.clear();

    solvedGroups = [];

    mistakesRemaining = 4;

    connectionsGuesses = [];

    newestSolvedGroup = null;


    connectionsCharacters =
        connectionsPuzzle.groups
            .flatMap(
                group =>
                    group.characters
            );


    shuffleArray(
        connectionsCharacters
    );


    const results =
        document.querySelector(
            "#connectionsResults"
        );


    results.hidden = true;


    const message =
        document.querySelector(
            "#connectionsMessage"
        );


    message.hidden = true;


    renderConnectionsGame();

}
function renderConnectionsPuzzleMeta(){

    const number =
        document.querySelector(
            "#connectionsPuzzleHeaderNumber"
        );

    const author =
        document.querySelector(
            "#connectionsAuthor"
        );


    number.textContent =
        `Puzzle #${connectionsPuzzle.id}`;


    author.textContent =
        connectionsPuzzle.author ||
        "Unknown";

}
