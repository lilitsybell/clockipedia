console.log("storyteller-trainer.js loaded");


/* ==========================================
   Temporary Game Settings
========================================== */

const trainerPlayerCount = 12;

let trainerCharacters = {};
let selectedTrainerCharacters = [];
/* ==========================================
   Trouble Brewing SAO Order
========================================== */

const troubleBrewingSAO = [

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

    "butler",
    "drunk",
    "recluse",
    "saint",

    "poisoner",
    "spy",
    "baron",
    "scarletwoman",

    "imp"

];
const setupRequirements = {
    Townsfolk: 7,
    Outsiders: 2,
    Minions: 2,
    Demons: 1
};
/* ==========================================
   Initialize
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    buildPlayerRing();

    await loadTrainerCharacters();

    buildCharacterSelection();
initializeCharacterSelectionWindow();
});

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

    const overlay =
        document.querySelector(
            "#character-selection"
        );


    if(!openButton || !closeButton || !overlay){
        return;
    }


    openButton.addEventListener(
        "click",
        () => {

            overlay.classList.remove("hidden");

        }
    );


    closeButton.addEventListener(
        "click",
        () => {

            overlay.classList.add("hidden");

        }
    );

}
/* ==========================================
   Build Player Ring
========================================== */

function buildPlayerRing(){

    const ring =
        document.querySelector("#player-ring");

    if(!ring) return;

    ring.innerHTML = "";


    for(
        let i = 0;
        i < trainerPlayerCount;
        i++
    ){

        const player =
            document.createElement("div");

        player.className = "trainer-player";


        const angle =
            (360 / trainerPlayerCount) * i - 90;


        player.style.setProperty(
            "--player-angle",
            `${angle}deg`
        );


        player.innerHTML = `
            <div class="trainer-player-avatar">
                ${i + 1}
            </div>

            <div class="trainer-player-name">
                Player ${i + 1}
            </div>
        `;


        ring.appendChild(player);

    }

}


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
                    .filter(([slug, character]) =>
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
   Build Character Selection
========================================== */

function buildCharacterSelection(){

    const container =
        document.querySelector("#character-groups");

    if(!container) return;


    container.innerHTML = "";
buildSetupRequirements();

    const teams = [
        "Townsfolk",
        "Outsiders",
        "Minions",
        "Demons"
    ];


    teams.forEach(team => {

const characters =
    troubleBrewingSAO
        .filter(slug => {

            const character =
                trainerCharacters[slug];

            return (
                character &&
                character.team === team
            );

        })
        .map(slug => [
            slug,
            trainerCharacters[slug]
        ]);

        if(!characters.length) return;


        const group =
            document.createElement("div");

        group.className =
            `character-group team-${team.toLowerCase()}`;


        group.innerHTML = `
            <h3>${team}</h3>

            <div class="character-choice-list">
                ${characters.map(
                    ([slug, character]) => `
<button
    class="character-choice"
    data-character="${slug}"
    type="button"
>

                            <img
                                src="${character.image}"
                                alt="${character.name}"
                            >

                            <span>
                                ${character.name}
                            </span>

                        </button>
                    `
                ).join("")}
            </div>
        `;


        container.appendChild(group);

    });
container
    .querySelectorAll(".character-choice")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                toggleTrainerCharacter(
                    button.dataset.character
                );

            }
        );

    });
}
/* ==========================================
   Setup Requirements
========================================== */

function buildSetupRequirements(){

    const container =
        document.querySelector(
            "#setup-requirements"
        );

    if(!container) return;


    const teams = [
        "Townsfolk",
        "Outsiders",
        "Minions",
        "Demons"
    ];


    container.innerHTML =
        teams.map(team => `

            <div class="setup-requirement">

                <span class="requirement-team">
                    ${team}
                </span>

                <strong
                    class="requirement-count"
                    data-requirement-team="${team}"
                >
                    0 / ${setupRequirements[team]}
                </strong>

            </div>

        `).join("");

}
/* ==========================================
   Toggle Character
========================================== */

function toggleTrainerCharacter(slug){

    const existingIndex =
        selectedTrainerCharacters.indexOf(slug);


    /* Remove character */

    if(existingIndex !== -1){

        selectedTrainerCharacters.splice(
            existingIndex,
            1
        );

    }


    /* Add character */

    else{

        if(
            selectedTrainerCharacters.length >=
            trainerPlayerCount
        ){
            return;
        }

        selectedTrainerCharacters.push(slug);

    }


    updateCharacterSelection();

}
/* ==========================================
   Update Character Selection
========================================== */

function updateCharacterSelection(){

    document
        .querySelectorAll(".character-choice")
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


    const continueButton =
        document.querySelector("#continue-setup");

    if(continueButton){

        continueButton.disabled =
            selectedTrainerCharacters.length !==
            trainerPlayerCount;

    }


    updatePlayerTokens();

}
/* ==========================================
   Update Setup Counts
========================================== */

function updateSetupCounts(){

    const teams = [
        "Townsfolk",
        "Outsiders",
        "Minions",
        "Demons"
    ];


    teams.forEach(team => {

        const selectedCount =
            selectedTrainerCharacters.filter(
                slug =>
                    trainerCharacters[slug]?.team ===
                    team
            ).length;


        const display =
            document.querySelector(
                `[data-requirement-team="${team}"]`
            );


        if(display){

            display.textContent =
                `${selectedCount} / ${setupRequirements[team]}`;

            display.classList.toggle(
                "complete",
                selectedCount ===
                setupRequirements[team]
            );

        }

    });


    const total =
        document.querySelector(
            "#selection-total"
        );

    if(total){

        total.textContent =
            `${selectedTrainerCharacters.length} / ${trainerPlayerCount} characters selected`;

    }


    const distribute =
        document.querySelector(
            "#distribute-tokens"
        );

    if(distribute){

        distribute.disabled =
            selectedTrainerCharacters.length !==
            trainerPlayerCount;

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


    players.forEach((player, index) => {

        const avatar =
            player.querySelector(
                ".trainer-player-avatar"
            );


        const slug =
            selectedTrainerCharacters[index];


        /* No character selected for this seat */

        if(!slug){

            avatar.innerHTML =
                `<span>${index + 1}</span>`;

            avatar.classList.remove(
                "has-character"
            );

            return;

        }


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

    });

}
