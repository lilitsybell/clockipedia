console.log("night-order.js loaded");


let characters = {};
let puzzleCharacters = [];

let attempts = 0;


/* ==========================================
   Settings
========================================== */

let nightType =
    "otherNights";

const puzzleSize =
    10;

const firstPuzzleDate =
    "2026-09-01";

const nightOrderStorageKey =
    "clockipedia-night-order";


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

const nightOrderList =
    document.getElementById(
        "night-order-list"
    );

const nightTypeHeading =
    document.getElementById(
        "night-type"
    );


/* ==========================================
   Daily Puzzle
========================================== */

let puzzleDate =
    getTodayKey();

let archiveDate =
    new Date();


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
   Date Helpers
========================================== */

function getTodayKey(){

    const today =
        new Date();


    return [
        today.getFullYear(),

        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        ),

        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        )

    ].join("-");

}


function dateToKey(date){

    return [
        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        ),

        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

    ].join("-");

}


function keyToDate(key){

    const [
        year,
        month,
        day
    ] =
        key
        .split("-")
        .map(Number);


    return new Date(
        year,
        month - 1,
        day
    );

}


function formatPuzzleDate(key){

    return keyToDate(key)
        .toLocaleDateString(
            "en-US",
            {
                month:"long",
                day:"numeric",
                year:"numeric"
            }
        );

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


    if(
        team === "Townsfolk"
    ){
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


    if(
        team === "Fabled"
    ){
        return "fabled";
    }


    if(
        team === "Loric"
    ){
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

        townsfolk:
            [3,6],

        outsiders:
            [1,2],

        minions:
            [1,3],

        demons:
            [1,2],

        travellers:
            [1,2],

        fabled:
            [0,1],

        loric:
            [0,1]

    };


    while(true){

        const counts =
            {};


        for(
            const [
                team,
                range
            ]
            of Object.entries(
                ranges
            )
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


        if(
            total ===
            puzzleSize
        ){
            return counts;
        }

    }

}


/* ==========================================
   Get Eligible Characters
========================================== */

function getEligibleCharacters(){

    return Object.entries(
        characters
    )
    .filter(
        ([slug,character]) => {

            const night =
                character
                .nightOrder?.[
                    nightType
                ];


            return (
                night &&
                night.order > 0
            );

        }
    )
    .map(
        ([slug,character]) => ({

            slug,

            ...character

        })
    );

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
        of Object.entries(
            counts
        )
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
   Saved Puzzle Progress
========================================== */

function getSavedNightOrderData(){

    try{

        return JSON.parse(
            localStorage.getItem(
                nightOrderStorageKey
            )
        ) || {};

    }catch(error){

        console.error(
            "Could not read Night Order save:",
            error
        );


        return {};

    }

}


function getSavedPuzzle(){

    const savedData =
        getSavedNightOrderData();


    return (
        savedData[puzzleDate] ||
        null
    );

}


/* ==========================================
   Save Progress
========================================== */

function savePuzzleProgress(){

    const rows =
        [
            ...nightOrderList
                .querySelectorAll(
                    ".night-order-character"
                )
        ];


    if(
        rows.length !==
        puzzleSize
    ){
        return;
    }


    const currentOrder =
        rows.map(
            row =>
                row.dataset.character
        );


    const savedData =
        getSavedNightOrderData();


    const previousSave =
        savedData[puzzleDate] ||
        {};


    savedData[puzzleDate] = {

        order:
            currentOrder,

        attempts:
            previousSave.solved
                ? previousSave.attempts
                : attempts,

        solved:
            previousSave.solved ===
            true,

        score:
            previousSave.solved
                ? previousSave.score
                : null

    };


    try{

        localStorage.setItem(
            nightOrderStorageKey,
            JSON.stringify(
                savedData
            )
        );

    }catch(error){

        console.error(
            "Could not save Night Order progress:",
            error
        );

    }

}


/* ==========================================
   Save Completed Puzzle
========================================== */

function saveCompletedPuzzle(){

    const rows =
        [
            ...nightOrderList
                .querySelectorAll(
                    ".night-order-character"
                )
        ];


    const savedData =
        getSavedNightOrderData();


    /*
        If this date is already solved,
        never overwrite the original score.
    */

    if(
        savedData[puzzleDate]?.solved
    ){
        return;
    }


    savedData[puzzleDate] = {

        order:
            rows.map(
                row =>
                    row.dataset.character
            ),

        attempts:
            attempts,

        solved:
            true,

        score:
            attempts

    };


    try{

        localStorage.setItem(
            nightOrderStorageKey,
            JSON.stringify(
                savedData
            )
        );

    }catch(error){

        console.error(
            "Could not save completed puzzle:",
            error
        );

    }

}


/* ==========================================
   Restore Progress
========================================== */

function restorePuzzleProgress(){

    const savedPuzzle =
        getSavedPuzzle();


    attempts =
        0;


    if(!savedPuzzle){

        attemptCount.textContent =
            "0";

        return;

    }


    attempts =
        Number(
            savedPuzzle.attempts
        ) || 0;


    attemptCount.textContent =
        attempts;


    if(
        !Array.isArray(
            savedPuzzle.order
        ) ||
        savedPuzzle.order.length !==
        puzzleSize
    ){
        return;
    }


    const characterMap =
        new Map(
            puzzleCharacters.map(
                character => [
                    character.slug,
                    character
                ]
            )
        );


    const restoredCharacters =
        savedPuzzle.order
        .map(
            slug =>
                characterMap.get(
                    slug
                )
        )
        .filter(Boolean);


    /*
        Only restore the saved order
        if all ten characters still
        belong to this exact puzzle.
    */

    if(
        restoredCharacters.length ===
        puzzleSize
    ){

        puzzleCharacters =
            restoredCharacters;

    }

}


/* ==========================================
   Score Color
========================================== */

function getScoreColor(score){

    const clampedScore =
        Math.min(
            Math.max(
                score,
                1
            ),
            50
        );


    const progress =
        (
            clampedScore -
            1
        ) / 49;


    let hue;


    if(
        progress <= .33
    ){

        const localProgress =
            progress / .33;


        hue =
            120 -
            (
                65 *
                localProgress
            );

    }

    else if(
        progress <= .66
    ){

        const localProgress =
            (
                progress -
                .33
            ) / .33;


        hue =
            55 -
            (
                27 *
                localProgress
            );

    }

    else{

        const localProgress =
            (
                progress -
                .66
            ) / .34;


        hue =
            28 -
            (
                28 *
                localProgress
            );

    }


    return (
        `hsl(${hue}, 72%, 42%)`
    );

}


/* ==========================================
   Completed Result
========================================== */

function showCompletedResult(score){

    const scoreColor =
        getScoreColor(
            score
        );


    resultDisplay.innerHTML = `

        <div class="night-order-solved">

            <div
                class="night-order-score"
                style="
                    --score-color:
                    ${scoreColor};
                "
            >

                <span>
                    Score
                </span>

                <strong>
                    ${score}
                </strong>

            </div>


            <div class="night-order-solved-text">

                <strong>
                    Night order complete!
                </strong>

                <span>
                    All ${puzzleSize} characters
                    are in the correct position.
                </span>

            </div>

        </div>

    `;


    checkButton.disabled =
        true;

}


/* ==========================================
   Restore Solved State
========================================== */

function restoreSolvedState(){

    const savedPuzzle =
        getSavedPuzzle();


    if(
        !savedPuzzle ||
        !savedPuzzle.solved
    ){

        checkButton.disabled =
            false;

        resultDisplay.innerHTML =
            "";

        return;

    }


    attempts =
        Number(
            savedPuzzle.attempts
        ) || 0;


    attemptCount.textContent =
        attempts;


    showCompletedResult(
        savedPuzzle.score
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

    /*
        A completed puzzle should
        never accept more attempts.
    */

    const savedPuzzle =
        getSavedPuzzle();


    if(
        savedPuzzle?.solved
    ){
        return;
    }


    const currentRows =
        [
            ...nightOrderList
                .querySelectorAll(
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
                a.nightOrder[
                    nightType
                ].order -
                b.nightOrder[
                    nightType
                ].order
        )
        .map(
            character =>
                character.slug
        );


    let correctCount =
        0;


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


    if(
        correctCount ===
        puzzleSize
    ){

        saveCompletedPuzzle();

        showCompletedResult(
            attempts
        );

    }else{

        resultDisplay.innerHTML = `
            <strong>
                ${correctCount} of ${puzzleSize}
            </strong>
            characters are in the correct position.
        `;


        savePuzzleProgress();

    }

}


/* ==========================================
   Pointer Reordering
========================================== */

let draggedRow =
    null;

let dragPlaceholder =
    null;

let dragOffsetY =
    0;

let dragStartX =
    0;

let originalWidth =
    0;


/* ==========================================
   Start Drag
========================================== */

nightOrderList.addEventListener(
    "pointerdown",
    event => {

        /*
            Don't allow completed
            puzzles to be changed.
        */

        if(
            getSavedPuzzle()?.solved
        ){
            return;
        }


        const row =
            event.target.closest(
                ".night-order-character"
            );


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


        /*
            Save the new card order
            immediately.
        */

        savePuzzleProgress();

    }
);


/* ==========================================
   Puzzle Archive
========================================== */

const archiveButton =
    document.getElementById(
        "archiveButton"
    );

const archiveModal =
    document.getElementById(
        "archiveModal"
    );

const archiveBackdrop =
    document.getElementById(
        "archiveBackdrop"
    );

const archiveClose =
    document.getElementById(
        "archiveClose"
    );

const archivePreviousMonth =
    document.getElementById(
        "archivePreviousMonth"
    );

const archiveNextMonth =
    document.getElementById(
        "archiveNextMonth"
    );

const archiveMonth =
    document.getElementById(
        "archiveMonth"
    );

const archiveCalendar =
    document.getElementById(
        "archiveCalendar"
    );

const archiveToday =
    document.getElementById(
        "archiveToday"
    );

const puzzleDetails =
    document.getElementById(
        "puzzleDetails"
    );


/* ==========================================
   Puzzle Details
========================================== */

function updatePuzzleDetails(){

    if(!puzzleDetails){
        return;
    }


    const nightName =
        nightType === "firstNight"
            ? "First Night"
            : "Other Nights";


    puzzleDetails.innerHTML = `

        <strong>
            ${formatPuzzleDate(
                puzzleDate
            )}
        </strong>

        <span class="daily-game-meta-divider">
            •
        </span>

        <span>
            ${nightName}
        </span>

    `;

}


/* ==========================================
   Open / Close Archive
========================================== */

function openArchive(){

    archiveDate =
        keyToDate(
            puzzleDate
        );


    archiveDate.setDate(
        1
    );


    renderArchive();


    archiveModal.hidden =
        false;

}


function closeArchive(){

    archiveModal.hidden =
        true;

}


/* ==========================================
   Render Archive
========================================== */

function renderArchive(){

    const year =
        archiveDate.getFullYear();


    const month =
        archiveDate.getMonth();


    archiveMonth.textContent =
        archiveDate
        .toLocaleDateString(
            "en-US",
            {
                month:"long",
                year:"numeric"
            }
        );


    archiveCalendar.innerHTML =
        "";


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        )
        .getDate();


    /*
        Blank cells before
        the first day.
    */

    for(
        let i = 0;
        i < firstDay.getDay();
        i++
    ){

        const blank =
            document.createElement(
                "div"
            );


        archiveCalendar.appendChild(
            blank
        );

    }


    /*
        Calendar days.
    */

    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ){

        const date =
            new Date(
                year,
                month,
                day
            );


        const key =
            dateToKey(
                date
            );


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "daily-calendar-day";

const savedData =
    getSavedNightOrderData();

const savedPuzzle =
    savedData[key];

const completed =
    savedPuzzle?.solved === true;

const savedScore =
    completed
        ? savedPuzzle.score
        : null;


if(completed){

    const scoreColor =
        getScoreColor(
            savedScore
        );


    button.classList.add(
        "night-order-calendar-completed"
    );


    button.style.setProperty(
        "--score-color",
        scoreColor
    );


    button.innerHTML = `

        <span class="daily-calendar-day-number">
            ${day}
        </span>

        <span class="night-order-calendar-score">
            Score ${savedScore}
        </span>

    `;

}else{

    button.innerHTML = `

        <span class="daily-calendar-day-number">
            ${day}
        </span>

    `;

}


        const beforeFirstPuzzle =
            key <
            firstPuzzleDate;


        const future =
            key >
            getTodayKey();


        if(beforeFirstPuzzle){

            button.classList.add(
                "no-puzzle"
            );


            button.disabled =
                true;

        }

        else if(future){

            button.classList.add(
                "future"
            );


            button.disabled =
                true;

        }

        else{

            button.classList.add(
                "has-puzzle"
            );


            button.addEventListener(
                "click",
                () => {

                    loadPuzzleDate(
                        key
                    );

                }
            );

        }


        if(
            key ===
            getTodayKey()
        ){

            button.classList.add(
                "today"
            );

        }


        if(
            key ===
            puzzleDate
        ){

            button.classList.add(
                "current-puzzle"
            );

        }


        archiveCalendar.appendChild(
            button
        );

    }


    updateArchiveNavigation();

}


/* ==========================================
   Archive Navigation
========================================== */

function updateArchiveNavigation(){

    const firstDate =
        keyToDate(
            firstPuzzleDate
        );


    const firstMonth =
        new Date(
            firstDate.getFullYear(),
            firstDate.getMonth(),
            1
        );


    const today =
        new Date();


    const currentMonth =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );


    archivePreviousMonth.disabled =
        archiveDate <=
        firstMonth;


    archiveNextMonth.disabled =
        archiveDate >=
        currentMonth;

}


/* ==========================================
   Load Puzzle Date
========================================== */

function loadPuzzleDate(key){

    puzzleDate =
        key;


    /*
        Start from the deterministic
        puzzle for this date.
    */

    choosePuzzleCharacters();


    /*
        Then restore this player's
        saved state for this date.
    */

    restorePuzzleProgress();


    updateNightTypeHeading();


    renderNightOrder();


    updatePuzzleDetails();


    restoreSolvedState();


    closeArchive();

}


/* ==========================================
   Archive Events
========================================== */

archiveButton.addEventListener(
    "click",
    openArchive
);


archiveClose.addEventListener(
    "click",
    closeArchive
);


archiveBackdrop.addEventListener(
    "click",
    closeArchive
);


archivePreviousMonth.addEventListener(
    "click",
    () => {

        archiveDate.setMonth(
            archiveDate.getMonth() - 1
        );


        renderArchive();

    }
);


archiveNextMonth.addEventListener(
    "click",
    () => {

        archiveDate.setMonth(
            archiveDate.getMonth() + 1
        );


        renderArchive();

    }
);


archiveToday.addEventListener(
    "click",
    () => {

        loadPuzzleDate(
            getTodayKey()
        );

    }
);


/* ==========================================
   Initialize
========================================== */

async function initializeNightOrder(){

    try{

        await loadNightOrderCharacters();


        /*
            Generate today's official
            deterministic puzzle.
        */

        choosePuzzleCharacters();


        /*
            Restore this player's
            progress if they have any.
        */

        restorePuzzleProgress();


        updateNightTypeHeading();


        renderNightOrder();


        updatePuzzleDetails();


        restoreSolvedState();


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


/* ==========================================
   Events
========================================== */

checkButton.addEventListener(
    "click",
    checkNightOrder
);


initializeNightOrder();
