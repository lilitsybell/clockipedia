console.log(
    "name-every-character.js loaded"
);


/* ==========================================
   Team Order
========================================== */

const nameEveryCharacterTeams = [

    {
        key:
            "Townsfolk",

        label:
            "Townsfolk"
    },

    {
        key:
            "Outsider",

        label:
            "Outsiders"
    },

    {
        key:
            "Minion",

        label:
            "Minions"
    },

    {
        key:
            "Demon",

        label:
            "Demons"
    },

    {
        key:
            "Traveller",

        label:
            "Travellers"
    },

    {
        key:
            "Loric",

        label:
            "Loric"
    },

    {
        key:
            "Fabled",

        label:
            "Fabled"
    }

];

let nameEveryCharacterGuessed =
    new Set();
/* ==========================================
   Start
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try{

            await loadCharacters();

            renderNameEveryCharacterBoard();
            setupNameEveryCharacterInput();

updateNameEveryCharacterProgress();

        }
        catch(error){

            console.error(
                "Name Every Character failed:",
                error
            );

        }

    }
);


/* ==========================================
   Render Board
========================================== */

function renderNameEveryCharacterBoard(){

    const board =
        document.querySelector(
            "#nameEveryCharacterBoard"
        );


    board.innerHTML =
        "";


    nameEveryCharacterTeams.forEach(
        teamInfo => {

            const teamCharacters =
                Object.entries(
                    characters
                )
                .filter(
                    ([
                        slug,
                        character
                    ]) => {

                        return normalizeNameEveryCharacterTeam(
                            character.team
                        ) ===
                        teamInfo.key;

                    }
                )
                .sort(
                    (
                        [, characterA],
                        [, characterB]
                    ) => {

                        return characterA.name.localeCompare(
                            characterB.name
                        );

                    }
                );


            if(
                !teamCharacters.length
            ){

                return;

            }


            const section =
                buildNameEveryCharacterTeam(
                    teamInfo,
                    teamCharacters
                );


            board.appendChild(
                section
            );

        }
    );

}


/* ==========================================
   Build Team
========================================== */

function buildNameEveryCharacterTeam(
    teamInfo,
    teamCharacters
){

    const section =
        document.createElement(
            "section"
        );


    section.className =
        "name-every-character-team";


    section.dataset.team =
        teamInfo.key;


    const header =
        document.createElement(
            "div"
        );


    header.className =
        "name-every-character-team-header";


    const title =
        document.createElement(
            "h2"
        );


    title.className =
        "name-every-character-team-title";


    title.textContent =
        teamInfo.label;


    const count =
        document.createElement(
            "span"
        );


    count.className =
        "name-every-character-team-count";


    count.textContent =
        `0 / ${teamCharacters.length}`;


    const grid =
        document.createElement(
            "div"
        );


    grid.className =
        "name-every-character-grid";


    teamCharacters.forEach(
        ([
            slug,
            character
        ]) => {

            grid.appendChild(
                buildNameEveryCharacterSlot(
                    slug,
                    character
                )
            );

        }
    );


    header.appendChild(
        title
    );


    header.appendChild(
        count
    );


    section.appendChild(
        header
    );


    section.appendChild(
        grid
    );


    return section;

}


/* ==========================================
   Build Hidden Character Slot
========================================== */

function buildNameEveryCharacterSlot(
    slug,
    character
){

    const slot =
        document.createElement(
            "div"
        );


    slot.className =
        "name-every-character-slot";


    slot.dataset.character =
        slug;


    const image =
        document.createElement(
            "div"
        );


    image.className =
        "name-every-character-slot-image";


    image.textContent =
        "?";


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "name-every-character-slot-name";


    slot.appendChild(
        image
    );


    slot.appendChild(
        name
    );


    return slot;

}


/* ==========================================
   Normalize Team Names
========================================== */

function normalizeNameEveryCharacterTeam(
    team
){

    const map = {

        Townsfolk:
            "Townsfolk",

        Outsider:
            "Outsider",

        Outsiders:
            "Outsider",

        Minion:
            "Minion",

        Minions:
            "Minion",

        Demon:
            "Demon",

        Demons:
            "Demon",

        Traveller:
            "Traveller",

        Travellers:
            "Traveller",

        Loric:
            "Loric",

        Fabled:
            "Fabled"

    };


    return map[team] ||
        team;

}
/* ==========================================
   Guess Input
========================================== */

function setupNameEveryCharacterInput(){

    const input =
        document.querySelector(
            "#nameEveryCharacterInput"
        );


    input.addEventListener(
        "input",
        () => {

            const guess =
                normalizeNameEveryCharacterGuess(
                    input.value
                );


            if(!guess){
                return;
            }


const match =
    Object.entries(
        characters
    )
    .find(
        ([
            slug,
            character
        ]) => {

            if(
                nameEveryCharacterGuessed.has(
                    slug
                )
            ){

                return false;

            }


            return normalizeNameEveryCharacterGuess(
                character.name
            ) ===
            guess;

        }
    );


            if(!match){
                return;
            }


            const [
                slug,
                character
            ] =
                match;


            nameEveryCharacterGuessed.add(
                slug
            );


            revealNameEveryCharacter(
                slug,
                character
            );


            input.value =
                "";


            updateNameEveryCharacterProgress();

        }
    );

}


/* ==========================================
   Normalize Guess
========================================== */

function normalizeNameEveryCharacterGuess(
    text
){

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]/g,
            ""
        );

}


/* ==========================================
   Reveal Character
========================================== */

function revealNameEveryCharacter(
    slug,
    character
){

    const slot =
        document.querySelector(
            `[data-character="${slug}"]`
        );


    if(!slot){
        return;
    }


    slot.classList.add(
        "guessed"
    );


    const image =
        slot.querySelector(
            ".name-every-character-slot-image"
        );


    const name =
        slot.querySelector(
            ".name-every-character-slot-name"
        );


    image.innerHTML =
        "";


    const token =
        document.createElement(
            "img"
        );


    token.src =
        character.image;


    token.alt =
        character.name;


    image.appendChild(
        token
    );


    name.textContent =
        character.name;

}


/* ==========================================
   Progress
========================================== */

function updateNameEveryCharacterProgress(){

    const progress =
        document.querySelector(
            "#nameEveryCharacterProgress"
        );


    const total =
        Object.keys(
            characters
        ).length;


    progress.textContent =
        `${nameEveryCharacterGuessed.size} / ${total}`;

}
