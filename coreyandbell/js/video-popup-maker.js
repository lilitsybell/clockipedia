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

const infoHeadingInput =
    document.getElementById(
        "popupInfoHeading"
    );

const informationRows =
    document.getElementById(
        "popupInformationRows"
    );

const addInformationButton =
    document.getElementById(
        "addInformation"
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

const previewInfoHeading =
    document.getElementById(
        "previewInfoHeading"
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


/* ==========================================
   Information Preview
========================================== */

function updateInformationPreview(){

    previewInfoHeading.textContent =
        infoHeadingInput.value;

    previewInformation.innerHTML =
        "";

    const rows =
        informationRows.querySelectorAll(
            ".popup-information-row"
        );

    rows.forEach(row => {

        const text =
            row.querySelector(
                ".popup-information-text"
            ).value;

        const marker =
            row.querySelector(
                ".popup-information-marker"
            ).value;

        if(
            !text.trim() &&
            !marker
        ){
            return;
        }

        const previewRow =
            document.createElement(
                "div"
            );

        previewRow.className =
            "video-popup-info-row";


        const textElement =
            document.createElement(
                "span"
            );

        textElement.textContent =
            text;

        previewRow.appendChild(
            textElement
        );


        if(marker){

            const markerElement =
                document.createElement(
                    "span"
                );

            markerElement.className =
                "video-popup-marker";

            markerElement.textContent =
                marker === "drunk"
                    ? "DRUNK"
                    : "POISONED";

            previewRow.appendChild(
                markerElement
            );

        }

        previewInformation.appendChild(
            previewRow
        );

    });

}


/* ==========================================
   Create Information Row
========================================== */

function createInformationRow(){

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
            placeholder="Information"
        >

        <select
            class="popup-information-marker"
        >

            <option value="">
                None
            </option>

            <option value="drunk">
                Drunk
            </option>

            <option value="poisoned">
                Poisoned
            </option>

        </select>

        <button
            class="popup-remove-information"
            type="button"
            aria-label="Remove information"
        >
            ×
        </button>

    `;

    informationRows.appendChild(
        row
    );

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

infoHeadingInput.addEventListener(
    "input",
    updateInformationPreview
);


informationRows.addEventListener(
    "input",
    updateInformationPreview
);


informationRows.addEventListener(
    "change",
    updateInformationPreview
);


informationRows.addEventListener(
    "click",
    event => {

        const removeButton =
            event.target.closest(
                ".popup-remove-information"
            );

        if(!removeButton){
            return;
        }

        removeButton
            .closest(
                ".popup-information-row"
            )
            .remove();

        updateInformationPreview();

    }
);


addInformationButton.addEventListener(
    "click",
    () => {

        createInformationRow();

        updateInformationPreview();

    }
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
