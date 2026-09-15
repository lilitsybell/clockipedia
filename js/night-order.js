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

row.draggable = true;

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
   Drag + Drop
========================================== */

let draggedRow = null;


nightOrderList.addEventListener(
    "dragstart",
    event => {

        const row =
            event.target.closest(
                ".night-order-character"
            );

        if(!row) return;


        draggedRow =
            row;


        row.classList.add(
            "dragging"
        );


        event.dataTransfer.effectAllowed =
            "move";

    }
);


nightOrderList.addEventListener(
    "dragend",
    () => {

        if(draggedRow){

            draggedRow.classList.remove(
                "dragging"
            );

        }


        draggedRow =
            null;

    }
);


nightOrderList.addEventListener(
    "dragover",
    event => {

        event.preventDefault();


        if(!draggedRow){
            return;
        }


        const afterElement =
            getDragAfterElement(
                nightOrderList,
                event.clientY
            );


        if(afterElement === null){

            nightOrderList.appendChild(
                draggedRow
            );

        }else{

            nightOrderList.insertBefore(
                draggedRow,
                afterElement
            );

        }

    }
);


function getDragAfterElement(
    container,
    y
){

    const rows =
        [
            ...container.querySelectorAll(
                ".night-order-character:not(.dragging)"
            )
        ];


    return rows.reduce(
        (
            closest,
            row
        ) => {

            const box =
                row.getBoundingClientRect();


            const offset =
                y -
                box.top -
                box.height / 2;


            if(
                offset < 0 &&
                offset >
                closest.offset
            ){

                return {
                    offset,
                    element:row
                };

            }


            return closest;

        },
        {
            offset:
                Number.NEGATIVE_INFINITY,

            element:null
        }
    ).element;

}
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
