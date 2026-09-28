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
   Trouble Brewing Characters
========================================== */

const trainerCharacters = {

    townsfolk: [

        {
            id:"washerwoman",
            name:"Washerwoman",
            team:"Townsfolk"
        },

        {
            id:"librarian",
            name:"Librarian",
            team:"Townsfolk"
        },

        {
            id:"investigator",
            name:"Investigator",
            team:"Townsfolk"
        },

        {
            id:"chef",
            name:"Chef",
            team:"Townsfolk"
        },

        {
            id:"empath",
            name:"Empath",
            team:"Townsfolk"
        },

        {
            id:"fortuneteller",
            name:"Fortune Teller",
            team:"Townsfolk"
        },

        {
            id:"undertaker",
            name:"Undertaker",
            team:"Townsfolk"
        },

        {
            id:"monk",
            name:"Monk",
            team:"Townsfolk"
        },

        {
            id:"ravenkeeper",
            name:"Ravenkeeper",
            team:"Townsfolk"
        },

        {
            id:"virgin",
            name:"Virgin",
            team:"Townsfolk"
        },

        {
            id:"slayer",
            name:"Slayer",
            team:"Townsfolk"
        },

        {
            id:"soldier",
            name:"Soldier",
            team:"Townsfolk"
        },

        {
            id:"mayor",
            name:"Mayor",
            team:"Townsfolk"
        }

    ],


    outsiders: [

        {
            id:"butler",
            name:"Butler",
            team:"Outsider"
        },

        {
            id:"drunk",
            name:"Drunk",
            team:"Outsider"
        },

        {
            id:"recluse",
            name:"Recluse",
            team:"Outsider"
        },

        {
            id:"saint",
            name:"Saint",
            team:"Outsider"
        }

    ],


    minions: [

        {
            id:"poisoner",
            name:"Poisoner",
            team:"Minion"
        },

        {
            id:"spy",
            name:"Spy",
            team:"Minion"
        },

        {
            id:"baron",
            name:"Baron",
            team:"Minion"
        },

        {
            id:"scarletwoman",
            name:"Scarlet Woman",
            team:"Minion"
        }

    ],


    demons: [

        {
            id:"imp",
            name:"Imp",
            team:"Demon"
        }

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
    () => {

        buildPlayerRing();

        buildCharacterSelection();

        updateCharacterSelection();

        bindCharacterSelectionControls();

    }
);


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


/* ==========================================
   Build Character Selection
========================================== */

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
        trainerCharacters
    ).forEach(
        ([group, characters]) => {

            const row =
                createCharacterRow(
                    group,
                    characters
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
    characters
){

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "character-row";


    row.dataset.group =
        group;


    characters.forEach(
        character => {

            const button =
                createCharacterButton(
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
        character.id;


    button.dataset.group =
        group;


    button.dataset.team =
        character.team;


    button.innerHTML = `

        <span class="character-option-art">

            <img
                src="/images/storyteller-trainer/${character.id}.png"
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
                character.id
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

    Object.keys(
        trainerCharacters
    ).forEach(
        group => {

            const count =
                getSelectedGroupCount(
                    group
                );


            const target =
                trainerRequirements[
                    group
                ];


            const counter =
                document.querySelector(
                    `[data-requirement="${group}"]`
                );


            if(!counter){
                return;
            }


            counter.textContent =
                `${count} / ${target}`;

        }
    );

}


/* ==========================================
   Count Selected Characters In Group
========================================== */

function getSelectedGroupCount(group){

    return trainerCharacters[
        group
    ].filter(
        character =>
            trainerSelectedCharacters.has(
                character.id
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
            "#distribute-tokens"
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
