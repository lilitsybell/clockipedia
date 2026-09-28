console.log("storyteller-trainer.js loaded");


/* ==========================================
   Game Settings
========================================== */

const trainerPlayerCount = 12;


/* ==========================================
   Player Names
========================================== */

const trainerPlayerNames = [

    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
    "Player 5",
    "Player 6",
    "Player 7",
    "Player 8",
    "Player 9",
    "Player 10",
    "Player 11",
    "Player 12"

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

                overlay.classList.remove(
                    "hidden"
                );

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

}
