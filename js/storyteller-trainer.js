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
    Outsider: 2,
    Minion: 2,
    Demon: 1

};


/* ==========================================
   Team Display Order
========================================== */

const setupTeams = [

    "Townsfolk",
    "Outsider",
    "Minion",
    "Demon"

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
            await fetch(
                "/data/characters.json"
            );


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
            document.createElement(
                "div"
            );


        player.className =
            "trainer-player";


        player.dataset.seat =
            i;


        const angle =
            (360 / trainerPlayerCount) *
            i -
            90;


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


        ring.appendChild(
            player
        );

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


    troubleBrewingSAO.forEach(
        slug => {

            const character =
                trainerCharacters[slug];


            if(!character){

                console.warn(
                    `Missing Trouble Brewing character: ${slug}`
                );

                return;

            }


            const button =
                document.createElement(
                    "button"
                );


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

        }
    );


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
            .map(
                team => {

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
                                0/${setupRequirements[team]}
                            </strong>

                        </div>

                    `;

                }
            )
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


    /* ======================================
       Remove
    ====================================== */

    if(existingIndex !== -1){

        selectedTrainerCharacters.splice(
            existingIndex,
            1
        );

    }


    /* ======================================
       Add
    ====================================== */

    else{

        /*
           The trainee may make an incorrect
           team distribution.

           We only stop them once the bag
           contains the correct TOTAL number
           of characters.
        */

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
        .forEach(
            button => {

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

            }
        );


    updateSetupCounts();

}


/* ==========================================
   Update Setup Counts
========================================== */

function updateSetupCounts(){

    setupTeams.forEach(
        team => {

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

            }

        }
    );


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
            selectedTrainerCharacters.length !==
            trainerPlayerCount;

    }

}


/* ==========================================
   Get Selected Team Count
========================================== */

function getSelectedTeamCount(team){

    return selectedTrainerCharacters
        .filter(
            slug => {

                return (
                    trainerCharacters[slug]?.team ===
                    team
                );

            }
        )
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
   Distribute Tokens
========================================== */

async function distributeTrainerTokens(){

    if(
        selectedTrainerCharacters.length !==
        trainerPlayerCount
    ){
        return;
    }


    /* ======================================
       Randomize Seating
    ====================================== */

    distributedTrainerCharacters =
        shuffleArray(
            selectedTrainerCharacters
        );


    /* ======================================
       Close Character Selector
    ====================================== */

    const overlay =
        document.querySelector(
            "#character-selection"
        );


    if(overlay){

        overlay.classList.add(
            "hidden"
        );

    }


    /* ======================================
       Hide Setup Button
    ====================================== */

    const openButton =
        document.querySelector(
            "#open-character-selection"
        );


    if(openButton){

        openButton.classList.add(
            "hidden"
        );

    }


    /* ======================================
       Animate Distribution
    ====================================== */

    await animateTokenDistribution();


    /* ======================================
       Update Phase
    ====================================== */

    const phaseName =
        document.querySelector(
            ".phase-name"
        );


    if(phaseName){

        phaseName.textContent =
            "Review Characters";

    }


    /* ======================================
       Restore Setup Button
    ====================================== */

    if(openButton){

        openButton.textContent =
            "Change Characters";


        openButton.classList.remove(
            "hidden"
        );

    }

}


/* ==========================================
   Animate Token Distribution
========================================== */

async function animateTokenDistribution(){

    const game =
        document.querySelector(
            "#trainer-game"
        );

    const townSquare =
        document.querySelector(
            "#town-square"
        );

    const players =
        Array.from(
            document.querySelectorAll(
                ".trainer-player"
            )
        );


    if(
        !game ||
        !townSquare ||
        players.length === 0
    ){

        updatePlayerTokens();

        return;

    }


    /* ======================================
       Clear Current Player Tokens
    ====================================== */

    clearPlayerTokens();


    /* ======================================
       Animation Layer
    ====================================== */

    const animationLayer =
        document.createElement(
            "div"
        );


    animationLayer.className =
        "token-distribution-layer";


    game.appendChild(
        animationLayer
    );


    /* ======================================
       Town Square Center
    ====================================== */

    const gameRect =
        game.getBoundingClientRect();

    const squareRect =
        townSquare.getBoundingClientRect();


    const centerX =
        squareRect.left -
        gameRect.left +
        squareRect.width / 2;


    const centerY =
        squareRect.top -
        gameRect.top +
        squareRect.height / 2;


    /* ======================================
       Build Token Stack
    ====================================== */

    const flyingTokens = [];


    distributedTrainerCharacters
        .forEach(
            (slug, index) => {

                const character =
                    trainerCharacters[slug];


                if(!character) return;


                const token =
                    document.createElement(
                        "div"
                    );


                token.className =
                    "distribution-token";


                token.innerHTML = `

                    <img
                        src="${character.image}"
                        alt=""
                    >

                `;


                /* Random pile position */

                const offsetX =
                    Math.random() *
                    14 -
                    7;

                const offsetY =
                    Math.random() *
                    14 -
                    7;

                const rotation =
                    Math.random() *
                    20 -
                    10;


                token.style.left =
                    `${centerX + offsetX}px`;


                token.style.top =
                    `${centerY + offsetY}px`;


                token.style.transform =
                    `
                        translate(-50%, -50%)
                        rotate(${rotation}deg)
                        scale(.85)
                    `;


                token.style.zIndex =
                    100 + index;


                animationLayer.appendChild(
                    token
                );


                flyingTokens.push({

                    token,
                    slug,
                    character,
                    player:players[index]

                });

            }
        );


    /* ======================================
       Brief Pause
    ====================================== */

    await wait(180);


    /* ======================================
       Shuffle Effect
    ====================================== */

    flyingTokens.forEach(
        ({token}) => {

            const x =
                Math.random() *
                34 -
                17;

            const y =
                Math.random() *
                34 -
                17;

            const rotation =
                Math.random() *
                35 -
                17.5;


            token.style.transition =
                "transform 160ms ease";


            token.style.transform =
                `
                    translate(
                        calc(-50% + ${x}px),
                        calc(-50% + ${y}px)
                    )
                    rotate(${rotation}deg)
                    scale(.95)
                `;

        }
    );


    await wait(180);


    /* ======================================
       Send Tokens to Players
    ====================================== */

    for(
        const item of flyingTokens
    ){

        await animateTokenToPlayer(
            item
        );

    }


    /* ======================================
       Cleanup
    ====================================== */

    animationLayer.remove();

}


/* ==========================================
   Animate One Token to Player
========================================== */

async function animateTokenToPlayer(
    item
){

    const {
        token,
        slug,
        character,
        player
    } = item;


    const game =
        document.querySelector(
            "#trainer-game"
        );


    const avatar =
        player.querySelector(
            ".trainer-player-avatar"
        );


    if(
        !game ||
        !avatar
    ){
        return;
    }


    const gameRect =
        game.getBoundingClientRect();

    const avatarRect =
        avatar.getBoundingClientRect();


    const destinationX =
        avatarRect.left -
        gameRect.left +
        avatarRect.width / 2;


    const destinationY =
        avatarRect.top -
        gameRect.top +
        avatarRect.height / 2;


    /* ======================================
       Fly to Seat
    ====================================== */

    token.style.transition =
        `
            left 280ms cubic-bezier(.2,.8,.2,1),
            top 280ms cubic-bezier(.2,.8,.2,1),
            transform 280ms cubic-bezier(.2,.8,.2,1)
        `;


    token.style.left =
        `${destinationX}px`;


    token.style.top =
        `${destinationY}px`;


    token.style.transform =
        `
            translate(-50%, -50%)
            rotate(0deg)
            scale(1)
        `;


    /*
       Start the next token slightly before
       this one completely finishes.
    */

    await wait(190);


    /* ======================================
       Place Character
    ====================================== */

    setPlayerCharacter(
        avatar,
        slug,
        character
    );


    /* ======================================
       Landing Pop
    ====================================== */

    avatar.classList.add(
        "token-landed"
    );


    token.remove();


    await wait(45);


    avatar.classList.remove(
        "token-landed"
    );

}


/* ==========================================
   Clear Player Tokens
========================================== */

function clearPlayerTokens(){

    document
        .querySelectorAll(
            ".trainer-player"
        )
        .forEach(
            (player, index) => {

                const avatar =
                    player.querySelector(
                        ".trainer-player-avatar"
                    );


                if(!avatar) return;


                avatar.innerHTML = `

                    <span>
                        ${index + 1}
                    </span>

                `;


                avatar.classList.remove(
                    "has-character",
                    "team-good",
                    "team-evil"
                );

            }
        );

}


/* ==========================================
   Set Player Character
========================================== */

function setPlayerCharacter(
    avatar,
    slug,
    character
){

    /* ======================================
       Reset Team Classes
    ====================================== */

    avatar.classList.remove(
        "team-good",
        "team-evil"
    );


    /* ======================================
       Character Image
    ====================================== */

    avatar.innerHTML = `

        <img
            src="${character.image}"
            alt="${character.name}"
        >

    `;


    avatar.classList.add(
        "has-character"
    );


    /* ======================================
       Good Team Border
    ====================================== */

    if(
        character.team ===
        "Townsfolk" ||

        character.team ===
        "Outsider"
    ){

        avatar.classList.add(
            "team-good"
        );

    }


    /* ======================================
       Evil Team Border
    ====================================== */

    if(
        character.team ===
        "Minion" ||

        character.team ===
        "Demon"
    ){

        avatar.classList.add(
            "team-evil"
        );

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
                    "has-character",
                    "team-good",
                    "team-evil"
                );


                return;

            }


            /* ==================================
               Character
            ================================== */

            const character =
                trainerCharacters[slug];


            if(!character) return;


            setPlayerCharacter(
                avatar,
                slug,
                character
            );

        }
    );

}


/* ==========================================
   Wait
========================================== */

function wait(milliseconds){

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}
