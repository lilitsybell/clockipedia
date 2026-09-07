console.log(
    "connections.js loaded"
);


let connectionsPuzzle = null;

let connectionsCharacters = [];

let selectedCharacters =
    new Set();

let solvedGroups = [];

let mistakesRemaining = 4;


/* ==========================================
   Start Game
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try{

            await loadConnectionsPuzzle();

            setupConnectionsControls();

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


    connectionsPuzzle =
        await response.json();


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


/* ==========================================
   Submit Selection
========================================== */

function submitConnectionsSelection(){

    if(
        selectedCharacters.size !== 4
    ){

        return;

    }


    const selected =
        [...selectedCharacters];


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

            showConnectionsMessage(
                "You solved all four groups!",
                "win"
            );

        }

    }
    else{

        mistakesRemaining--;


        selectedCharacters.clear();


        showConnectionsMessage(
            "Not quite. Try again.",
            "error"
        );


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


            row.dataset.group =
                index;


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
