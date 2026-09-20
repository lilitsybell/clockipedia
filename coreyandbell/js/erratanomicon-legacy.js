console.log(
    "erratanomicon-legacy.js loaded"
);

let erratanomiconData = {};
let officialCharacters = {};
let erratanomiconSimilarity = {};
let erratanomiconCharacterOrder = [];
let removedCharacters = new Set();
let pendingEliminations =
    new Set();
let pendingUpdate =
    null;


/* ==========================================
   Elements
========================================== */

const scriptContainer =
    document.getElementById(
        "erratanomiconScript"
    );

const characterDependencies = {

    damsel:[
        {
            dependent:"huntsman",
            reason:
                "Removed because Damsel was removed."
        }
    ],

    king:[
        {
            dependent:"choirboy",
            reason:
                "Removed because King was removed."
        }
    ]

};

/* ==========================================
   Load Data
========================================== */

async function loadErratanomiconData(){

const [
    scriptResponse,
    characterResponse,
    similarityResponse
] =
    await Promise.all([

        fetch(
            "/coreyandbell/data/erratanomicon-legacy.json"
        ),

        fetch(
            "/coreyandbell/data/erratanomicon-characters.json"
        ),

        fetch(
            "/coreyandbell/data/erratanomicon-similarity.json"
        )

    ]);



    if(!scriptResponse.ok){

        throw new Error(
            "Failed to load Erratanomicon script."
        );

    }



    if(!characterResponse.ok){

        throw new Error(
            "Failed to load characters.json."
        );

    }



    erratanomiconData =
        await scriptResponse.json();
if(!similarityResponse.ok){
    throw new Error(
        "Failed to load Erratanomicon similarity data."
    );
}

erratanomiconSimilarity =
    await similarityResponse.json();


const characterList =
    await characterResponse.json();


/*
    This order is our permanent save-state
    index for all 138 characters.

    IMPORTANT:
    Do not reorder erratanomicon-characters.json
    after legacy games have started.
*/

erratanomiconCharacterOrder =
    characterList.map(
        character =>
            character.id.replace(
                "erratanomicon_",
                ""
            )
    );


officialCharacters =
    Object.fromEntries(
        characterList.map(
            character => [

                character.id.replace(
                    "erratanomicon_",
                    ""
                ),

                character

            ]
        )
    );

}



/* ==========================================
   Get Character
========================================== */

function getErratanomiconCharacter(
    slug
){

    /*
        Erratanomicon itself is still stored
        as a custom character in the script file.
    */

    const customCharacter =
        erratanomiconData
            .customCharacters?.[
                slug
            ];

    if(customCharacter){

        return {
            slug,
            ...customCharacter
        };

    }



    /*
        All normal characters come directly
        from erratanomicon-characters.json.
    */

    const character =
        officialCharacters[
            slug
        ];

    if(!character){

        console.warn(
            `Character not found: ${slug}`
        );

        return null;

    }



character.slug =
    slug;

return character;

}

/* ==========================================
   Normalize Team
========================================== */

function getScriptTeam(
    character
){

    const team =
        character.team
        .toLowerCase();



    if(
        team === "townsfolk"
    ){
        return "townsfolk";
    }



    if(
        team === "outsider" ||
        team === "outsiders"
    ){
        return "outsiders";
    }



    if(
        team === "minion" ||
        team === "minions"
    ){
        return "minions";
    }



    if(
        team === "demon" ||
        team === "demons"
    ){
        return "demons";
    }



    if(
        team === "loric"
    ){
        return "loric";
    }



    return null;

}



/* ==========================================
   Team Information
========================================== */

const scriptTeams = [
    { id:"loric", name:"Loric" },
    { id:"townsfolk", name:"Townsfolk" },
    { id:"outsiders", name:"Outsiders" },
    { id:"minions", name:"Minions" },
    { id:"demons", name:"Demons" }
];
const similarityWeights = {

    /*
        Very strong mechanical similarities
    */

    "Madness":10,
    "Droisoning":10,
    "Protection":10,
    "Safe / Cannot Die":10,
    "Resurrection":10,

    "You Start Knowing":9,
    "Neighbor":9,

    "Drunkenness":8,
    "Poisoning":8,

    "Character Information":8,
    "Alignment Information":8,

    "Ability Copying":8,
    "Ability Gain":8,
    "Ability Loss":8,

    "Demon Replacement":8,


    /*
        Strong similarities
    */

    "Information":7,
    "Death":7,
    "Extra Death":7,

    "Demon Detection":7,
    "Minion Detection":7,
    "Evil Detection":7,
    "Good Detection":7,

    "Demon Protection":7,
    "Demon Support":7,

    "Character Change":7,
    "Alignment Change":7,


    /*
        More specific supporting mechanics
    */

    "Madness About Character":5,
    "Madness About Alignment":5,

    "False Information":5,

    "Execution":5,
    "Nomination":5,
    "Voting":5,

    "Death Trigger":5,
    "Execution Trigger":5,
    "Nomination Trigger":5,
    "Voting Trigger":5,

    "Registration":5,

    "Setup":5,
    "Outsider Modification":5,
    "Minion Modification":5,
    "Demon Modification":5,

    "Dead Players":4,
    "Living Players":4,

    "Pairs":4,
    "Distance":4,

    "Public":3,
    "Private":3,


    /*
        Choice mechanics matter,
        but shouldn't dominate a match.
    */

    "Player Choice":2,
    "Character Choice":2,
    "Storyteller Choice":2,


    /*
        Timing is useful mostly as
        a tiebreaker.
    */

    "Night":1,
    "Day":1,
    "Once Per Game":1

};
function getSimilarityScore(
    oldSlug,
    newSlug
){

    const oldTags =
        erratanomiconSimilarity[
            oldSlug
        ] || [];

    const newTags =
        erratanomiconSimilarity[
            newSlug
        ] || [];

    let score = 0;


    oldTags.forEach(
        tag => {

            if(
                newTags.includes(
                    tag
                )
            ){

                score +=
                    similarityWeights[
                        tag
                    ] || 1;

            }

        }
    );


    return score;
}
function getReplacementCharacter(
    oldCharacter
){

    const oldSlug =
        oldCharacter.slug;

    const oldTeam =
        getScriptTeam(
            oldCharacter
        );


    const currentCharacters =
        new Set(
            erratanomiconData
                .characters
        );


    const candidates =
        erratanomiconCharacterOrder
        .filter(
            slug => {

                /*
                    Can't bring back a
                    permanently removed character.
                */

                if(
                    removedCharacters.has(
                        slug
                    )
                ){
                    return false;
                }


                /*
                    Can't add somebody who is
                    already on the script.
                */

                if(
                    currentCharacters.has(
                        slug
                    )
                ){
                    return false;
                }


                const character =
                    officialCharacters[
                        slug
                    ];

                if(!character){
                    return false;
                }


                /*
                    Replacement must be
                    the same team.
                */

                return (
                    getScriptTeam(
                        character
                    ) ===
                    oldTeam
                );

            }
        );


    if(
        candidates.length === 0
    ){
        return null;
    }


    const scoredCandidates =
        candidates.map(
            slug => ({

                slug,

                score:
                    getSimilarityScore(
                        oldSlug,
                        slug
                    )

            })
        );


    const highestScore =
        Math.max(
            ...scoredCandidates.map(
                candidate =>
                    candidate.score
            )
        );


    const bestCandidates =
        scoredCandidates.filter(
            candidate =>
                candidate.score ===
                highestScore
        );


    /*
        Random choice between equally
        good replacements.
    */

    const chosen =
        bestCandidates[
            Math.floor(
                Math.random() *
                bestCandidates.length
            )
        ];


    return officialCharacters[
        chosen.slug
    ];
}
function buildPendingUpdate(){

    /*
        Start with the characters the user
        explicitly selected this game.
    */

    const removals =
        [...pendingEliminations].map(
            slug => ({
                slug,
                reason:null
            })
        );


    /*
        Add dependency removals.

        This loops because it also allows
        dependency chains later if we ever
        add more rules.
    */

    let addedDependency =
        true;


    while(addedDependency){

        addedDependency =
            false;


        [...removals].forEach(
            removal => {

                const dependencies =
                    characterDependencies[
                        removal.slug
                    ] || [];


                dependencies.forEach(
                    dependency => {

                        /*
                            The dependent only matters
                            if it is currently in play.
                        */

                        if(
                            !erratanomiconData
                                .characters
                                .includes(
                                    dependency.dependent
                                )
                        ){
                            return;
                        }


                        /*
                            Don't add it twice.
                        */

                        const alreadyRemoved =
                            removals.some(
                                existing =>
                                    existing.slug ===
                                    dependency.dependent
                            );


                        if(alreadyRemoved){
                            return;
                        }


                        removals.push({
                            slug:
                                dependency.dependent,

                            reason:
                                dependency.reason
                        });


                        addedDependency =
                            true;

                    }
                );

            }
        );

    }


    pendingUpdate = {
        removals,
        replacements:{}
    };


    /*
        Roll the surprise replacements.

        We do this only now, when the
        update screen is opened.
    */

    removals.forEach(
        removal => {

            pendingUpdate
                .replacements[
                    removal.slug
                ] =
                    choosePendingReplacement(
                        removal.slug
                    );

        }
    );

}
function choosePendingReplacement(
    removedSlug
){

    const oldCharacter =
        officialCharacters[
            removedSlug
        ];

    if(!oldCharacter){
        return null;
    }


    const oldTeam =
        getScriptTeam(
            oldCharacter
        );


    /*
        Anything already permanently dead
        cannot return.
    */

    const unavailable =
        new Set(
            removedCharacters
        );


    /*
        Anything being removed during this
        update is also unavailable.
    */

    pendingUpdate.removals.forEach(
        removal => {

            unavailable.add(
                removal.slug
            );

        }
    );


    /*
        Characters currently remaining on
        the script cannot be duplicated.
    */

    erratanomiconData
        .characters
        .forEach(
            slug => {

                if(
                    !pendingUpdate.removals
                        .some(
                            removal =>
                                removal.slug ===
                                slug
                        )
                ){
                    unavailable.add(
                        slug
                    );
                }

            }
        );


    /*
        Don't use a replacement already
        rolled for another removal.
    */

    Object.values(
        pendingUpdate.replacements
    )
    .filter(Boolean)
    .forEach(
        replacement => {

            unavailable.add(
                replacement
            );

        }
    );


    const candidates =
        erratanomiconCharacterOrder
        .filter(
            slug => {

                if(
                    unavailable.has(
                        slug
                    )
                ){
                    return false;
                }


                const character =
                    officialCharacters[
                        slug
                    ];

                if(!character){
                    return false;
                }


                if(
                    getScriptTeam(
                        character
                    ) !==
                    oldTeam
                ){
                    return false;
                }


                /*
                    Huntsman may only enter
                    if Damsel will be on the
                    resulting script.

                    Choirboy follows the
                    same rule with King.
                */

                if(
                    slug === "huntsman" &&
                    !willCharacterRemain(
                        "damsel"
                    )
                ){
                    return false;
                }


                if(
                    slug === "choirboy" &&
                    !willCharacterRemain(
                        "king"
                    )
                ){
                    return false;
                }


                return true;

            }
        );


    if(
        candidates.length === 0
    ){
        return null;
    }


    const scored =
        candidates.map(
            slug => ({
                slug,
                score:
                    getSimilarityScore(
                        removedSlug,
                        slug
                    )
            })
        );


    const highestScore =
        Math.max(
            ...scored.map(
                candidate =>
                    candidate.score
            )
        );


    const best =
        scored.filter(
            candidate =>
                candidate.score ===
                highestScore
        );


    return best[
        Math.floor(
            Math.random() *
            best.length
        )
    ].slug;

}
function willCharacterRemain(
    slug
){

    /*
        Is it currently on the script?
    */

    if(
        erratanomiconData
            .characters
            .includes(
                slug
            )
    ){

        /*
            Then make sure it isn't being
            removed in this update.
        */

        return !pendingUpdate
            .removals
            .some(
                removal =>
                    removal.slug ===
                    slug
            );

    }


    /*
        Or has it already been selected as
        one of this update's replacements?
    */

    return Object.values(
        pendingUpdate.replacements
    ).includes(
        slug
    );

}
function renderUpdateModal(){

    const container =
        document.getElementById(
            "erratanomiconUpdateSummary"
        );


    container.innerHTML =
        "";


    /*
        Ability edits
    */

    const editsHeading =
        document.createElement(
            "h3"
        );

    editsHeading.textContent =
        "Ability Edits";

    container.appendChild(
        editsHeading
    );


    const editsNote =
        document.createElement(
            "p"
        );

    editsNote.className =
        "erratanomicon-update-note";

    editsNote.textContent =
        "All ability changes made during this game will be saved.";

    container.appendChild(
        editsNote
    );


    /*
        Character replacements
    */

    const replacementHeading =
        document.createElement(
            "h3"
        );

    replacementHeading.textContent =
        "Character Replacements";

    container.appendChild(
        replacementHeading
    );


    if(
        pendingUpdate.removals.length ===
        0
    ){

        const empty =
            document.createElement(
                "p"
            );

        empty.className =
            "erratanomicon-update-note";

        empty.textContent =
            "No characters were eliminated this game.";

        container.appendChild(
            empty
        );

        return;

    }


    pendingUpdate.removals.forEach(
        removal => {

            container.appendChild(
                createReplacementReveal(
                    removal
                )
            );

        }
    );

}
function createReplacementReveal(
    removal
){

    const oldCharacter =
        officialCharacters[
            removal.slug
        ];

    const replacementSlug =
        pendingUpdate
            .replacements[
                removal.slug
            ];

    const replacement =
        replacementSlug
            ? officialCharacters[
                replacementSlug
            ]
            : null;


    const card =
        document.createElement(
            "div"
        );

    card.className =
        "erratanomicon-replacement-card";


    const oldImage =
        Array.isArray(
            oldCharacter.image
        )
            ? oldCharacter.image[0]
            : oldCharacter.image;


    const newImage =
        replacement
            ? (
                Array.isArray(
                    replacement.image
                )
                    ? replacement.image[0]
                    : replacement.image
            )
            : "";


    card.innerHTML = `

        <div class="erratanomicon-replacement-old">

            <img
                src="${oldImage}"
                alt="${oldCharacter.name}"
            >

            <strong>
                ${oldCharacter.name}
            </strong>

            ${
                removal.reason
                    ? `
                        <span class="erratanomicon-dependency-note">
                            ${removal.reason}
                        </span>
                    `
                    : ""
            }

        </div>


        <div class="erratanomicon-replacement-arrow">
            →
        </div>


        <div class="erratanomicon-replacement-new">

            ${
                replacement
                    ? `

                        <button
                            class="erratanomicon-skip-replacement"
                            type="button"
                        >
                            Skip & Eliminate Character
                        </button>

                        <img
                            src="${newImage}"
                            alt="${replacement.name}"
                        >

                        <strong>
                            ${replacement.name}
                        </strong>

                    `
                    : `

                        <strong>
                            No replacement available
                        </strong>

                    `
            }

        </div>

    `;


    const skipButton =
        card.querySelector(
            ".erratanomicon-skip-replacement"
        );


    if(skipButton){

        skipButton.addEventListener(
            "click",
            () => {

                skipPendingReplacement(
                    removal.slug
                );

            }
        );

    }


    return card;

}
function skipPendingReplacement(
    removedSlug
){

    const skippedSlug =
        pendingUpdate
            .replacements[
                removedSlug
            ];


    if(!skippedSlug){
        return;
    }


    /*
        The rejected replacement becomes
        permanently eliminated as part of
        this update.
    */

    if(
        !pendingUpdate.removals.some(
            removal =>
                removal.slug ===
                skippedSlug
        )
    ){

        pendingUpdate.removals.push({
            slug:skippedSlug,
            reason:
                "Skipped as a replacement."
        });

    }


    /*
        Remove the old roll before finding
        another replacement.
    */

    pendingUpdate.replacements[
        removedSlug
    ] = null;


    pendingUpdate.replacements[
        removedSlug
    ] =
        choosePendingReplacement(
            removedSlug
        );


    renderUpdateModal();

}
function openUpdateModal(){

    buildPendingUpdate();

    renderUpdateModal();


    document
        .getElementById(
            "erratanomiconUpdateModal"
        )
        .classList.remove(
            "hidden"
        );

}


function closeUpdateModal(){

    pendingUpdate =
        null;


    document
        .getElementById(
            "erratanomiconUpdateModal"
        )
        .classList.add(
            "hidden"
        );

}
/* ==========================================
   Create Character
========================================== */

function createScriptCharacter(
    character
){

    const article =
        document.createElement(
            "article"
        );

    article.className =
        "erratanomicon-character";

    article.dataset.character =
        character.slug;

    const image =
        Array.isArray(
            character.image
        )
            ? character.image[0]
            : character.image;

    article.innerHTML = `

        <div class="erratanomicon-character-token">

            <img
                src="${image}"
                alt="${character.name}"
            >

        </div>

        <div class="erratanomicon-character-info">

            <h3>
                ${character.name}
            </h3>

            <div
                class="erratanomicon-character-ability"
            ></div>

        </div>

    `;

if(
    getScriptTeam(character) !==
    "loric"
){

    const eliminateButton =
        document.createElement(
            "button"
        );

    eliminateButton.type =
        "button";

    eliminateButton.className =
        "erratanomicon-eliminate-character";

    eliminateButton.setAttribute(
        "aria-label",
        `Eliminate ${character.name}`
    );


    /*
        Keep the button red if this
        character is already selected.
    */

    if(
        pendingEliminations.has(
            character.slug
        )
    ){
        eliminateButton.classList.add(
            "selected"
        );
    }


    eliminateButton.addEventListener(
        "click",
        () => {

            const slug =
                character.slug;


            if(
                pendingEliminations.has(
                    slug
                )
            ){

                pendingEliminations.delete(
                    slug
                );

                eliminateButton.classList.remove(
                    "selected"
                );

            }else{

                pendingEliminations.add(
                    slug
                );

                eliminateButton.classList.add(
                    "selected"
                );

            }


            console.log(
                "Pending eliminations:",
                [...pendingEliminations]
            );

        }
    );


    article.appendChild(
        eliminateButton
    );

}
    const abilityElement =
        article.querySelector(
            ".erratanomicon-character-ability"
        );
if(
    getScriptTeam(character) ===
    "loric"
){

    abilityElement.classList.add(
        "erratanomicon-loric-ability"
    );

    abilityElement.textContent =
        character.ability || "";

}else{

    renderAbilityWords(
        abilityElement,
        character
    );

}



    return article;
}
function renderAbilityWords(
    container,
    character
){

    container.innerHTML =
        "";

    const words =
        (character.ability || "")
        .split(/\s+/)
        .filter(Boolean);



    words.forEach(
        (word,index) => {

            const wordButton =
                document.createElement(
                    "button"
                );

            wordButton.type =
                "button";

            wordButton.className =
                "erratanomicon-word";

            wordButton.textContent =
                word;

            wordButton.addEventListener(
                "click",
                () => {

                    editAbilityWord(
                        container,
                        character,
                        index
                    );

                }
            );

            container.appendChild(
                wordButton
            );

        }
    );

}


function editAbilityWord(
    container,
    character,
    wordIndex
){

    const words =
        (character.ability || "")
        .split(/\s+/)
        .filter(Boolean);

    const buttons =
        container.querySelectorAll(
            ".erratanomicon-word"
        );

    const wordButton =
        buttons[
            wordIndex
        ];

    if(!wordButton){
        return;
    }

const input =
    document.createElement(
        "input"
    );

input.type =
    "text";

input.className =
    "erratanomicon-word-input";

input.value =
    words[
        wordIndex
    ];

const originalWidth =
    wordButton.offsetWidth;

input.style.width =
    `${originalWidth}px`;

wordButton.replaceWith(
    input
);

input.focus();
input.select();
input.addEventListener(
    "input",
    () => {

        input.style.width =
            "1px";

        input.style.width =
            `${
                Math.max(
                    originalWidth,
                    input.scrollWidth
                )
            }px`;

    }
);

    function saveWord(){

        const newWord =
            input.value.trim();

        if(newWord){
            words[wordIndex] =
                newWord;
        }

        character.ability =
            words.join(" ");

        renderAbilityWords(
            container,
            character
        );

    }



    function cancelEdit(){

        renderAbilityWords(
            container,
            character
        );

    }



    input.addEventListener(
        "keydown",
        event => {

            if(
                event.key ===
                "Enter"
            ){
                saveWord();
            }

            if(
                event.key ===
                "Escape"
            ){
                cancelEdit();
            }

        }
    );



    input.addEventListener(
        "blur",
        saveWord
    );

}

/* ==========================================
   Create Team Section
========================================== */

function createTeamSection(
    team,
    characters
){

    const section =
        document.createElement(
            "section"
        );



    section.className =
        `erratanomicon-team erratanomicon-team-${team.id}`;



    const heading =
        document.createElement(
            "div"
        );



    heading.className =
        "erratanomicon-team-heading";



    heading.innerHTML = `

        <h2>
            ${team.name}
        </h2>

        <span>
            ${characters.length}
        </span>

    `;



    section.appendChild(
        heading
    );



    const characterList =
        document.createElement(
            "div"
        );



    characterList.className =
        "erratanomicon-character-list";



    characters.forEach(
        character => {

            characterList.appendChild(
                createScriptCharacter(
                    character
                )
            );

        }
    );



    section.appendChild(
        characterList
    );



    return section;

}

function renderCharacterGraveyard(){

    const graveyard =
        document.getElementById(
            "erratanomiconGraveyard"
        );

    const container =
        document.getElementById(
            "erratanomiconGraveyardCharacters"
        );


    if(
        !graveyard ||
        !container
    ){
        return;
    }


    container.innerHTML =
        "";


    /*
        Hide the entire graveyard until
        at least one character has died.
    */

    if(
        removedCharacters.size === 0
    ){

        graveyard.classList.add(
            "hidden"
        );

        return;

    }


    graveyard.classList.remove(
        "hidden"
    );


    /*
        Use the permanent database order
        rather than removal order.
    */

    erratanomiconCharacterOrder
        .filter(
            slug =>
                removedCharacters.has(
                    slug
                )
        )
        .forEach(
            slug => {

                const character =
                    officialCharacters[
                        slug
                    ];

                if(!character){
                    return;
                }


                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "erratanomicon-graveyard-character";


                const image =
                    Array.isArray(
                        character.image
                    )
                        ? character.image[0]
                        : character.image;


                item.innerHTML = `

                    <img
                        src="${image}"
                        alt="${character.name}"
                    >

                    <span>
                        ${character.name}
                    </span>

                `;


                container.appendChild(
                    item
                );

            }
        );

}

/* ==========================================
   Render Script
========================================== */

function renderErratanomiconScript(){

    scriptContainer.innerHTML =
        "";



    const scriptCharacters =
        erratanomiconData.characters
        .map(
            slug =>
                getErratanomiconCharacter(
                    slug
                )
        )
        .filter(Boolean);



    scriptTeams.forEach(
        team => {

            const teamCharacters =
                scriptCharacters.filter(
                    character =>
                        getScriptTeam(
                            character
                        ) ===
                        team.id
                );



            if(
                teamCharacters.length ===
                0
            ){
                return;
            }



            scriptContainer.appendChild(
                createTeamSection(
                    team,
                    teamCharacters
                )
            );

        }
    );



    console.log(
        "Erratanomicon characters:",
        scriptCharacters
    );
renderCharacterGraveyard();
}
function encodeRemovedCharacters(){

    const bytes =
        new Uint8Array(
            Math.ceil(
                erratanomiconCharacterOrder.length /
                8
            )
        );


    erratanomiconCharacterOrder.forEach(
        (slug,index) => {

            if(
                !removedCharacters.has(
                    slug
                )
            ){
                return;
            }


            const byteIndex =
                Math.floor(
                    index / 8
                );

            const bitIndex =
                index % 8;


            bytes[byteIndex] |=
                1 << bitIndex;

        }
    );


    let binary = "";

    bytes.forEach(
        byte => {

            binary +=
                String.fromCharCode(
                    byte
                );

        }
    );


    return btoa(binary)
        .replace(/\+/g,"-")
        .replace(/\//g,"_")
        .replace(/=+$/,"");

}
function decodeRemovedCharacters(
    encoded
){

    removedCharacters.clear();


    if(!encoded){
        return;
    }


    let base64 =
        encoded
        .replace(/-/g,"+")
        .replace(/_/g,"/");


    while(
        base64.length % 4
    ){
        base64 += "=";
    }


    let binary;

    try{

        binary =
            atob(
                base64
            );

    }catch(error){

        console.warn(
            "Invalid Erratanomicon save state.",
            error
        );

        return;

    }


    for(
        let index = 0;
        index <
            erratanomiconCharacterOrder.length;
        index++
    ){

        const byteIndex =
            Math.floor(
                index / 8
            );

        const bitIndex =
            index % 8;


        if(
            byteIndex >=
            binary.length
        ){
            break;
        }


        const byte =
            binary.charCodeAt(
                byteIndex
            );


        if(
            byte &
            (1 << bitIndex)
        ){

            removedCharacters.add(
                erratanomiconCharacterOrder[
                    index
                ]
            );

        }

    }

}

function downloadErratanomiconScript(){

    const script = [];


    /*
        Script metadata
    */

    script.push({
        id:"_meta",
        name:
            erratanomiconData.meta?.name ||
            "Erratanomicon Legacy",
        author:
            erratanomiconData.meta?.author ||
            "Corey and Bell"
    });


    /*
        Add each character using its
        current data, including edited abilities.
    */

    erratanomiconData.characters.forEach(
        slug => {

            const character =
                getErratanomiconCharacter(
                    slug
                );

            if(!character){
                return;
            }


            /*
                Custom Loric
            */

if(slug === "erratanomicon"){

    const {
        slug:unusedSlug,
        ...characterData
    } = character;


    /*
        Store the permanent removed-character
        state inside the Loric ID.
    */

    const saveState =
        encodeRemovedCharacters();

    characterData.id =
        `el1_${saveState}`;


    characterData.team =
        characterData.team.toLowerCase();


    script.push(
        characterData
    );

    return;
}

            /*
                Normal Erratanomicon character.

                The character already contains
                its full BOTC character data.
            */

            const {
                slug:unusedSlug,
                ...characterData
            } = character;

            script.push(
                characterData
            );

        }
    );


    /*
        Create downloadable JSON
    */

    const json =
        JSON.stringify(
            script,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        "erratanomicon-legacy.json";

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
        url
    );

}
function importErratanomiconScript(
    file
){

    const reader =
        new FileReader();


    reader.addEventListener(
        "load",
        () => {

            try{

                const importedScript =
                    JSON.parse(
                        reader.result
                    );


                if(
                    !Array.isArray(
                        importedScript
                    )
                ){
                    throw new Error(
                        "Script is not a JSON array."
                    );
                }


                /*
                    Find the Erratanomicon.

                    We identify it by name because
                    its ID now contains save data.
                */

                const importedErratanomicon =
                    importedScript.find(
                        entry =>
                            typeof entry ===
                                "object" &&
                            entry.name ===
                                "Erratanomicon"
                    );


                if(
                    !importedErratanomicon
                ){
                    throw new Error(
                        "This script does not contain the Erratanomicon."
                    );
                }


                /*
                    Restore the permanent
                    removed-character state.
                */

                if(
                    importedErratanomicon.id
                        .startsWith(
                            "el1_"
                        )
                ){

                    decodeRemovedCharacters(
                        importedErratanomicon.id
                            .slice(4)
                    );

                }else{

                    removedCharacters.clear();

                }


                /*
                    Build the new current roster.
                */

                const importedRoster =
                    [];


                importedScript.forEach(
                    entry => {

                        if(
                            typeof entry !==
                            "object" ||
                            !entry ||
                            entry.id ===
                                "_meta"
                        ){
                            return;
                        }


                        /*
                            Erratanomicon is handled
                            separately because its ID
                            is the save-state code.
                        */

                        if(
                            entry.name ===
                                "Erratanomicon"
                        ){

                            importedRoster.push(
                                "erratanomicon"
                            );

                            return;

                        }


                        /*
                            Our Erratanomicon character
                            IDs use this prefix.
                        */

                        if(
                            !entry.id ||
                            !entry.id.startsWith(
                                "erratanomicon_"
                            )
                        ){
                            return;
                        }


                        const slug =
                            entry.id.replace(
                                "erratanomicon_",
                                ""
                            );


                        /*
                            Update the database object
                            with the imported version.

                            This restores edited abilities
                            and all other exported data.
                        */

                        officialCharacters[
                            slug
                        ] = {
                            ...entry,
                            slug
                        };


                        importedRoster.push(
                            slug
                        );

                    }
                );


                if(
                    importedRoster.length ===
                    0
                ){
                    throw new Error(
                        "No Erratanomicon characters were found."
                    );
                }


                /*
                    Restore the imported Loric data
                    while keeping our internal slug.
                */

                erratanomiconData
                    .customCharacters
                    .erratanomicon = {

                        ...importedErratanomicon,

                        id:
                            "erratanomicon",

                        team:
                            "Loric",

                        slug:
                            "erratanomicon"

                    };


                /*
                    Replace the current roster.
                */

                erratanomiconData.characters =
                    importedRoster;


                /*
                    Redraw everything.
                */

                renderErratanomiconScript();


                console.log(
                    "Imported Erratanomicon script."
                );

                console.log(
                    "Removed characters:",
                    [...removedCharacters]
                );


            }catch(error){

                console.error(
                    "Import failed:",
                    error
                );

                alert(
                    "That file could not be loaded as an Erratanomicon Legacy script."
                );

            }

        }
    );


    reader.readAsText(
        file
    );

}
/* ==========================================
   Initialize
========================================== */

async function initializeErratanomicon(){

    try{

        await loadErratanomiconData();



        renderErratanomiconScript();

    }catch(error){

        console.error(
            "Erratanomicon Legacy failed:",
            error
        );



        scriptContainer.innerHTML = `

            <div class="erratanomicon-error">

                The script could not be loaded.

            </div>

        `;

    }

}


const updateDownloadButton =
    document.getElementById(
        "downloadErratanomiconScript"
    );

if(updateDownloadButton){

    updateDownloadButton.addEventListener(
        "click",
        openUpdateModal
    );

}
const closeUpdateButton =
    document.getElementById(
        "closeErratanomiconModal"
    );

const modalBackdrop =
    document.querySelector(
        ".erratanomicon-modal-backdrop"
    );


if(closeUpdateButton){

    closeUpdateButton.addEventListener(
        "click",
        closeUpdateModal
    );

}


if(modalBackdrop){

    modalBackdrop.addEventListener(
        "click",
        closeUpdateModal
    );

}

const importButton =
    document.getElementById(
        "importErratanomiconScript"
    );

const importFileInput =
    document.getElementById(
        "importErratanomiconFile"
    );


if(
    importButton &&
    importFileInput
){

    importButton.addEventListener(
        "click",
        () => {

            importFileInput.click();

        }
    );


    importFileInput.addEventListener(
        "change",
        () => {

            const file =
                importFileInput
                    .files[0];

            if(!file){
                return;
            }


            importErratanomiconScript(
                file
            );


            /*
                Allows selecting the same
                file again later.
            */

            importFileInput.value =
                "";

        }
    );

}
initializeErratanomicon();
