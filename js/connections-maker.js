console.log(
    "connections-maker.js loaded"
);

let connectionsMakerActiveSlot =
    null;


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try{

            await loadCharacters();

            setupConnectionsMakerSlots();

            setupConnectionsCharacterPicker();

        }
        catch(error){

            console.error(
                "Connections Maker failed:",
                error
            );

        }

    }
);


/* ==========================================
   Maker Slots
========================================== */

function setupConnectionsMakerSlots(){

    document
        .querySelectorAll(
            ".connections-maker-slots button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openConnectionsCharacterPicker(
                            button
                        );

                    }
                );

            }
        );

}


/* ==========================================
   Picker Setup
========================================== */

function setupConnectionsCharacterPicker(){

    const closeButton =
        document.querySelector(
            "#connectionsCharacterPickerClose"
        );

    const backdrop =
        document.querySelector(
            ".connections-character-picker-backdrop"
        );

    const search =
        document.querySelector(
            "#connectionsCharacterSearch"
        );


    closeButton.addEventListener(
        "click",
        closeConnectionsCharacterPicker
    );


    backdrop.addEventListener(
        "click",
        closeConnectionsCharacterPicker
    );


    search.addEventListener(
        "input",
        () => {

            renderConnectionsCharacterPicker(
                search.value
            );

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key ===
                "Escape"
            ){

                closeConnectionsCharacterPicker();

            }

        }
    );

}


/* ==========================================
   Open / Close Picker
========================================== */

function openConnectionsCharacterPicker(
    slot
){

    connectionsMakerActiveSlot =
        slot;

    const picker =
        document.querySelector(
            "#connectionsCharacterPicker"
        );

    const search =
        document.querySelector(
            "#connectionsCharacterSearch"
        );

    search.value =
        "";

    picker.hidden =
        false;

    renderConnectionsCharacterPicker();

    setTimeout(
        () => {

            search.focus();

        },
        0
    );

}


function closeConnectionsCharacterPicker(){

    const picker =
        document.querySelector(
            "#connectionsCharacterPicker"
        );

    picker.hidden =
        true;

    connectionsMakerActiveSlot =
        null;

}


/* ==========================================
   Render Picker
========================================== */
function renderConnectionsCharacterPicker(
    searchTerm = ""
){

    const grid =
        document.querySelector(
            "#connectionsCharacterPickerGrid"
        );

    grid.innerHTML =
        "";


    const normalizedSearch =
        searchTerm
            .trim()
            .toLowerCase();


    const usedCharacters =
        new Set(
            Array.from(
                document.querySelectorAll(
                    ".connections-maker-slots button[data-character]"
                )
            )
            .map(
                button =>
                    button.dataset.character
            )
        );


    const currentCharacter =
        connectionsMakerActiveSlot
            ?.dataset.character;


    const characterList =
        Object.entries(
            characters
        )
        .filter(
            ([slug, character]) => {

                if(!normalizedSearch){
                    return true;
                }

                return (
                    character.name
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        )
                );

            }
        )
        .sort(
            (
                [, characterA],
                [, characterB]
            ) => {

                return characterA.name
                    .localeCompare(
                        characterB.name
                    );

            }
        );


    characterList.forEach(
        ([slug, character]) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "connections-character-picker-option";


            const alreadyUsed =
                usedCharacters.has(
                    slug
                ) &&
                slug !==
                currentCharacter;


            if(alreadyUsed){

                button.disabled =
                    true;

                button.classList.add(
                    "used"
                );

            }


            const image =
                document.createElement(
                    "img"
                );

            image.src =
                character.image;

            image.alt =
                character.name;


            const name =
                document.createElement(
                    "span"
                );

            name.textContent =
                character.name;


            button.appendChild(
                image
            );

            button.appendChild(
                name
            );


            if(!alreadyUsed){

                button.addEventListener(
                    "click",
                    () => {

                        chooseConnectionsMakerCharacter(
                            slug,
                            character
                        );

                    }
                );

            }


            grid.appendChild(
                button
            );

        }
    );

}
/* ==========================================
   Choose Character
========================================== */

function chooseConnectionsMakerCharacter(
    slug,
    character
){

    if(
        !connectionsMakerActiveSlot
    ){
        return;
    }


    connectionsMakerActiveSlot
        .dataset.character =
        slug;


    connectionsMakerActiveSlot
        .innerHTML =
        "";


    const image =
        document.createElement(
            "img"
        );

    image.src =
        character.image;

    image.alt =
        character.name;


    const name =
        document.createElement(
            "span"
        );

    name.textContent =
        character.name;


    connectionsMakerActiveSlot
        .appendChild(
            image
        );

    connectionsMakerActiveSlot
        .appendChild(
            name
        );


    connectionsMakerActiveSlot
        .classList.add(
            "selected"
        );


    closeConnectionsCharacterPicker();

}
