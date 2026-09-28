console.log("storyteller-trainer.js loaded");


/* ==========================================
   Game Settings
========================================== */

const trainerPlayerCount = 12;

let trainerCharacters = {};

let selectedTrainerCharacters = [];

let distributedTrainerCharacters = [];


/* ==========================================
   Trouble Brewing SAO Order
========================================== */

const troubleBrewingSAO = [

    /* Townsfolk */

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
    "mayor",


    /* Outsiders */

    "butler",
    "drunk",
    "recluse",
    "saint",


    /* Minions */

    "poisoner",
    "spy",
    "baron",
    "scarletwoman",


    /* Demon */

    "imp"

];


/* ==========================================
   Setup Requirements
========================================== */

const setupRequirements = {

    Townsfolk: 7,
    Outsiders: 2,
    Minions: 2,
    Demons: 1

};


/* ==========================================
   Team Display
========================================== */

const setupTeams = [

    "Townsfolk",
    "Outsiders",
    "Minions",
    "Demons"

];


/* ==========================================
   Initialize
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        buildPlayerRing();

        await loadTrainerCharacters();

        buildCharacterSelection();

        initializeCharacterSelectionWindow();

        updateCharacterSelection();

    }
);


/* ==========================================
   Load Characters
========================================== */

async function loadTrainerCharacters(){

    try{

        const response =
            await fetch("/data/characters.json");


        if(!response.ok){

            throw new Error(
                "Could not load characters.json"
            );

        }


        const allCharacters =
            await response.json();


        trainerCharacters =
            Object.fromEntries(

                Object.entries(allCharacters)
                    .filter(
                        ([slug, character]) =>
                            character.edition ===
                            "Trouble Brewing"
                    )

            );


        console.log(
            "Trouble Brewing characters:",
            trainerCharacters
        );

    }

    catch(error){

        console.error(
            "Could not load trainer characters:",
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


    if(!ring) return;


    ring.innerHTML = "";


    for(
        let i = 0;
        i < trainerPlayerCount;
        i++
    ){

        const player =
            document.createElement("div");


        player.className =
            "trainer-player";


        player.dataset.seat =
            i;


        const angle =
            (360 / trainerPlayerCount) * i - 90;


        player.style.setProperty(
            "--player-angle",
            `${angle}deg`
        );


        player.innerHTML = `

            <div class="trainer-player-avatar">

                <span>
                    ${i + 1}
                </span>

            </div>

            <div class="trainer-player-name">
                Player ${i + 1}
            </div>

        `;


        ring.appendChild(player);

    }

}


/* ==========================================
   Character Selection Window
========================================== */

function initializeCharacterSelectionWindow(){

    const openButton =
        document.querySelector(
            "#open-character-selection"
        );

    const closeButton =
        document.querySelector(
            "#close-character-selection"
        );

    const distributeButton =
        document.querySelector(
            "#distribute-tokens"
        );

    const overlay =
        document.querySelector(
            "#character-selection"
        );


    if(
        !openButton ||
        !closeButton ||
        !distributeButton ||
        !overlay
    ){
        return;
    }


    /* Open */

    openButton.addEventListener(
        "click",
        () => {

            overlay.classList.remove(
                "hidden"
            );

        }
    );


    /* Cancel */

    closeButton.addEventListener(
        "click",
        () => {

            overlay.classList.add(
                "hidden"
            );

        }
    );


    /* Distribute */

    distributeButton.addEventListener(
        "click",
        () => {

            distributeTrainerTokens();

        }
    );

}


/* ==========================================
   Build Character Selection
========================================== */

function buildCharacterSelection(){

    const container =
        document.querySelector(
            "#character-groups"
        );


    if(!container) return;


    container.innerHTML = "";


    troubleBrewingSAO.forEach(slug => {

        const character =
            trainerCharacters[slug];


        if(!character){

            console.warn(
                `Missing Trouble Brewing character: ${slug}`
            );

            return;

        }


        const button =
            document.createElement("button");


        button.type =
            "button";


        button.className =
            "character-choice";


        button.dataset.character =
            slug;


        button.dataset.team =
            character.team;


        button.title =
            character.name;


        button.innerHTML = `

            <img
                src="${character.image}"
                alt="${character.name}"
            >

            <span>
                ${character.name}
            </span>

        `;


        button.addEventListener(
            "click",
            () => {

                toggleTrainerCharacter(
                    slug
                );

            }
        );


        container.appendChild(
            button
        );

    });


    buildSetupRequirements();

}


/* ==========================================
   Build Setup Requirements
========================================== */

function buildSetupRequirements(){

    const container =
        document.querySelector(
            "#setup-requirements"
        );


    if(!container) return;


    container.innerHTML =
        setupTeams
            .map(team => {

                return `

                    <div
                        class="setup-requirement"
                        title="${team}"
                    >

                        <span
                            class="requirement-dot"
                        ></span>

                        <strong
                            class="requirement-count"
                            data-requirement-team="${team}"
                        >
                            ${setupRequirements[team]}
                        </strong>

                    </div>

                `;

            })
            .join("");

}

/* ==========================================
   Toggle Character
========================================== */

function toggleTrainerCharacter(slug){

    const character =
        trainerCharacters[slug];

    if(!character) return;


    const existingIndex =
        selectedTrainerCharacters.indexOf(
            slug
        );


    /* Remove */

    if(existingIndex !== -1){

        selectedTrainerCharacters.splice(
            existingIndex,
            1
        );

    }


    /* Add */

    else{

        if(
            selectedTrainerCharacters.length >=
            trainerPlayerCount
        ){
            return;
        }


        selectedTrainerCharacters.push(
            slug
        );

    }


    updateCharacterSelection();

}
/* ==========================================
   Update Character Selection
========================================== */

function updateCharacterSelection(){

    document
        .querySelectorAll(
            ".character-choice"
        )
        .forEach(button => {

            const slug =
                button.dataset.character;


            const selected =
                selectedTrainerCharacters.includes(
                    slug
                );


            button.classList.toggle(
                "selected",
                selected
            );

        });


    updateSetupCounts();

}


/* ==========================================
   Update Setup Counts
========================================== */

function updateSetupCounts(){

    let setupComplete = true;


    setupTeams.forEach(team => {

        const selectedCount =
            getSelectedTeamCount(
                team
            );


        const requiredCount =
            setupRequirements[team];


        const display =
            document.querySelector(
                `[data-requirement-team="${team}"]`
            );


        if(display){

            display.textContent =
                `${selectedCount}/${requiredCount}`;


            display.classList.toggle(
                "complete",
                selectedCount ===
                requiredCount
            );

        }


        if(
            selectedCount !==
            requiredCount
        ){

            setupComplete = false;

        }

    });


    /* ======================================
       Total
    ====================================== */

    const total =
        document.querySelector(
            "#selection-total"
        );


    if(total){

        total.textContent =
            `${selectedTrainerCharacters.length} / ${trainerPlayerCount} selected`;

    }


    /* ======================================
       Distribute Button
    ====================================== */

    const distributeButton =
        document.querySelector(
            "#distribute-tokens"
        );


    if(distributeButton){

        distributeButton.disabled =
            !setupComplete;

    }

}


/* ==========================================
   Get Selected Team Count
========================================== */

function getSelectedTeamCount(team){

    return selectedTrainerCharacters
        .filter(slug => {

            return (
                trainerCharacters[slug]?.team ===
                team
            );

        })
        .length;

}


/* ==========================================
   Shuffle
========================================== */

function shuffleArray(array){

    const shuffled =
        [...array];


    for(
        let i = shuffled.length - 1;
        i > 0;
        i--
    ){

        const j =
            Math.floor(
                Math.random() * (i + 1)
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
   Distribute Tokens
========================================== */

function distributeTrainerTokens(){

    if(
        selectedTrainerCharacters.length !==
        trainerPlayerCount
    ){
        return;
    }


    distributedTrainerCharacters =
        shuffleArray(
            selectedTrainerCharacters
        );


    updatePlayerTokens();


    const overlay =
        document.querySelector(
            "#character-selection"
        );


    if(overlay){

        overlay.classList.add(
            "hidden"
        );

    }


    const openButton =
        document.querySelector(
            "#open-character-selection"
        );


    if(openButton){

        openButton.textContent =
            "Characters Distributed";

    }


    const phaseName =
        document.querySelector(
            ".phase-name"
        );


    if(phaseName){

        phaseName.textContent =
            "Review Characters";

    }

}


/* ==========================================
   Update Player Tokens
========================================== */

function updatePlayerTokens(){

    const players =
        document.querySelectorAll(
            ".trainer-player"
        );


    players.forEach(
        (player, index) => {

            const avatar =
                player.querySelector(
                    ".trainer-player-avatar"
                );


            if(!avatar) return;


            const slug =
                distributedTrainerCharacters[
                    index
                ];


            /* ==================================
               Empty Seat
            ================================== */

            if(!slug){

                avatar.innerHTML = `

                    <span>
                        ${index + 1}
                    </span>

                `;


                avatar.classList.remove(
                    "has-character"
                );


                return;

            }


            /* ==================================
               Character
            ================================== */

            const character =
                trainerCharacters[slug];


            if(!character) return;


            avatar.innerHTML = `

                <img
                    src="${character.image}"
                    alt="${character.name}"
                >

            `;


            avatar.classList.add(
                "has-character"
            );

        }
    );

}
