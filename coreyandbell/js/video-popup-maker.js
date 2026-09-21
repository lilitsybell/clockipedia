console.log(
    "video-popup-maker.js loaded"
);


let popupCharacters = {};


/* ==========================================
   Elements
========================================== */

const characterSelect =
    document.getElementById(
        "popupCharacter"
    );

const playerInput =
    document.getElementById(
        "popupPlayer"
    );

const abilityInput =
    document.getElementById(
        "popupAbility"
    );

const customIconInput =
    document.getElementById(
        "popupCustomIcon"
    );

const informationSections =
    document.getElementById(
        "popupInformationSections"
    );

const addInformationSectionButton =
    document.getElementById(
        "addInformationSection"
    );

const previewPlayer =
    document.getElementById(
        "previewPlayer"
    );

const previewCharacterName =
    document.querySelector(
        ".video-popup-character-name"
    );

const previewCharacterIcon =
    document.getElementById(
        "previewCharacterIcon"
    );

const previewAbility =
    document.getElementById(
        "previewAbility"
    );

const previewInformation =
    document.getElementById(
        "previewInformation"
    );


/* ==========================================
   Team Colors
========================================== */

const popupTeamColors = {

    Townsfolk:
        "var(--blue)",

    Outsider:
        "var(--blue)",

    Outsiders:
        "var(--blue)",

    Minion:
        "var(--red)",

    Minions:
        "var(--red)",

    Demon:
        "var(--red)",

    Demons:
        "var(--red)",

    Traveller:
        "var(--traveller)",

    Travellers:
        "var(--traveller)",

    Loric:
        "var(--lime)",

    Fabled:
        "var(--copper)"

};


/* ==========================================
   Load Characters
========================================== */

async function loadPopupCharacters(){

    const response =
        await fetch(
            "/data/characters.json"
        );

    if(!response.ok){

        throw new Error(
            "Could not load characters.json"
        );

    }

    popupCharacters =
        await response.json();

    populateCharacterSelect();

}


/* ==========================================
   Character Dropdown
========================================== */

function populateCharacterSelect(){

    characterSelect.innerHTML = "";

    const characters =
        Object.entries(
            popupCharacters
        );

    characters.sort(
        (a,b) =>
            a[1].name.localeCompare(
                b[1].name
            )
    );

    characters.forEach(
        ([slug,character]) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                slug;

            option.textContent =
                character.name;

            characterSelect.appendChild(
                option
            );

        }
    );

    if(popupCharacters.noble){

        characterSelect.value =
            "noble";

    }

    updateSelectedCharacter();

}


/* ==========================================
   Selected Character
========================================== */

function updateSelectedCharacter(){

    const slug =
        characterSelect.value;

    const character =
        popupCharacters[slug];

    if(!character){
        return;
    }

    previewCharacterName.textContent =
        character.name;

    abilityInput.value =
        character.ability || "";

    previewAbility.textContent =
        character.ability || "";

    previewCharacterIcon.src =
        customIconInput.value.trim() ||
        character.image ||
        "";

    previewCharacterIcon.alt =
        character.name;

    previewCharacterName.style.color =
        popupTeamColors[
            character.team
        ] ||
        "var(--purple)";

}

function renderInformationText(
    container,
    text
){

    const characterPattern =
        /\[([^\]]+)\]/g;

    let lastIndex = 0;

    let match;


    while(
        (
            match =
                characterPattern.exec(
                    text
                )
        ) !== null
    ){

        /*
            Add normal text before
            the bracketed character.
        */

        if(
            match.index >
            lastIndex
        ){

            container.appendChild(
                document.createTextNode(
                    text.slice(
                        lastIndex,
                        match.index
                    )
                )
            );

        }


        const characterName =
            match[1].trim();


        const characterEntry =
            Object.entries(
                popupCharacters
            ).find(
                ([slug,character]) =>
                    character.name
                        .toLowerCase() ===
                    characterName
                        .toLowerCase()
            );


        /*
            If the character exists,
            render its icon.
        */

        if(characterEntry){

            const [
                slug,
                character
            ] = characterEntry;


            const icon =
                document.createElement(
                    "img"
                );


            icon.className =
                "video-popup-inline-icon";


            icon.src =
                character.image;


            icon.alt =
                character.name;


            icon.title =
                character.name;


            container.appendChild(
                icon
            );

        }


        /*
            If it isn't a recognized
            character, leave the
            original [text] visible.
        */

        else{

            container.appendChild(
                document.createTextNode(
                    match[0]
                )
            );

        }


        lastIndex =
            characterPattern.lastIndex;

    }


    /*
        Add remaining text after the
        final character.
    */

    if(
        lastIndex <
        text.length
    ){

        container.appendChild(
            document.createTextNode(
                text.slice(
                    lastIndex
                )
            )
        );

    }

}
/* ==========================================
   Information Preview
========================================== */

function updateInformationPreview(){

    previewInformation.innerHTML =
        "";

    const sections =
        informationSections
            .querySelectorAll(
                ".popup-information-section"
            );


    sections.forEach(section => {

        const headingInput =
            section.querySelector(
                ".popup-info-heading"
            );

        const heading =
            headingInput.value.trim();


        const rows =
            section.querySelectorAll(
                ".popup-information-row"
            );


        /*
            Don't render completely
            empty sections.
        */

        const hasInformation =
            [...rows].some(row => {

                const input =
                    row.querySelector(
                        ".popup-information-text"
                    );

                return (
                    input &&
                    input.value.trim()
                );

            });


        if(
            !heading &&
            !hasInformation
        ){
            return;
        }


        const previewSection =
            document.createElement(
                "div"
            );

        previewSection.className =
            "video-popup-info-section";


        /*
            Section heading
        */

        if(heading){

            const previewHeading =
                document.createElement(
                    "div"
                );

            previewHeading.className =
                "video-popup-info-heading";

            previewHeading.textContent =
                heading;

            previewSection.appendChild(
                previewHeading
            );

        }


        /*
            Information rows
        */

        rows.forEach(row => {

            const input =
                row.querySelector(
                    ".popup-information-text"
                );

            const text =
                input.value.trim();


            if(!text){
                return;
            }


            const previewRow =
                document.createElement(
                    "div"
                );

            previewRow.className =
                "video-popup-info-row";


            renderInformationText(
                previewRow,
                text
            );


            previewSection.appendChild(
                previewRow
            );

        });


        previewInformation.appendChild(
            previewSection
        );

    });

}
function createInformationRow(
    section
){

    const rows =
        section.querySelector(
            ".popup-information-rows"
        );


    const row =
        document.createElement(
            "div"
        );

    row.className =
        "popup-information-row";


    row.innerHTML = `

        <input
            class="popup-information-text"
            type="text"
            placeholder="Information — use [Character] for icons"
        >

        <button
            class="popup-remove-information"
            type="button"
            aria-label="Remove information"
        >
            ×
        </button>

    `;


    rows.appendChild(
        row
    );


    row.querySelector(
        ".popup-information-text"
    ).focus();

}
function createInformationSection(){

    const section =
        document.createElement(
            "div"
        );

    section.className =
        "popup-information-section";


    section.innerHTML = `

        <div
            class="popup-information-section-header"
        >

            <input
                class="popup-info-heading"
                type="text"
                placeholder="Heading"
            >

            <button
                class="popup-remove-section"
                type="button"
                aria-label="Remove section"
            >
                ×
            </button>

        </div>


        <div
            class="popup-information-rows"
        >

            <div
                class="popup-information-row"
            >

                <input
                    class="popup-information-text"
                    type="text"
                    placeholder="Information — use [Character] for icons"
                >

                <button
                    class="popup-remove-information"
                    type="button"
                    aria-label="Remove information"
                >
                    ×
                </button>

            </div>

        </div>


        <button
            class="popup-add-information"
            type="button"
        >
            + Add Row
        </button>

    `;


    informationSections.appendChild(
        section
    );


    section.querySelector(
        ".popup-info-heading"
    ).focus();


    updateInformationPreview();

}

/* ==========================================
   Player Name
========================================== */

playerInput.addEventListener(
    "input",
    () => {

        previewPlayer.textContent =
            playerInput.value ||
            "Player";

    }
);


/* ==========================================
   Ability
========================================== */

abilityInput.addEventListener(
    "input",
    () => {

        previewAbility.textContent =
            abilityInput.value;

    }
);


/* ==========================================
   Custom Icon
========================================== */

customIconInput.addEventListener(
    "input",
    () => {

        const character =
            popupCharacters[
                characterSelect.value
            ];

        if(!character){
            return;
        }

        previewCharacterIcon.src =
            customIconInput.value.trim() ||
            character.image ||
            "";

    }
);


/* ==========================================
   Character Change
========================================== */

characterSelect.addEventListener(
    "change",
    () => {

        customIconInput.value =
            "";

        updateSelectedCharacter();

    }
);

/* ==========================================
   Information Events
========================================== */

informationSections.addEventListener(
    "input",
    updateInformationPreview
);


informationSections.addEventListener(
    "click",
    event => {


        /*
            Add row
        */

        const addRowButton =
            event.target.closest(
                ".popup-add-information"
            );


        if(addRowButton){

            const section =
                addRowButton.closest(
                    ".popup-information-section"
                );

            createInformationRow(
                section
            );

            updateInformationPreview();

            return;

        }


        /*
            Remove row
        */

        const removeRowButton =
            event.target.closest(
                ".popup-remove-information"
            );


        if(removeRowButton){

            removeRowButton
                .closest(
                    ".popup-information-row"
                )
                .remove();

            updateInformationPreview();

            return;

        }


        /*
            Remove entire section
        */

        const removeSectionButton =
            event.target.closest(
                ".popup-remove-section"
            );


        if(removeSectionButton){

            removeSectionButton
                .closest(
                    ".popup-information-section"
                )
                .remove();

            updateInformationPreview();

        }

    }
);


addInformationSectionButton.addEventListener(
    "click",
    createInformationSection
);

/* ==========================================
   Initialize
========================================== */

async function initializePopupMaker(){

    try{

        await loadPopupCharacters();

        updateInformationPreview();

    }
    catch(error){

        console.error(
            "Video Popup Maker failed:",
            error
        );

    }

}


initializePopupMaker();
