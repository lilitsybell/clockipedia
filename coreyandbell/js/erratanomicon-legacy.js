console.log(
    "erratanomicon-legacy.js loaded"
);



let erratanomiconData = {};
let officialCharacters = {};



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
        characterResponse
    ] =
        await Promise.all([

            fetch(
                "/coreyandbell/data/erratanomicon-legacy.json"
            ),
fetch(
    "/coreyandbell/data/erratanomicon-characters.json"
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



const characterList =
    await characterResponse.json();

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



    return {
        slug,
        ...character
    };

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

    {
        id:
            "townsfolk",

        name:
            "Townsfolk"
    },

    {
        id:
            "outsiders",

        name:
            "Outsiders"
    },

    {
        id:
            "minions",

        name:
            "Minions"
    },

    {
        id:
            "demons",

        name:
            "Demons"
    },

    {
        id:
            "loric",

        name:
            "Loric"
    }

];



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



    article.innerHTML = `

        <div class="erratanomicon-character-token">

<img
    src="${
        Array.isArray(
            character.image
        )
            ? character.image[0]
            : character.image
    }"
    alt="${character.name}"
>

        </div>



        <div class="erratanomicon-character-info">

            <h3>
                ${character.name}
            </h3>

            <div class="erratanomicon-character-ability">
                ${character.ability || ""}
            </div>

        </div>

    `;



    return article;

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



initializeErratanomicon();
