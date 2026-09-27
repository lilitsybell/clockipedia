console.log("storyteller-trainer.js loaded");


/* ==========================================
   Temporary Game Settings
========================================== */

const trainerPlayerCount = 12;

let trainerCharacters = {};
let selectedTrainerCharacters = [];

/* ==========================================
   Initialize
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    buildPlayerRing();

    await loadTrainerCharacters();

    buildCharacterSelection();

});


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


    const teams = [
        "Townsfolk",
        "Outsiders",
        "Minions",
        "Demons"
    ];


    teams.forEach(team => {

        const characters =
            Object.entries(trainerCharacters)
                .filter(
                    ([slug, character]) =>
                        character.team === team
                );


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


    const count =
        document.querySelector("#selected-count");

    if(count){

        count.textContent =
            `${selectedTrainerCharacters.length} / ${trainerPlayerCount}`;

    }


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
