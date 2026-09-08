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
/* ==========================================
   Create Custom Puzzle
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const createButton =
            document.querySelector(
                "#connectionsMakerCreate"
            );

        const copyButton =
            document.querySelector(
                "#connectionsMakerCopy"
            );


        createButton.addEventListener(
            "click",
            createConnectionsCustomPuzzle
        );


        copyButton.addEventListener(
            "click",
            copyConnectionsCustomPuzzleLink
        );

    }
);


function createConnectionsCustomPuzzle(){

    const groupElements =
        Array.from(
            document.querySelectorAll(
                ".connections-maker-group"
            )
        );


    const groups =
        groupElements.map(
            groupElement => {

                const name =
                    groupElement
                        .querySelector(
                            ".connections-maker-category"
                        )
                        .value
                        .trim();


                const color =
                    groupElement.dataset.color;


                const selectedCharacters =
                    Array.from(
                        groupElement.querySelectorAll(
                            ".connections-maker-slots button"
                        )
                    )
                    .map(
                        button =>
                            button.dataset.character
                    )
                    .filter(Boolean);


                return {
                    name,
                    color,
                    characters:
                        selectedCharacters
                };

            }
        );


    const invalidGroup =
        groups.find(
            group =>
                !group.name ||
                group.characters.length !== 4
        );


    if(invalidGroup){

        showConnectionsMakerMessage(
            "Each group needs a category name and four characters."
        );

        return;

    }


    const allCharacters =
        groups.flatMap(
            group =>
                group.characters
        );


    if(
        new Set(allCharacters).size !==
        16
    ){

        showConnectionsMakerMessage(
            "Each character can only be used once."
        );

        return;

    }


    const author =
        document.querySelector(
            "#connectionsMakerAuthor"
        )
        .value
        .trim();


    const customPuzzle = {

        author:
            author || "Anonymous",

        groups

    };


    const encoded =
        encodeConnectionsCustomPuzzle(
            customPuzzle
        );


    const url =
        new URL(
            "/games/connections.html",
            window.location.origin
        );


    url.searchParams.set(
        "custom",
        encoded
    );


    document.querySelector(
        "#connectionsMakerShareURL"
    ).value =
        url.toString();


    document.querySelector(
        "#connectionsMakerShare"
    ).hidden =
        false;


    document.querySelector(
        "#connectionsMakerMessage"
    ).hidden =
        true;

}


function encodeConnectionsCustomPuzzle(
    puzzle
){

    const json =
        JSON.stringify(
            puzzle
        );


    return btoa(
        encodeURIComponent(
            json
        )
        .replace(
            /%([0-9A-F]{2})/g,
            (
                match,
                code
            ) =>
                String.fromCharCode(
                    "0x" + code
                )
        )
    );

}


async function copyConnectionsCustomPuzzleLink(){

    const input =
        document.querySelector(
            "#connectionsMakerShareURL"
        );


    await navigator.clipboard.writeText(
        input.value
    );


    const button =
        document.querySelector(
            "#connectionsMakerCopy"
        );


    const originalText =
        button.textContent;


    button.textContent =
        "Copied!";


    setTimeout(
        () => {

            button.textContent =
                originalText;

        },
        1200
    );

}


function showConnectionsMakerMessage(
    message
){

    const box =
        document.querySelector(
            "#connectionsMakerMessage"
        );


    box.textContent =
        message;

    box.hidden =
        false;


    document.querySelector(
        "#connectionsMakerShare"
    ).hidden =
        true;

}
