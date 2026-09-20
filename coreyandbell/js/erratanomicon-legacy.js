console.log(
    "erratanomicon-legacy.js loaded"
);

let erratanomiconData = {};
let officialCharacters = {};
let erratanomiconSimilarity = {};
let erratanomiconCharacterOrder = [];
let removedCharacters = new Set();



/* ==========================================
   Elements
========================================== */

const scriptContainer =
    document.getElementById(
        "erratanomiconScript"
    );



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

    "Madness":10,
    "Madness About Character":5,
    "Madness About Alignment":5,

    "Information":7,
    "Character Information":8,
    "Alignment Information":8,

    "Droisoning":10,
    "Drunkenness":8,
    "Poisoning":8,

    "Death":7,
    "Protection":8,
    "Resurrection":10,

    "Execution":5,
    "Nomination":5,
    "Voting":5,

    "Player Choice":2,
    "Character Choice":2,
    "Storyteller Choice":2,

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
function removeAndReplaceCharacter(
    character
){

    const oldSlug =
        character.slug;


    const replacement =
        getReplacementCharacter(
            character
        );


    if(!replacement){

        alert(
            `No replacement is available for ${character.name}.`
        );

        return;
    }


    /*
        Permanently retire the old character.
    */

    removedCharacters.add(
        oldSlug
    );


    /*
        Replace it in the current script roster.
    */

    const index =
        erratanomiconData
            .characters
            .indexOf(
                oldSlug
            );


    if(index === -1){
        return;
    }


    const replacementSlug =
        replacement.id.replace(
            "erratanomicon_",
            ""
        );


    erratanomiconData
        .characters[
            index
        ] =
            replacementSlug;


    /*
        Re-render the script.
    */

    renderErratanomiconScript();


    console.log(
        `${character.name} removed. ` +
        `Replacement: ${replacement.name}`
    );

    console.log(
        "Removed characters:",
        [...removedCharacters]
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

    const removeButton =
        document.createElement(
            "button"
        );

    removeButton.type =
        "button";

    removeButton.className =
        "erratanomicon-remove-character";

    removeButton.textContent =
        "Remove & Replace";


    removeButton.addEventListener(
        "click",
        () => {

            removeAndReplaceCharacter(
                character
            );

        }
    );


    article
        .querySelector(
            ".erratanomicon-character-info"
        )
        .appendChild(
            removeButton
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


const downloadButton =
    document.getElementById(
        "downloadErratanomiconScript"
    );

if(downloadButton){

    downloadButton.addEventListener(
        "click",
        downloadErratanomiconScript
    );

}
initializeErratanomicon();
