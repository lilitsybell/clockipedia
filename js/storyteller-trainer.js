console.log("storyteller-trainer.js loaded");
/* ==========================================
   Game Settings
========================================== */
const trainerPlayerCount = 12;
let selectedReminder = null;
const placedReminders = [];
let trainerGamePhase = "setup";
let trainerNightQueue = [];
let trainerNightIndex = -1;
/* ==========================================
   Trouble Brewing Setup
========================================== */
const troubleBrewingSetup = {
    7:{
        townsfolk:5,
        outsiders:0,
        minions:1,
        demons:1
    },
    8:{
        townsfolk:5,
        outsiders:1,
        minions:1,
        demons:1
    },
    9:{
        townsfolk:5,
        outsiders:2,
        minions:1,
        demons:1
    },
    10:{
        townsfolk:7,
        outsiders:0,
        minions:2,
        demons:1
    },
    11:{
        townsfolk:7,
        outsiders:1,
        minions:2,
        demons:1
    },
    12:{
        townsfolk:7,
        outsiders:2,
        minions:2,
        demons:1
    },
    13:{
        townsfolk:9,
        outsiders:0,
        minions:3,
        demons:1
    },
    14:{
        townsfolk:9,
        outsiders:1,
        minions:3,
        demons:1
    },
    15:{
        townsfolk:9,
        outsiders:2,
        minions:3,
        demons:1
    }
};
/* ==========================================
   Player Names
========================================== */
const trainerPlayerNames = [
    "Corey",
    "Bell",
    "Eddie",
    "Ben",
    "Reece",
    "Juniper",
    "Nic",
    "Petra",
    "Clayzerr",
    "Amon",
    "Broom",
    "Nate"
];
/* ==========================================
   Character Data
========================================== */
let trainerCharacterData = {};
const troubleBrewingCharacters = {
    townsfolk:[
        "washerwoman",
        "librarian",
        "investigator",
        "chef",
        "empath",
        "fortuneteller",
        "undertaker",
        "monk",
        "ravenkeeper",
        "virgin",
        "slayer",
        "soldier",
        "mayor"
    ],

    outsiders:[
        "butler",
        "drunk",
        "recluse",
        "saint"
    ],

    minions:[
        "poisoner",
        "spy",
        "baron",
        "scarletwoman"
    ],

    demons:[
        "imp"
    ]

};

/* ==========================================
   Trouble Brewing Reminder Tokens
========================================== */

const troubleBrewingReminders = {

    washerwoman:{
        reminders:[
            {
                id:"townsfolk",
                name:"Townsfolk",
                count:1,
                phase:"setup",
                rule:
                    "Place on a Townsfolk player. Cannot be the Drunk. The Spy may register as Townsfolk."
            },
            {
                id:"wrong",
                name:"Wrong",
                count:1,
                phase:"setup",
                rule:
                    "Place on another player."
            }
        ]
    },


    librarian:{
        reminders:[
            {
                id:"outsider",
                name:"Outsider",
                count:1,
                phase:"setup",
                rule:
                    "Place on an Outsider player. The Drunk and Spy may register as Outsiders."
            },
            {
                id:"wrong",
                name:"Wrong",
                count:1,
                phase:"setup",
                rule:
                    "Place on another player."
            }
        ]
    },


    investigator:{
        reminders:[
            {
                id:"minion",
                name:"Minion",
                count:1,
                phase:"setup",
                rule:
                    "Place on a Minion player. The Recluse may register as a Minion."
            },
            {
                id:"wrong",
                name:"Wrong",
                count:1,
                phase:"setup",
                rule:
                    "Place on another player."
            }
        ]
    },


    chef:{
        reminders:[]
    },


    empath:{
        reminders:[]
    },


    fortuneteller:{
        reminders:[
            {
                id:"red-herring",
                name:"Red Herring",
                count:1,
                phase:"setup",
                rule:
                    "This player registers as the Demon to the Fortune Teller."
            }
        ]
    },


    undertaker:{
        reminders:[
            {
                id:"died-today",
                name:"Died Today",
                count:1,
                phase:"day",
                rule:
                    "Place on the player killed by execution."
            }
        ]
    },


    monk:{
        reminders:[
            {
                id:"safe",
                name:"Safe",
                count:1,
                phase:"night",
                rule:
                    "Place on the player chosen by the Monk. They cannot be killed by the Demon tonight."
            }
        ]
    },


    ravenkeeper:{
        reminders:[]
    },


    virgin:{
        reminders:[
            {
                id:"no-ability",
                name:"No Ability",
                count:1,
                phase:"day",
                rule:
                    "Place on the Virgin after they are nominated for the first time."
            }
        ]
    },


    slayer:{
        reminders:[
            {
                id:"no-ability",
                name:"No Ability",
                count:1,
                phase:"day",
                rule:
                    "Place on the Slayer after they choose a player."
            }
        ]
    },


    soldier:{
        reminders:[]
    },


    mayor:{
        reminders:[]
    },


    butler:{
        reminders:[
            {
                id:"master",
                name:"Master",
                count:1,
                phase:"night",
                rule:
                    "Place on the player chosen by the Butler."
            }
        ]
    },


    drunk:{
        reminders:[
            {
                id:"is-the-drunk",
                name:"Is the Drunk",
                count:1,
                phase:"setup",
                rule:
                    "Place on a Townsfolk token. That player is actually the Drunk."
            }
        ]
    },


    recluse:{
        reminders:[]
    },


    saint:{
        reminders:[]
    },


    poisoner:{
        reminders:[
            {
                id:"poisoned",
                name:"Poisoned",
                count:1,
                phase:"night",
                rule:
                    "Place on the player chosen by the Poisoner."
            }
        ]
    },


    spy:{
        reminders:[]
    },


    baron:{
        reminders:[]
    },


    scarletwoman:{
        reminders:[
            {
                id:"is-the-demon",
                name:"Is the Demon",
                count:1,
                phase:"game",
                rule:
                    "Place on the Scarlet Woman if the Imp dies while 5 or more players are alive."
            }
        ]
    },


    imp:{
        reminders:[
            {
                id:"dead",
                name:"Dead",
                count:1,
                phase:"night",
                rule:
                    "Place on the player chosen by the Imp. That player dies."
            }
        ]
    }

};
/* ==========================================
   Setup Requirements

   These are targets, not selection limits.
========================================== */

const trainerRequirements = {

    townsfolk:7,
    outsiders:2,
    minions:2,
    demons:1

};


/* ==========================================
   Selection State
========================================== */
const trainerSelectedCharacters =
    new Set();
let trainerSetupState = {
    usingDrunk:false
};
/* ==========================================
   Initialize
========================================== */
document.addEventListener(
    "DOMContentLoaded",
    async () => {
        buildPlayerRing();
        await loadTrainerCharacters();
        buildCharacterSelection();
        updateCharacterSelection();
        bindCharacterSelectionControls();
        bindMistakeControls();
        showTrainerIntro();
    }
);
/* ==========================================
   Load Character Data
========================================== */

async function loadTrainerCharacters(){

    try{

        const response =
            await fetch(
                "/data/characters.json"
            );


        if(!response.ok){

            throw new Error(
                "Could not load characters.json"
            );

        }


        trainerCharacterData =
            await response.json();

    }
    catch(error){

        console.error(
            "Failed to load trainer characters:",
            error
        );

    }

}
/* ==========================================
   Build Player Ring
========================================== */

function buildPlayerRing(){

    const ring =
        document.querySelector(
            "#player-ring"
        );


    if(!ring){
        return;
    }


    ring.innerHTML = "";


    for(
        let i = 0;
        i < trainerPlayerCount;
        i++
    ){

        const player =
            createPlayerSeat(i);


        ring.appendChild(player);

    }

}


/* ==========================================
   Create Player Seat
========================================== */

function createPlayerSeat(index){

    const player =
        document.createElement(
            "div"
        );


    player.className =
        "trainer-player";


    player.dataset.seat =
        index;


    /*
       Player 1 starts at the top.

       Players continue clockwise.
    */

    const angle =
        (
            360 /
            trainerPlayerCount
        ) *
        index -
        90;
    player.style.setProperty(
        "--seat-angle",
        `${angle}deg`
    );
    player.innerHTML = `
        <div class="player-token">
<div class="player-number">
    ${index + 1}
</div>
<div
    class="player-night-complete"
    aria-hidden="true"
>
    👍
</div>
<div class="player-character">
                <span
                    class="player-character-placeholder"
                >
                    ?
                </span>
            </div>
            <div class="player-name">
                ${trainerPlayerNames[index]}
            </div>
            <div class="player-role">
                Unknown
            </div>
<div
    class="player-reminders"
    data-player-reminders
></div>
        </div>
    `;


    return player;

}


function buildCharacterSelection(){

    const grid =
        document.querySelector(
            "#character-grid"
        );


    if(!grid){
        return;
    }


    grid.innerHTML = "";


    Object.entries(
        troubleBrewingCharacters
    ).forEach(
        ([group, characterIds]) => {

            const row =
                createCharacterRow(
                    group,
                    characterIds
                );


            grid.appendChild(row);

        }
    );

}


/* ==========================================
   Create Character Row
========================================== */

function createCharacterRow(
    group,
    characterIds
){

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "character-row";


    row.dataset.group =
        group;


    characterIds.forEach(
        characterId => {

            const character =
                trainerCharacterData[
                    characterId
                ];


            if(!character){

                console.warn(
                    `Missing character: ${characterId}`
                );

                return;
            }


            const button =
                createCharacterButton(
                    characterId,
                    character,
                    group
                );


            row.appendChild(button);

        }
    );


    return row;

}

/* ==========================================
   Create Character Button
========================================== */

function createCharacterButton(
    characterId,
    character,
    group
){

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "character-option";


    button.dataset.character =
        characterId;


    button.dataset.group =
        group;


    button.dataset.team =
        character.team;
/*
   The Drunk is never placed directly
   into the bag.

   A Townsfolk token is used instead
   and later receives the
   "Is the Drunk" reminder.
*/

if(characterId === "drunk"){

    button.disabled = true;

    button.classList.add(
        "character-option-disabled"
    );

}

    button.innerHTML = `

        <span class="character-option-token">

            <img
                class="character-option-icon"
                src="${character.image}"
                alt=""
                draggable="false"
            >

        </span>


        <span class="character-option-name">
            ${character.name}
        </span>

    `;


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
   Toggle Character
========================================== */

function toggleCharacterSelection(
    characterId
){

    if(
        trainerSelectedCharacters.has(
            characterId
        )
    ){

        trainerSelectedCharacters.delete(
            characterId
        );

    }
    else{

        /*
           Deliberately no team limit here.

           The Storyteller Trainer should allow
           incorrect setup choices so the player
           can make mistakes.
        */

        trainerSelectedCharacters.add(
            characterId
        );

    }


    updateCharacterSelection();

}


/* ==========================================
   Update Character Selection
========================================== */

function updateCharacterSelection(){

    updateCharacterButtons();

    updateRequirementCounts();

    updateSelectionTotal();

}


/* ==========================================
   Update Character Buttons
========================================== */

function updateCharacterButtons(){

    const buttons =
        document.querySelectorAll(
            ".character-option"
        );


    buttons.forEach(
        button => {

            const selected =
                trainerSelectedCharacters.has(
                    button.dataset.character
                );


            button.classList.toggle(
                "selected",
                selected
            );


            button.setAttribute(
                "aria-pressed",
                selected
                    ? "true"
                    : "false"
            );

        }
    );

}


/* ==========================================
   Update Requirement Counts
========================================== */

function updateRequirementCounts(){

    const counts = {

        townsfolk:
            getSelectedGroupCount(
                "townsfolk"
            ),

        outsiders:
            getSelectedGroupCount(
                "outsiders"
            ),

        minions:
            getSelectedGroupCount(
                "minions"
            ),

        demons:
            getSelectedGroupCount(
                "demons"
            )

    };


    const townsfolk =
        document.querySelector(
            "#townsfolk-selected"
        );

    const outsider =
        document.querySelector(
            "#outsider-selected"
        );

    const minion =
        document.querySelector(
            "#minion-selected"
        );

    const demon =
        document.querySelector(
            "#demon-selected"
        );


    if(townsfolk){
        townsfolk.textContent =
            counts.townsfolk;
    }


    if(outsider){
        outsider.textContent =
            counts.outsiders;
    }


    if(minion){
        minion.textContent =
            counts.minions;
    }


    if(demon){
        demon.textContent =
            counts.demons;
    }

}


/* ==========================================
   Count Selected Characters In Group
========================================== */

function getSelectedGroupCount(group){

    return troubleBrewingCharacters[
        group
    ].filter(
        characterId =>
            trainerSelectedCharacters.has(
                characterId
            )
    ).length;

}


/* ==========================================
   Update Total
========================================== */

function updateSelectionTotal(){

    const total =
        trainerSelectedCharacters.size;


    const totalDisplay =
        document.querySelector(
            "#selection-total"
        );


    if(totalDisplay){

        totalDisplay.textContent =
            `${total} / ${trainerPlayerCount} selected`;

    }

const distributeButton =
    document.querySelector(
        "#distribute-characters"
    );


    if(distributeButton){

        /*
           For now we only require the correct
           TOTAL number of characters.

           We do not check team composition yet.
        */

        distributeButton.disabled =
            total !== trainerPlayerCount;

    }

}


/* ==========================================
   Character Selection Controls
========================================== */

function bindCharacterSelectionControls(){
    const openButton =
        document.querySelector(
            "#select-characters"
        );
    const cancelButton =
        document.querySelector(
            "#cancel-character-selection"
        );
    const distributeButton =
        document.querySelector(
            "#distribute-characters"
        );
    const overlay =
        document.querySelector(
            "#character-selection"
        );
if(
    openButton &&
    overlay
){

    openButton.addEventListener(
        "click",
        () => {

            /*
               During reminder setup,
               this button checks the
               reminder placements instead
               of reopening character selection.
            */

            if(
                openButton.dataset.action ===
                "check-setup"
            ){

                checkReminderSetup();
                return;

            }


            /*
               Normal setup behavior:
               open character selection.
            */

openCharacterSelector();

        }
    );

}


    if(
        cancelButton &&
        overlay
    ){

        cancelButton.addEventListener(
            "click",
            () => {

                overlay.classList.add(
                    "hidden"
                );

            }
        );

    }
    if(distributeButton){

        distributeButton.addEventListener(
            "click",
            distributeCharacters
        );

    }
}
/* ==========================================
   Shuffle
========================================== */

function shuffleCharacters(characters){

    const shuffled = [
        ...characters
    ];


    for(
        let i = shuffled.length - 1;
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


    return shuffled;

}


/* ==========================================
   Distribute Characters
========================================== */

async function distributeCharacters(){
const validation =
    validateBag();
if(!validation.valid){
    showSetupMistake(
        validation
    );
    return;
}
trainerSetupState = {
    usingDrunk:
        validation.usingDrunk
};
    if(
        trainerSelectedCharacters.size !==
        trainerPlayerCount
    ){
        return;
    }


    /*
       Convert the selected character IDs
       into their full characters.json objects.
    */

    const selectedCharacters =
        Array.from(
            trainerSelectedCharacters
        )
        .map(
            characterId =>
                trainerCharacterData[
                    characterId
                ]
        )
        .filter(Boolean);


    if(
        selectedCharacters.length !==
        trainerPlayerCount
    ){
        return;
    }


    const characters =
        shuffleCharacters(
            selectedCharacters
        );

    /*
       Close character selection.
    */

    const selection =
        document.querySelector(
            "#character-selection"
        );

selection?.classList.add(
    "hidden"
);


    /*
       Brief pause so the modal has time
       to disappear.
    */

    await wait(120);


    /*
       Clear the existing seats.
    */

    clearPlayerCharacters();


    /*
       Send characters to seats.
    */

    for(
        let i = 0;
        i < characters.length;
        i++
    ){

        animateCharacterToSeat(
            characters[i],
            i
        );


        /*
           Controls the delay between
           each flying token.

           Smaller = faster.
    */

        await wait(70);

    }


    /*
       Allow final token to finish flying.
    */

    await wait(260);

showPrepareNightOnePopup();
}

/* ==========================================
   Show Setup Mistake
========================================== */

function showSetupMistake(
    validation
){

    const screen =
        document.querySelector(
            "#mistake-screen"
        );


    const list =
        document.querySelector(
            "#mistake-list"
        );


    if(
        !screen ||
        !list
    ){
        return;
    }


    list.innerHTML = "";


    validation.errors.forEach(
        error => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "mistake-item";


            item.textContent =
                error;


            list.appendChild(
                item
            );

        }
    );


    screen.classList.remove(
        "hidden"
    );

}


/* ==========================================
   Mistake Controls
========================================== */

function bindMistakeControls(){

    const button =
        document.querySelector(
            "#fix-mistake"
        );


    const screen =
        document.querySelector(
            "#mistake-screen"
        );


    if(
        !button ||
        !screen
    ){
        return;
    }


    button.addEventListener(
        "click",
        () => {

            screen.classList.add(
                "hidden"
            );

        }
    );

}
/* ==========================================
   Animate Character To Seat
========================================== */

function animateCharacterToSeat(
    character,
    seatIndex
){

    const layer =
        document.querySelector(
            "#distribution-layer"
        );


    const seat =
        document.querySelector(
            `.trainer-player[data-seat="${seatIndex}"]`
        );


    const target =
        seat?.querySelector(
            ".player-character"
        );


    if(
        !layer ||
        !seat ||
        !target
    ){
        return;
    }


    /*
       Create flying character.
    */

    const flying =
        document.createElement(
            "div"
        );


    flying.className =
        "distribution-token";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        character.image;


    image.alt =
        character.name;


    flying.appendChild(
        image
    );


    layer.appendChild(
        flying
    );


    /*
       Start in center.
    */

    requestAnimationFrame(
        () => {

            flying.classList.add(
                "visible"
            );

        }
    );


    /*
       Calculate destination relative
       to the board.
    */

    const board =
        document.querySelector(
            ".trainer-board"
        );


    const boardRect =
        board.getBoundingClientRect();


    const targetRect =
        target.getBoundingClientRect();


    const targetX =
        targetRect.left -
        boardRect.left +
        (
            targetRect.width /
            2
        );


    const targetY =
        targetRect.top -
        boardRect.top +
        (
            targetRect.height /
            2
        );


    /*
       Let the token briefly exist
       in the center before flying.
    */

    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    flying.style.left =
                        `${targetX}px`;

                    flying.style.top =
                        `${targetY}px`;

                    flying.style.transform =
                        `
                        translate(-50%, -50%)
                        scale(.92)
                        `;

                }
            );

        }
    );


    /*
       Replace flying token with
       actual seat contents.
    */

    window.setTimeout(
        () => {

            setPlayerCharacter(
                seat,
                character
            );


            flying.remove();

        },
        220
    );

}


/* ==========================================
   Set Player Character
========================================== */

function setPlayerCharacter(
    seat,
    character
){

    const characterBox =
        seat.querySelector(
            ".player-character"
        );


    const role =
        seat.querySelector(
            ".player-role"
        );


    if(
        !characterBox ||
        !role
    ){
        return;
    }


    /*
       Character artwork.
    */

    characterBox.innerHTML = "";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        character.image;


    image.alt =
        character.name;


    characterBox.appendChild(
        image
    );


    /*
       Character name.
    */

    role.textContent =
        character.name;


/*
   Character assigned to this seat.
*/

seat.dataset.character =
    Object.keys(
        trainerCharacterData
    ).find(
        characterId =>
            trainerCharacterData[
                characterId
            ] === character
    ) || "";


/*
   Team used for border styling.
*/

seat.dataset.team =
    normalizeTrainerTeam(
        character.team
    );

    /*
       Landing animation.
    */

    seat.classList.remove(
        "character-landed"
    );


    void seat.offsetWidth;


    seat.classList.add(
        "character-landed"
    );


    window.setTimeout(
        () => {

            seat.classList.remove(
                "character-landed"
            );

        },
        200
    );

}


/* ==========================================
   Normalize Team
========================================== */

function normalizeTrainerTeam(team){

    const normalized =
        String(team || "")
        .trim()
        .toLowerCase();


    if(
        normalized === "townsfolk"
    ){
        return "Townsfolk";
    }


    if(
        normalized === "outsider" ||
        normalized === "outsiders"
    ){
        return "Outsider";
    }


    if(
        normalized === "minion" ||
        normalized === "minions"
    ){
        return "Minion";
    }


    if(
        normalized === "demon" ||
        normalized === "demons"
    ){
        return "Demon";
    }


    return team;

}


/* ==========================================
   Clear Player Characters
========================================== */

function clearPlayerCharacters(){

    document
        .querySelectorAll(
            ".trainer-player"
        )
        .forEach(
            seat => {

                const characterBox =
                    seat.querySelector(
                        ".player-character"
                    );


                const role =
                    seat.querySelector(
                        ".player-role"
                    );


                if(characterBox){

                    characterBox.innerHTML = `

                        <span
                            class="player-character-placeholder"
                        >
                            ?
                        </span>

                    `;

                }


                if(role){

                    role.textContent =
                        "Unknown";

                }

delete seat.dataset.character;
delete seat.dataset.team;

            }
        );

}


/* ==========================================
   Finish Distribution
========================================== */

function finishCharacterDistribution(){

    const phaseNumber =
        document.querySelector(
            "#phase-number"
        );


    const phaseName =
        document.querySelector(
            "#phase-name"
        );


    const instruction =
        document.querySelector(
            "#trainer-instruction"
        );


    const status =
        document.querySelector(
            "#selection-status"
        );


    if(phaseNumber){

        phaseNumber.textContent =
            "SETUP";

    }


    if(phaseName){

        phaseName.textContent =
            "Review Characters";

    }


    if(instruction){

        instruction.textContent =
            "Review the distributed characters";

    }


    if(status){

        status.textContent =
            `${trainerPlayerCount} characters distributed`;

    }

}


/* ==========================================
   Wait
========================================== */

function wait(milliseconds){

    return new Promise(
        resolve => {

            window.setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}
/* ==========================================
   Get Expected Setup
========================================== */

function getExpectedSetup(){

    const base =
        troubleBrewingSetup[
            trainerPlayerCount
        ];


    if(!base){
        return null;
    }


    const expected = {
        ...base
    };


    /*
       Baron adds 2 Outsiders and
       removes 2 Townsfolk.
    */

    if(
        trainerSelectedCharacters.has(
            "baron"
        )
    ){

        expected.townsfolk -= 2;
        expected.outsiders += 2;

    }


    return expected;

}
/* ==========================================
   Validate Bag
========================================== */

function validateBag(){

    const expected =
        getExpectedSetup();


    if(!expected){

        return {
            valid:false,
            errors:[
                "This player count is not supported."
            ]
        };

    }


    const actual = {

        townsfolk:
            getSelectedGroupCount(
                "townsfolk"
            ),

        outsiders:
            getSelectedGroupCount(
                "outsiders"
            ),

        minions:
            getSelectedGroupCount(
                "minions"
            ),

        demons:
            getSelectedGroupCount(
                "demons"
            )

    };


    const errors = [];


    /* ======================================
       Detect Drunk Setup

       The Drunk does not have a token
       placed directly into the bag.

       Instead:

       - 1 fewer Outsider token
       - 1 extra Townsfolk token

       That extra Townsfolk will later
       receive the "Is the Drunk" reminder.
    ====================================== */

    const usingDrunk =

        expected.outsiders > 0 &&

        actual.outsiders ===
            expected.outsiders - 1 &&

        actual.townsfolk ===
            expected.townsfolk + 1;


    /*
       If we're using the Drunk,
       adjust what the physical bag
       should contain.
    */

    const bagExpected = {

        townsfolk:
            expected.townsfolk +
            (usingDrunk ? 1 : 0),

        outsiders:
            expected.outsiders -
            (usingDrunk ? 1 : 0),

        minions:
            expected.minions,

        demons:
            expected.demons

    };


    /* ======================================
       Townsfolk
    ====================================== */

    if(
        actual.townsfolk !==
        bagExpected.townsfolk
    ){

        errors.push(
            `You selected ${actual.townsfolk} Townsfolk, but this setup requires ${bagExpected.townsfolk}.`
        );

    }


    /* ======================================
       Outsiders
    ====================================== */

    if(
        actual.outsiders !==
        bagExpected.outsiders
    ){

        errors.push(
            `You selected ${actual.outsiders} Outsiders, but this setup requires ${bagExpected.outsiders}.`
        );

    }


    /* ======================================
       Minions
    ====================================== */

    if(
        actual.minions !==
        bagExpected.minions
    ){

        errors.push(
            `You selected ${actual.minions} Minions, but this setup requires ${bagExpected.minions}.`
        );

    }


    /* ======================================
       Demons
    ====================================== */

    if(
        actual.demons !==
        bagExpected.demons
    ){

        errors.push(
            `You selected ${actual.demons} Demons, but this setup requires ${bagExpected.demons}.`
        );

    }


    return {

        valid:
            errors.length === 0,

        errors,

        expected,

        bagExpected,

        actual,

        usingDrunk

    };

}
/* ==========================================
   Begin Reminder Setup
========================================== */

function beginReminderSetup(){

    const instruction =
        document.querySelector(
            "#trainer-instruction"
        );


    const phaseNumber =
        document.querySelector(
            "#phase-number"
        );


    const phaseName =
        document.querySelector(
            "#phase-name"
        );


    const reminderTray =
        document.querySelector(
            "#reminder-tray"
        );


    const mainAction =
        document.querySelector(
            "#select-characters"
        );


    const selectionStatus =
        document.querySelector(
            "#selection-status"
        );


    /*
       Header
    */

    if(instruction){

        instruction.textContent =
            "Place any required setup reminders";

    }


    /*
       Phase
    */

    if(phaseNumber){

        phaseNumber.textContent =
            "SETUP";

    }


    if(phaseName){

        phaseName.textContent =
            "Place Reminders";

    }


    /*
       Reminder tray
    */

    if(reminderTray){

        reminderTray.classList.remove(
            "hidden"
        );

    }


    /*
       Status
    */

    if(selectionStatus){

        selectionStatus.textContent =
            "Characters distributed";

    }


    /*
       Main action
    */

    if(mainAction){

        mainAction.innerHTML = `

            <span
                class="trainer-main-action-icon"
            >
                ✓
            </span>

            <span>
                Check Setup
            </span>

        `;


        mainAction.dataset.action =
            "check-setup";

    }
buildSetupReminderTray();
}
/* ==========================================
   Get Setup Reminders
========================================== */

function getSetupReminders(){

    const groups = [];


    /*
       Characters physically in the bag.
    */

    trainerSelectedCharacters.forEach(
        characterId => {

            const reminderData =
                troubleBrewingReminders[
                    characterId
                ];


            if(
                !reminderData ||
                !reminderData.reminders
            ){
                return;
            }


const setupReminders =
    reminderData.reminders.filter(
        reminder => {

            return (
                reminder.phase &&
                reminder.phase
                    .toLowerCase() ===
                    "setup"
            );

        }
    );


            if(
                setupReminders.length === 0
            ){
                return;
            }


            groups.push({

                characterId:
                    characterId,

                reminders:
                    setupReminders

            });

        }
    );


    /*
       The Drunk is special.

       The Drunk token is never physically
       selected for the bag, so add its
       reminder separately when the setup
       validator determined that the Drunk
       is being used.
    */

    if(
        trainerSetupState.usingDrunk
    ){

const drunkReminders =
    troubleBrewingReminders
        .drunk
        .reminders
        .filter(
            reminder => {

                return (
                    reminder.phase &&
                    reminder.phase
                        .toLowerCase() ===
                        "setup"
                );

            }
        );


        groups.push({

            characterId:"drunk",

            reminders:
                drunkReminders

        });

    }


    return groups;

}
/* ==========================================
   Build Setup Reminder Tray
========================================== */

function buildSetupReminderTray(){

    const list =
        document.querySelector(
            "#reminder-token-list"
        );


    if(!list){
        return;
    }


    list.innerHTML = "";


    const groups =
        getSetupReminders();


    /*
       No setup reminders needed.
    */

    if(groups.length === 0){

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "reminder-tray-empty";


        empty.textContent =
            "No setup reminders required";


        list.appendChild(
            empty
        );


        return;

    }


    groups.forEach(
        group => {

            const element =
                createReminderGroup(
                    group
                );


            list.appendChild(
                element
            );

        }
    );
buildNightOrder(
    "firstNight"
);
}
/* ==========================================
   Create Reminder Group
========================================== */
function createReminderGroup(group){
    const character =
        trainerCharacterData[
            group.characterId
        ];
    const wrapper =
        document.createElement(
            "div"
        );
    wrapper.className =
        "reminder-group";
    wrapper.dataset.character =
        group.characterId;
    const label =
        document.createElement(
            "span"
        );
    label.className =
        "reminder-group-name";
    label.textContent =
        character
            ? character.name
            : group.characterId;
    wrapper.appendChild(
        label
    );
    const tokens =
        document.createElement(
            "div"
        );
    tokens.className =
        "reminder-group-tokens";
    group.reminders.forEach(
        reminder => {
            for(
                let i = 0;
                i < reminder.count;
                i++
            ){
                tokens.appendChild(
                    createReminderToken(
                        group.characterId,
                        reminder,
                        i
                    )
                );
            }
        }
    );
    wrapper.appendChild(
        tokens
    );
    return wrapper;
}
/* ==========================================
   Create Reminder Token
========================================== */
function createReminderToken(
    characterId,
    reminder,
    index
){
    const character =
        trainerCharacterData[
            characterId
        ];
    const team =
        normalizeTrainerTeam(
            character?.team
        );
    const token =
        document.createElement(
            "button"
        );
    token.type =
        "button";
    token.className =
        "setup-reminder-token";
    token.dataset.team =
        team;
    token.dataset.character =
        characterId;
    token.dataset.reminder =
        reminder.id;
    token.dataset.copy =
        index;
    token.dataset.label =
        reminder.name;
    token.dataset.tokenId =
        `${characterId}-${reminder.id}-${index}`;
    token.title =
        reminder.rule;
    const pathId =
        `reminder-path-${characterId}-${reminder.id}-${index}`;
    token.innerHTML = `
        <span class="setup-reminder-art">
            ${
                character
                    ? `
                        <img
                            src="${character.image}"
                            alt=""
                            draggable="false"
                        >
                    `
                    : ""
            }
        </span>
        <svg
            class="setup-reminder-label"
            viewBox="0 0 100 100"
            aria-hidden="true"
        >
            <defs>
                <path
                    id="${pathId}"
                    d="M 10 69 A 46 46 0 0 0 90 69"
                ></path>
            </defs>
            <text>
                <textPath
                    href="#${pathId}"
                    startOffset="50%"
                    text-anchor="middle"
                >
                    ${reminder.name.toUpperCase()}
                </textPath>
            </text>
        </svg>
    `;
    token.addEventListener(
        "click",
        () => {
            selectReminderToken(
                token
            );
        }
    );
    return token;
}
/* ==========================================
   Select Reminder Token
========================================== */
function selectReminderToken(token){
    if(
        selectedReminder &&
        selectedReminder.token === token
    ){
        token.classList.remove(
            "selected"
        );
        selectedReminder = null;
        return;
    }
    document
        .querySelectorAll(
            ".setup-reminder-token.selected"
        )
        .forEach(
            reminderToken => {
                reminderToken.classList.remove(
                    "selected"
                );
            }
        );
    selectedReminder = {
        token:token,
        tokenId:
            token.dataset.tokenId,
        character:
            token.dataset.character,
        reminder:
            token.dataset.reminder,
        label:
            token.dataset.label
    };
    token.classList.add(
        "selected"
    );
}
/* ==========================================
   Reminder Placement
========================================== */
document.addEventListener(
    "click",
    event => {
        const placedReminder =
            event.target.closest(
                ".setup-reminder-token.placed"
            );
        if(placedReminder){
            returnReminderToTray(
                placedReminder
            );
            event.stopPropagation();
            return;
        }
        const player =
            event.target.closest(
                ".trainer-player"
            );
        if(!player){
            return;
        }
        if(!selectedReminder){
            return;
        }
        placeSelectedReminder(
            player
        );
    }
);
/* ==========================================
   Place Selected Reminder
========================================== */
function placeSelectedReminder(player){
    const reminderArea =
        player.querySelector(
            "[data-player-reminders]"
        );
    if(!reminderArea){
        return;
    }
    const token =
        document.querySelector(
            `.setup-reminder-token[data-token-id="${selectedReminder.tokenId}"]`
        );
    if(!token){
        return;
    }
    token.dataset.seat =
        player.dataset.seat;
animateReminderMove(
    token,
    reminderArea,
    () => {
        token.classList.remove(
            "selected"
        );
        token.classList.add(
            "placed"
        );
        reminderArea.appendChild(
            token
        );
        selectedReminder = null;
        updatePlacedReminderState();
    },
    player
);
}
/* ==========================================
   Return Reminder To Tray
========================================== */
function returnReminderToTray(token){
    const characterId =
        token.dataset.character;
    const trayGroup =
        document.querySelector(
            `.reminder-group[data-character="${characterId}"] .reminder-group-tokens`
        );
    if(!trayGroup){
        return;
    }
    animateReminderMove(
        token,
        trayGroup,
        () => {
            token.classList.remove(
                "placed"
            );
            delete token.dataset.seat;
            insertReminderInTrayOrder(
                trayGroup,
                token
            );
            updatePlacedReminderState();
        }
    );
}
/* ==========================================
   Keep Tray Order
========================================== */
function insertReminderInTrayOrder(
    trayGroup,
    token
){
    const tokenId =
        token.dataset.tokenId;
    const allTokens =
        Array.from(
            trayGroup.querySelectorAll(
                ".setup-reminder-token"
            )
        );
    const insertBefore =
        allTokens.find(
            otherToken =>
                otherToken.dataset.tokenId
                    .localeCompare(
                        tokenId
                    ) > 0
        );
    if(insertBefore){
        trayGroup.insertBefore(
            token,
            insertBefore
        );
    }
    else{
        trayGroup.appendChild(
            token
        );
    }
}
/* ==========================================
   Get Reminder Destination
========================================== */
function getReminderDestination(
    player,
    reminderIndex,
    tokenRect
){
    const reminderArea =
        player.querySelector(
            "[data-player-reminders]"
        );
    if(!reminderArea){
        return null;
    }
    const areaRect =
        reminderArea.getBoundingClientRect();
    const angle =
        parseFloat(
            player.style.getPropertyValue(
                "--seat-angle"
            )
        );
    if(Number.isNaN(angle)){
        return null;
    }
    const radians =
        angle *
        Math.PI /
        180;
    const directionX =
        -Math.sin(
            radians
        );
    const directionY =
        Math.cos(
            radians
        );
    const firstReminderDistance = 105;
    const reminderSpacing = 66;
    const distance =
        firstReminderDistance +
        (
            reminderIndex *
            reminderSpacing
        );
    const x =
        directionX *
        distance;
    const y =
        directionY *
        distance;
    return {
        left:
            areaRect.left +
            (
                areaRect.width / 2
            ) +
            x -
            (
                tokenRect.width / 2
            ),
        top:
            areaRect.top +
            (
                areaRect.height / 2
            ) +
            y -
            (
                tokenRect.height / 2
            )
    };
}
/* ==========================================
   Animate Reminder Move
========================================== */
function animateReminderMove(
    token,
    destination,
    onComplete,
    targetPlayer = null
){
    const startRect =
        token.getBoundingClientRect();
    const flying =
        token.cloneNode(true);
    flying.classList.remove(
        "selected",
        "placed"
    );
    flying.classList.add(
        "reminder-token-flying"
    );
    document.body.appendChild(
        flying
    );
    flying.style.left =
        `${startRect.left}px`;
    flying.style.top =
        `${startRect.top}px`;
    flying.style.width =
        `${startRect.width}px`;
    flying.style.height =
        `${startRect.height}px`;
    token.classList.add(
        "reminder-moving"
    );
    let targetX;
    let targetY;
    /*
       ======================================
       Moving TO a player
       ======================================
    */
    if(targetPlayer){
        const existingReminders =
            destination.querySelectorAll(
                ".setup-reminder-token.placed"
            );
        const reminderIndex =
            existingReminders.length;
        const finalPosition =
            getReminderDestination(
                targetPlayer,
                reminderIndex,
                startRect
            );
        if(finalPosition){
            targetX =
                finalPosition.left;
            targetY =
                finalPosition.top;
        }
    }
    if(
        targetX === undefined ||
        targetY === undefined
    ){
        const destinationRect =
            destination.getBoundingClientRect();
        targetX =
            destinationRect.left +
            (
                destinationRect.width / 2
            ) -
            (
                startRect.width / 2
            );
        targetY =
            destinationRect.top +
            (
                destinationRect.height / 2
            ) -
            (
                startRect.height / 2
            );
    }
    requestAnimationFrame(
        () => {
            requestAnimationFrame(
                () => {
                    flying.style.left =
                        `${targetX}px`;

                    flying.style.top =
                        `${targetY}px`;
                }
            );
        }
    );
    window.setTimeout(
        () => {
            flying.remove();
            token.classList.remove(
                "reminder-moving"
            );
            onComplete();
        },
        220
    );
}
/* ==========================================
   Position Player Reminders
========================================== */
function positionPlayerReminders(){
    document
        .querySelectorAll(
            ".trainer-player"
        )
        .forEach(
            player => {
                const reminderArea =
                    player.querySelector(
                        "[data-player-reminders]"
                    );
                if(!reminderArea){
                    return;
                }
                const reminders =
                    Array.from(
                        reminderArea.querySelectorAll(
                            ".setup-reminder-token.placed"
                        )
                    );
                const angle =
                    parseFloat(
                        player.style.getPropertyValue(
                            "--seat-angle"
                        )
                    );
                if(
                    Number.isNaN(angle)
                ){
                    return;
                }
                const radians =
                    angle *
                    Math.PI /
                    180;
const directionX =
    -Math.sin(
        radians
    );

const directionY =
    Math.cos(
        radians
    );
                reminders.forEach(
                    (
                        reminder,
                        index
                    ) => {
const firstReminderDistance = 105;
const reminderSpacing = 66;
const distance =
    firstReminderDistance +
    (
        index *
        reminderSpacing
    );
                        const x =
                            directionX *
                            distance;
                        const y =
                            directionY *
                            distance;
                        reminder.style.setProperty(
                            "--reminder-x",
                            `${x}px`
                        );
                        reminder.style.setProperty(
                            "--reminder-y",
                            `${y}px`
                        );
                    }
                );
            }
        );
}
/* ==========================================
   Update Reminder State
========================================== */
function updatePlacedReminderState(){
    placedReminders.length = 0;
    positionPlayerReminders();
    document
        .querySelectorAll(
            ".setup-reminder-token.placed"
        )
        .forEach(
            token => {
                placedReminders.push({
                    tokenId:
                        token.dataset.tokenId,
                    seat:
                        Number(
                            token.dataset.seat
                        ),
                    character:
                        token.dataset.character,
                    reminder:
                        token.dataset.reminder,
                    label:
                        token.dataset.label
                });
            }
        );
}
/* ==========================================
   Get Character At Seat
========================================== */

function getCharacterAtSeat(seat){

    const player =
        document.querySelector(
            `.trainer-player[data-seat="${seat}"]`
        );

    if(!player){
        return null;
    }

    return player.dataset.character || null;
}
/* ==========================================
   Validate Reminder Setup
========================================== */

function validateReminderSetup(){

    const errors = [];


    /* ======================================
       Drunk
    ====================================== */

    if(
        trainerSetupState.usingDrunk
    ){

        const drunkReminder =
            placedReminders.find(
                reminder =>
                    reminder.character === "drunk" &&
                    reminder.reminder === "is-the-drunk"
            );


        if(!drunkReminder){

            errors.push(
                "The \"Is the Drunk\" reminder must be placed on a Townsfolk player."
            );

        }
        else{

            const targetCharacterId =
                getCharacterAtSeat(
                    drunkReminder.seat
                );


            const targetCharacter =
                trainerCharacterData[
                    targetCharacterId
                ];


            const targetTeam =
                normalizeTrainerTeam(
                    targetCharacter?.team
                );


            if(
                targetTeam !==
                "Townsfolk"
            ){

                errors.push(
                    "The \"Is the Drunk\" reminder must be placed on a Townsfolk character."
                );

            }

        }

    }

/* ======================================
   Washerwoman
====================================== */
if(
    trainerSelectedCharacters.has(
        "washerwoman"
    )
){
    const townsfolkReminder =
        placedReminders.find(
            reminder =>
                reminder.character ===
                    "washerwoman" &&
                reminder.reminder ===
                    "townsfolk"
        );
    const wrongReminder =
        placedReminders.find(
            reminder =>
                reminder.character ===
                    "washerwoman" &&
                reminder.reminder ===
                    "wrong"
        );
    if(
        !townsfolkReminder ||
        !wrongReminder
    ){
        errors.push(
            "The Washerwoman needs both the \"Townsfolk\" and \"Wrong\" reminders placed."
        );
    }
    else{
        const correctTargetId =
            getCharacterAtSeat(
                townsfolkReminder.seat
            );
        const drunkReminder =
            placedReminders.find(
                reminder =>
                    reminder.character ===
                        "drunk" &&
                    reminder.reminder ===
                        "is-the-drunk"
            );
        const drunkSeat =
            drunkReminder
                ? drunkReminder.seat
                : null;
        const correctTarget =
            trainerCharacterData[
                correctTargetId
            ];
        const correctTeam =
            normalizeTrainerTeam(
                correctTarget?.team
            );
        const legalTarget =
            (
                correctTeam ===
                    "Townsfolk" &&
                townsfolkReminder.seat !==
                    drunkSeat
            ) ||
            correctTargetId ===
                "spy";
        if(!legalTarget){
            errors.push(
                "The Washerwoman\'s \"Townsfolk\" reminder must be on a Townsfolk player or the Spy. The player marked \"Is the Drunk\" does not count as a Townsfolk."
            );
        }
        if(
            townsfolkReminder.seat ===
            wrongReminder.seat
        ){
            errors.push(
                "The Washerwoman\'s \"Townsfolk\" and \"Wrong\" reminders must be on two different players."
            );
        }
    }
}
   /* ======================================
   Librarian
====================================== */
if(
    trainerSelectedCharacters.has(
        "librarian"
    )
){
    const outsiderReminder =
        placedReminders.find(
            reminder =>
                reminder.character ===
                    "librarian" &&
                reminder.reminder ===
                    "outsider"
        );
    const wrongReminder =
        placedReminders.find(
            reminder =>
                reminder.character ===
                    "librarian" &&
                reminder.reminder ===
                    "wrong"
        );
    if(
        !outsiderReminder ||
        !wrongReminder
    ){
        errors.push(
            "The Librarian needs both the \"Outsider\" and \"Wrong\" reminders placed."
        );
    }
    else{
        const correctTargetId =
            getCharacterAtSeat(
                outsiderReminder.seat
            );
        const correctTarget =
            trainerCharacterData[
                correctTargetId
            ];
        const correctTeam =
            normalizeTrainerTeam(
                correctTarget?.team
            );
        const drunkReminder =
            placedReminders.find(
                reminder =>
                    reminder.character ===
                        "drunk" &&
                    reminder.reminder ===
                        "is-the-drunk"
            );
        const drunkSeat =
            drunkReminder
                ? drunkReminder.seat
                : null;
        const legalTarget =
            correctTeam ===
                "Outsider" ||
            outsiderReminder.seat ===
                drunkSeat ||
            correctTargetId ===
                "spy";
        if(!legalTarget){
            errors.push(
                "The Librarian's \"Outsider\" reminder must be on an Outsider, the player marked \"Is the Drunk\", or the Spy."
            );
        }
        if(
            outsiderReminder.seat ===
            wrongReminder.seat
        ){
            errors.push(
                "The Librarian\'s \"Outsider\" and \"Wrong\" reminders must be on two different players."
            );
        }
    }
}
   /* ======================================
   Investigator
====================================== */
if(
    trainerSelectedCharacters.has(
        "investigator"
    )
){
    const minionReminder =
        placedReminders.find(
            reminder =>
                reminder.character ===
                    "investigator" &&
                reminder.reminder ===
                    "minion"
        );
    const wrongReminder =
        placedReminders.find(
            reminder =>
                reminder.character ===
                    "investigator" &&
                reminder.reminder ===
                    "wrong"
        );
    if(
        !minionReminder ||
        !wrongReminder
    ){
        errors.push(
            "The Investigator needs both the \"Minion\" and \"Wrong\" reminders placed."
        );
    }
    else{
        const correctTargetId =
            getCharacterAtSeat(
                minionReminder.seat
            );
        const correctTarget =
            trainerCharacterData[
                correctTargetId
            ];
        const correctTeam =
            normalizeTrainerTeam(
                correctTarget?.team
            );
        const legalTarget =
            correctTeam ===
                "Minion" ||
            correctTargetId ===
                "recluse";
        if(!legalTarget){
            errors.push(
                "The Investigator\'s \"Minion\" reminder must be on a Minion or the Recluse."
            );
        }
        if(
            minionReminder.seat ===
            wrongReminder.seat
        ){
            errors.push(
                "The Investigator\'s \"Minion\" and \"Wrong\" reminders must be on two different players."
            );
        }
    }
}
    /* ======================================
       Fortune Teller
    ====================================== */
    if(
        trainerSelectedCharacters.has(
            "fortuneteller"
        )
    ){
        const redHerring =
            placedReminders.find(
                reminder =>
                    reminder.character ===
                        "fortuneteller" &&
                    reminder.reminder ===
                        "red-herring"
            );
        if(!redHerring){
            errors.push(
                "The Fortune Teller needs a \"Red Herring\"."
            );
        }
        else{
            const targetCharacterId =
                getCharacterAtSeat(
                    redHerring.seat
                );
            const targetCharacter =
                trainerCharacterData[
                    targetCharacterId
                ];
            const targetTeam =
                normalizeTrainerTeam(
                    targetCharacter?.team
                );
            const legalTarget =
                targetTeam === "Townsfolk" ||
                targetTeam === "Outsider" ||
                targetCharacterId === "spy";
            if(!legalTarget){
                errors.push(
                    "The \"Red Herring\" must be a good player. The Spy may also register as good."
                );
            }
        }
    }
    return {
        valid:
            errors.length === 0,
        errors:
            errors
    };
}
/* ==========================================
   Check Reminder Setup
========================================== */
function checkReminderSetup(){
    updatePlacedReminderState();
    const validation =
        validateReminderSetup();
    if(!validation.valid){
        showSetupMistake(
            validation
        );
        return;
    }
    showNightOnePopup();
}
/* ==========================================
   Build Night Order
========================================== */
function buildNightOrder(
    nightType = "firstNight"
){
    const panel =
        document.querySelector(
            "#night-order-panel"
        );
    const list =
        document.querySelector(
            "#night-order-list"
        );
    const title =
        document.querySelector(
            "#night-order-title"
        );
    if(
        !panel ||
        !list
    ){
        return;
    }
    if(title){
        title.textContent =
            nightType === "firstNight"
                ? "First Night"
                : "Other Nights";
    }
    const nightCharacters =
        Object.entries(
            trainerCharacterData
        )
        .filter(
            ([id, character]) => {
                const night =
                    character
                        ?.nightOrder
                        ?.[nightType];
const team =
    normalizeTrainerTeam(
        character.team
    );
return (
    character.edition ===
        "Trouble Brewing" &&
    (
        team === "Townsfolk" ||
        team === "Outsider" ||
        team === "Minion" ||
        team === "Demon"
    ) &&
    night &&
    Number(night.order) > 0
);
            }
        )
        .sort(
            (a, b) => {
                return (
                    Number(
                        a[1]
                            .nightOrder[
                                nightType
                            ]
                            .order
                    ) -
                    Number(
                        b[1]
                            .nightOrder[
                                nightType
                            ]
                            .order
                    )
                );
            }
        );
    list.innerHTML = "";
    nightCharacters.forEach(
        ([id, character]) => {
            const night =
                character
                    .nightOrder[
                        nightType
                    ];
            const row =
                document.createElement(
                    "div"
                );
            row.className =
                "night-order-character";
            row.dataset.character =
                id;
           if(
    !trainerSelectedCharacters.has(
        id
    )
){
    row.classList.add(
        "not-in-play"
    );
}
            row.dataset.nightText =
                night.text || "";
            row.innerHTML = `
                <img
                    src="${character.image}"
                    alt=""
                    draggable="false"
                >
                <span
                    class="night-order-character-name"
                >
                    ${character.name}
                </span>
            `;
            list.appendChild(
                row
            );
        }
    );
    panel.classList.remove(
        "hidden"
    );
    initializeNightOrderTooltips();
}
/* ==========================================
   Night Order Tooltip
========================================== */
function initializeNightOrderTooltips(){
    let tooltip =
        document.querySelector(
            "#night-order-tooltip"
        );
    if(!tooltip){
        tooltip =
            document.createElement(
                "div"
            );
        tooltip.id =
            "night-order-tooltip";
        tooltip.className =
            "night-order-tooltip";
        tooltip.innerHTML = `
            <strong
                class="night-order-tooltip-name"
            ></strong>
            <span
                class="night-order-tooltip-text"
            ></span>
        `;
        document.body.appendChild(
            tooltip
        );
    }
    document
        .querySelectorAll(
            ".night-order-character"
        )
        .forEach(
            row => {
                row.addEventListener(
                    "mouseenter",
                    () => {
                        const name =
                            row.querySelector(
                                ".night-order-character-name"
                            )
                            ?.textContent ||
                            "";
                        const text =
                            row.dataset
                                .nightText ||
                            "";
                        tooltip
                            .querySelector(
                                ".night-order-tooltip-name"
                            )
                            .textContent =
                                name;
tooltip
    .querySelector(
        ".night-order-tooltip-text"
    )
    .innerHTML =
        text;
                        const rect =
                            row.getBoundingClientRect();
                        tooltip.style.left =
                            `${
                                rect.right + 12
                            }px`;
                        tooltip.style.top =
                            `${
                                rect.top +
                                (
                                    rect.height / 2
                                )
                            }px`;
                        tooltip.classList.add(
                            "visible"
                        );
                    }
                );
                row.addEventListener(
                    "mouseleave",
                    () => {
                        tooltip.classList.remove(
                            "visible"
                        );
                    }
                );
            }
        );
}
/* ==========================================
   Begin First Night
========================================== */
function beginFirstNight(){
    trainerGamePhase = "firstNight";
    const instruction =
        document.querySelector(
            "#trainer-instruction"
        );
    if(instruction){
        instruction.textContent =
            "Follow the night order";
    }
    const phaseNumber =
        document.querySelector(
            "#phase-number"
        );
    const phaseName =
        document.querySelector(
            "#phase-name"
        );
    if(phaseNumber){
        phaseNumber.textContent =
            "NIGHT 1";
    }
    if(phaseName){
        phaseName.textContent =
            "First Night";
    }
    const nightOrderPanel =
        document.querySelector(
            "#night-order-panel"
        );
    if(nightOrderPanel){
        nightOrderPanel.classList.remove(
            "hidden"
        );
    }
    const reminderTray =
        document.querySelector(
            "#reminder-tray"
        );
    if(reminderTray){
        reminderTray.classList.remove(
            "hidden"
        );
    }
    buildFirstNightReminderTray();
    const mainAction =
        document.querySelector(
            "#select-characters"
        );
if(mainAction){
    mainAction.innerHTML = `
        <span
            class="trainer-main-action-icon"
        >
            ◆
        </span>
        <span>
            End First Night
        </span>
    `;
    mainAction.dataset.action =
        "end-first-night";
}
buildActiveNightQueue(
    "firstNight"
);
updateActiveNightCharacter();
}
function buildFirstNightReminderTray(){
    const tray =
        document.querySelector(
            "#reminder-token-list"
        );
    if(!tray){
        return;
    }
    tray.innerHTML = "";
    const firstNightCharacters = [
        "poisoner",
        "butler"
    ];
    firstNightCharacters.forEach(
        characterId => {
            if(
                !trainerSelectedCharacters.has(
                    characterId
                )
            ){
                return;
            }
            const reminderData =
                troubleBrewingReminders[
                    characterId
                ];
            if(
                !reminderData ||
                !reminderData.reminders
            ){
                return;
            }
            const nightReminders =
                reminderData.reminders.filter(
                    reminder =>
                        reminder.phase ===
                        "night"
                );
            if(
                nightReminders.length === 0
            ){
                return;
            }
            const group =
                createReminderGroup({
                    characterId:
                        characterId,
                    reminders:
                        nightReminders
                });
            tray.appendChild(
                group
            );

        }
    );
}
/* ==========================================
   Trainer Phase Popup
========================================== */
function showTrainerPopup({
    title,
    content,
    buttonText = "Continue",
    onContinue = null
}){
    const popup =
        document.querySelector(
            "#trainer-phase-popup"
        );
    const titleElement =
        document.querySelector(
            "#trainer-popup-title"
        );
    const contentElement =
        document.querySelector(
            "#trainer-popup-content"
        );
    const button =
        document.querySelector(
            "#trainer-popup-action"
        );
    if(
        !popup ||
        !titleElement ||
        !contentElement ||
        !button
    ){
        return;
    }
    titleElement.textContent =
        title;
    contentElement.innerHTML =
        content;
    button.textContent =
        buttonText;
    button.onclick = () => {
        popup.classList.add(
            "hidden"
        );
        if(onContinue){
            onContinue();
        }
    };
    popup.classList.remove(
        "hidden"
    );
}
/* ==========================================
   Trainer Introduction
========================================== */
function showTrainerIntro(){
    showTrainerPopup({
        title:
            "How to Use the Trainer",
        content: `
            <p>
                Welcome to the Storyteller Trainer!
            </p>
            <p>
                You'll run through a simulated game
                of Trouble Brewing as the Storyteller.
            </p>
            <p>
                The trainer will give you players,
                character choices, night actions,
                nominations, and other situations
                that you'll need to handle correctly.
            </p>
            <p>
                When you make a mistake, the trainer
                will explain what went wrong so you
                can try again.
            </p>
        `,
        buttonText:
            "Select Characters",
        onContinue:
            () => {
                openCharacterSelector();
            }
    });
}
/* ==========================================
   Prepare Night One Popup
========================================== */
function showPrepareNightOnePopup(){
    showTrainerPopup({
        title:
            "Prepare Night One",
        content: `
            <p>
                Before the first night begins,
                prepare the Grimoire.
            </p>
            <p>
                The reminder tokens you need for
                setup are shown in the tray.
            </p>
            <p>
                Select a reminder token, then select
                the player you want to place it on.
            </p>
            <p>
                Use the character abilities and
                reminder-token rules to decide where
                each token belongs.
            </p>
        `,
        buttonText:
            "Place Reminders",
        onContinue:
            () => {
                beginReminderSetup();
            }
    });
}
/* ==========================================
   Night One Popup
========================================== */
function showNightOnePopup(){
    showTrainerPopup({
        title:
            "Night One",
        content: `
            <p>
                It's time to run the first night.
            </p>
            <p>
                Use the Night Order on the left to
                work through each character in order.
            </p>
            <p>
                Wake players when their character
                acts and respond correctly to any
                choices they make.
            </p>
            <p>
                Reminder tokens needed during the
                night will appear in the tray on
                the right.
            </p>
            <p>
                When every required character has
                acted, end the first night.
            </p>
        `,
        buttonText:
            "Begin Night One",
        onContinue:
            () => {
                beginFirstNight();
            }
    });
}
/* ==========================================
   Open Character Selector
========================================== */
function openCharacterSelector(){
    const overlay =
        document.querySelector(
            "#character-selection"
        );
    if(!overlay){
        return;
    }
    overlay.classList.remove(
        "hidden"
    );
}
/* ==========================================
   Build Active Night Queue
========================================== */
function buildActiveNightQueue(
    nightType = "firstNight"
){
    trainerNightQueue =
        Object.entries(
            trainerCharacterData
        )
        .filter(
            ([characterId, character]) => {
                if(
                    !trainerSelectedCharacters.has(
                        characterId
                    )
                ){
                    return false;
                }
                const night =
                    character
                        ?.nightOrder
                        ?.[nightType];
                return (
                    night &&
                    Number(
                        night.order
                    ) > 0
                );
            }
        )
        .sort(
            (a, b) => {
                const aOrder =
                    Number(
                        a[1]
                            .nightOrder[
                                nightType
                            ]
                            .order
                    );
                const bOrder =
                    Number(
                        b[1]
                            .nightOrder[
                                nightType
                            ]
                            .order
                    );
                return (
                    aOrder -
                    bOrder
                );
            }
        )
        .map(
            ([characterId]) =>
                characterId
        );
    trainerNightIndex =
        trainerNightQueue.length > 0
            ? 0
            : -1;
    console.log(
        "Night queue:",
        trainerNightQueue
    );
}
/* ==========================================
   Update Active Night Character
========================================== */
function updateActiveNightCharacter(){
    document
        .querySelectorAll(
            ".night-order-character"
        )
        .forEach(
            row => {
                row.classList.remove(
                    "active"
                );
            }
        );
    if(
        trainerNightIndex < 0 ||
        trainerNightIndex >=
            trainerNightQueue.length
    ){
        return;
    }
    const characterId =
        trainerNightQueue[
            trainerNightIndex
        ];
    const row =
        document.querySelector(
            `.night-order-character[data-character="${characterId}"]`
        );
    if(!row){
        return;
    }
    row.classList.add(
        "active"
    );
    row.scrollIntoView({
        block:"nearest",
        behavior:"smooth"
    });
    console.log(
        "Active night character:",
        characterId
    );
}
