console.log("night-order.js loaded");

let characters = {};
let puzzleCharacters = [];


/* ==========================================
   Settings
========================================== */

/*
    For now we're testing Other Nights.

    Later the daily puzzle will automatically
    choose between:

    "firstNight"
    "otherNights"
*/

const nightType =
    "otherNights";

const puzzleSize =
    10;


/* ==========================================
   Elements
========================================== */

const nightOrderList =
    document.getElementById(
        "night-order-list"
    );

const nightTypeHeading =
    document.getElementById(
        "night-type"
    );


/* ==========================================
   Load Characters
========================================== */

async function loadNightOrderCharacters(){

    const response =
        await fetch(
            "/data/characters.json"
        );

    if(!response.ok){

        throw new Error(
            "Failed to load characters.json"
        );

    }

    characters =
        await response.json();

}


/* ==========================================
   Get Eligible Characters
========================================== */

function getEligibleCharacters(){

    return Object.entries(
        characters
    )
    .filter(
        ([slug, character]) => {

            const night =
                character.nightOrder?.[
                    nightType
                ];

            return (
                night &&
                night.order > 0
            );

        }
    )
    .map(
        ([slug, character]) => ({

            slug,

            ...character

        })
    );

}


/* ==========================================
   Pick Test Characters
========================================== */

function choosePuzzleCharacters(){

    const eligible =
        getEligibleCharacters();


    /*
        Shuffle the eligible characters so
        we see a different mixture while
        testing the design.
    */

    const shuffled =
        [...eligible];


    for(
        let i =
            shuffled.length - 1;
        i > 0;
        i--
    ){

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];

    }


puzzleCharacters =
    shuffled.slice(
        0,
        puzzleSize
    );

}


/* ==========================================
   Team Color
========================================== */

function getTeamColor(character){

    const team =
        character.team;


    if(
        team === "Townsfolk" ||
        team === "Outsider" ||
        team === "Outsiders"
    ){
        return "blue";
    }


    if(
        team === "Minion" ||
        team === "Minions" ||
        team === "Demon" ||
        team === "Demons"
    ){
        return "red";
    }


    if(
        team === "Traveller" ||
        team === "Travellers"
    ){
        return "traveller";
    }


    if(
        team === "Loric"
    ){
        return "lime";
    }


    if(
        team === "Fabled"
    ){
        return "copper";
    }


    return "purple";

}


/* ==========================================
   Display Team Name
========================================== */

function getDisplayTeam(character){

    const team =
        character.team;


    const singularTeams = {

        "Outsiders":
            "Outsider",

        "Minions":
            "Minion",

        "Demons":
            "Demon",

        "Travellers":
            "Traveller"

    };


    return (
        singularTeams[team] ||
        team
    );

}


/* ==========================================
   Create Character Row
========================================== */

function createCharacterRow(
    character
){

    const night =
        character.nightOrder[
            nightType
        ];


    const color =
        getTeamColor(
            character
        );


    const row =
        document.createElement(
            "div"
        );

row.className =
    `night-order-character ${color}`;

row.dataset.character =
    character.slug;


    row.innerHTML = `

        <div class="night-order-character-art">

            <img
                src="${character.image}"
                alt="${character.name}"
            >

        </div>


        <div class="night-order-character-name">

            <strong class="${color}">
                ${character.name}
            </strong>

            <span class="night-order-character-team">
                ${getDisplayTeam(character)}
            </span>

        </div>


        <div class="night-order-character-text">
            ${night.text || ""}
        </div>


        <div
            class="night-order-drag"
            aria-hidden="true"
        >
            ⋮⋮
        </div>

    `;


    return row;

}


/* ==========================================
   Render Characters
========================================== */

function renderNightOrder(){

    nightOrderList.innerHTML =
        "";


    puzzleCharacters.forEach(
        character => {

            nightOrderList.appendChild(
                createCharacterRow(
                    character
                )
            );

        }
    );

}


/* ==========================================
   Night Type Heading
========================================== */

function updateNightTypeHeading(){

    nightTypeHeading.textContent =
        nightType === "firstNight"
            ? "First Night"
            : "Other Nights";

}

/* ==========================================
   Pointer Reordering
========================================== */

let draggedRow = null;
let dragPlaceholder = null;

let dragOffsetY = 0;
let dragStartX = 0;

let originalWidth = 0;


/* ==========================================
   Start Drag
========================================== */

nightOrderList.addEventListener(
    "pointerdown",
    event => {

const row =
    event.target.closest(
        ".night-order-character"
    );

if(!row){
    return;
}

        if(!row){
            return;
        }


        event.preventDefault();


        const rect =
            row.getBoundingClientRect();


        draggedRow =
            row;

        dragOffsetY =
            event.clientY -
            rect.top;

        dragStartX =
            rect.left;

        originalWidth =
            rect.width;


        /* Create placeholder */

        dragPlaceholder =
            document.createElement(
                "div"
            );

        dragPlaceholder.className =
            "night-order-placeholder";

        dragPlaceholder.style.height =
            `${rect.height}px`;


        row.parentNode.insertBefore(
            dragPlaceholder,
            row
        );


        /* Lift actual row */

        document.body.appendChild(
            row
        );


        row.classList.add(
            "is-dragging"
        );


        row.style.width =
            `${originalWidth}px`;

        row.style.left =
            `${dragStartX}px`;

        row.style.top =
            `${
                event.clientY -
                dragOffsetY
            }px`;


row.setPointerCapture(
    event.pointerId
);

    }
);


/* ==========================================
   Move Drag
========================================== */

document.addEventListener(
    "pointermove",
    event => {

        if(!draggedRow){
            return;
        }


        event.preventDefault();


        draggedRow.style.top =
            `${
                event.clientY -
                dragOffsetY
            }px`;


        const rows =
            [
                ...nightOrderList
                    .querySelectorAll(
                        ".night-order-character"
                    )
            ];


        let targetRow =
            null;


        for(
            const row of rows
        ){

            const rect =
                row.getBoundingClientRect();


            if(
                event.clientY <
                rect.top +
                rect.height / 2
            ){

                targetRow =
                    row;

                break;

            }

        }


        if(targetRow){

            nightOrderList.insertBefore(
                dragPlaceholder,
                targetRow
            );

        }else{

            nightOrderList.appendChild(
                dragPlaceholder
            );

        }

    }
);


/* ==========================================
   Finish Drag
========================================== */

document.addEventListener(
    "pointerup",
    () => {

        if(
            !draggedRow ||
            !dragPlaceholder
        ){
            return;
        }


        dragPlaceholder.replaceWith(
            draggedRow
        );


        draggedRow.classList.remove(
            "is-dragging"
        );


        draggedRow.style.width =
            "";

        draggedRow.style.left =
            "";

        draggedRow.style.top =
            "";


        draggedRow =
            null;

        dragPlaceholder =
            null;

    }
);

/* ==========================================
   Initialize
========================================== */

async function initializeNightOrder(){

    try{

        await loadNightOrderCharacters();

        choosePuzzleCharacters();

        updateNightTypeHeading();

        renderNightOrder();


        console.log(
            "Night Order characters:",
            puzzleCharacters
        );

    }catch(error){

        console.error(
            "Night Order Challenge failed:",
            error
        );

    }

}


initializeNightOrder();
