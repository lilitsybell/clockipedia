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

let nightType =
    "otherNights";

const puzzleSize =
    10;


/* ==========================================
   Elements
========================================== */
const checkButton =
    document.getElementById(
        "check-night-order"
    );

const attemptCount =
    document.getElementById(
        "attempt-count"
    );

const resultDisplay =
    document.getElementById(
        "night-order-result"
    );

let attempts = 0;
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

/* ==========================================
   Daily Puzzle
========================================== */

let puzzleDate =
    getTodayKey();


function getTodayKey(){

    const today =
        new Date();

    return [
        today.getFullYear(),
        String(
            today.getMonth() + 1
        ).padStart(2,"0"),
        String(
            today.getDate()
        ).padStart(2,"0")
    ].join("-");

}


/* ==========================================
   Seeded Random
========================================== */

function hashString(text){

    let hash =
        2166136261;


    for(
        let i = 0;
        i < text.length;
        i++
    ){

        hash ^=
            text.charCodeAt(i);

        hash =
            Math.imul(
                hash,
                16777619
            );

    }


    return hash >>> 0;

}


function seededRandom(seed){

    let value =
        seed >>> 0;


    return function(){

        value +=
            0x6D2B79F5;


        let result =
            value;


        result =
            Math.imul(
                result ^
                result >>> 15,
                result | 1
            );


        result ^=
            result +
            Math.imul(
                result ^
                result >>> 7,
                result | 61
            );


        return (
            (
                result ^
                result >>> 14
            ) >>> 0
        ) / 4294967296;

    };

}


/* ==========================================
   Seeded Shuffle
========================================== */

function seededShuffle(
    array,
    random
){

    const shuffled =
        [...array];


    for(
        let i =
            shuffled.length - 1;
        i > 0;
        i--
    ){

        const j =
            Math.floor(
                random() *
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


    return shuffled;

}


/* ==========================================
   Random Integer
========================================== */

function randomInteger(
    min,
    max,
    random
){

    return (
        Math.floor(
            random() *
            (
                max -
                min +
                1
            )
        ) +
        min
    );

}


/* ==========================================
   Team Group
========================================== */

function getPuzzleTeam(
    character
){

    const team =
        character.team;


    if(team === "Townsfolk"){
        return "townsfolk";
    }


    if(
        team === "Outsider" ||
        team === "Outsiders"
    ){
        return "outsiders";
    }


    if(
        team === "Minion" ||
        team === "Minions"
    ){
        return "minions";
    }


    if(
        team === "Demon" ||
        team === "Demons"
    ){
        return "demons";
    }


    if(
        team === "Traveller" ||
        team === "Travellers"
    ){
        return "travellers";
    }


    if(team === "Fabled"){
        return "fabled";
    }


    if(team === "Loric"){
        return "loric";
    }


    return null;

}


/* ==========================================
   Choose Daily Night
========================================== */

function chooseDailyNight(
    random
){

    return (
        random() < .5
            ? "firstNight"
            : "otherNights"
    );

}


/* ==========================================
   Valid Team Composition
========================================== */

function createTeamCounts(
    random
){

    const ranges = {

        townsfolk:[3,6],
        outsiders:[1,2],
        minions:[1,3],
        demons:[1,2],
        travellers:[1,2],
        fabled:[0,1],
        loric:[0,1]

    };


    while(true){

        const counts = {};


        for(
            const [
                team,
                range
            ]
            of Object.entries(ranges)
        ){

            counts[team] =
                randomInteger(
                    range[0],
                    range[1],
                    random
                );

        }


        const total =
            Object.values(
                counts
            )
            .reduce(
                (sum,count) =>
                    sum + count,
                0
            );


        if(total === 10){
            return counts;
        }

    }

}


/* ==========================================
   Choose Daily Puzzle
========================================== */

function choosePuzzleCharacters(){

    const random =
        seededRandom(
            hashString(
                `night-order-${puzzleDate}`
            )
        );


    nightType =
        chooseDailyNight(
            random
        );


    const eligible =
        getEligibleCharacters();


    const charactersByTeam = {

        townsfolk:[],
        outsiders:[],
        minions:[],
        demons:[],
        travellers:[],
        fabled:[],
        loric:[]

    };


    eligible.forEach(
        character => {

            const team =
                getPuzzleTeam(
                    character
                );


            if(
                team &&
                charactersByTeam[team]
            ){

                charactersByTeam[
                    team
                ].push(
                    character
                );

            }

        }
    );


    const counts =
        createTeamCounts(
            random
        );


    const selected =
        [];


    for(
        const [
            team,
            count
        ]
        of Object.entries(counts)
    ){

        const shuffledTeam =
            seededShuffle(
                charactersByTeam[
                    team
                ],
                random
            );


        selected.push(
            ...shuffledTeam.slice(
                0,
                count
            )
        );

    }

    puzzleCharacters =
        seededShuffle(
            selected,
            random
        );


    console.log(
        "Puzzle date:",
        puzzleDate
    );

    console.log(
        "Night type:",
        nightType
    );

    console.log(
        "Team counts:",
        counts
    );

    console.log(
        "Starting order:",
        puzzleCharacters.map(
            character =>
                character.name
        )
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
   Check Night Order
========================================== */

function checkNightOrder(){

    const currentRows =
        [
            ...nightOrderList.querySelectorAll(
                ".night-order-character"
            )
        ];


    const currentOrder =
        currentRows.map(
            row =>
                row.dataset.character
        );


    const correctOrder =
        [...puzzleCharacters]
        .sort(
            (a,b) =>
                a.nightOrder[nightType].order -
                b.nightOrder[nightType].order
        )
        .map(
            character =>
                character.slug
        );


    let correctCount = 0;


    currentOrder.forEach(
        (slug,index) => {

            if(
                slug ===
                correctOrder[index]
            ){
                correctCount++;
            }

        }
    );


    attempts++;

    attemptCount.textContent =
        attempts;


    showNightOrderResult(
        correctCount
    );

}
/* ==========================================
   Result
========================================== */

function showNightOrderResult(
    correctCount
){

    if(
        correctCount === puzzleSize
    ){

        resultDisplay.innerHTML = `
            <strong>
                Perfect!
            </strong>
            All ${puzzleSize} characters
            are in the correct position.
        `;

        checkButton.disabled =
            true;

        return;

    }


    resultDisplay.innerHTML = `
        <strong>
            ${correctCount} of ${puzzleSize}
        </strong>
        characters are in the correct position.
    `;

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

checkButton.addEventListener(
    "click",
    checkNightOrder
);
initializeNightOrder();
