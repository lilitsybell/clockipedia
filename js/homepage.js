console.log("homepage.js updated 8/05/26 22:31");
let homepageCharacters = [];
let recentCharacters = [];
let dailyScript = null;
let dailyWheelAnimation = null;
/* ==========================================
   Load Characters
========================================== */
/* ==========================================
   Load Daily Script
========================================== */
async function loadDailyScript(){
    const response =
        await fetch("/data/daily-script.json");
    if(!response.ok){
        throw new Error(
            "Failed to load daily-script.json"
        );
    }
    const dailyInfo =
        await response.json();
    const scriptResponse =
        await fetch("/" + dailyInfo.file);
    if(!scriptResponse.ok){
        throw new Error(
            "Failed to load script file"
        );
    }
    const script =
        await scriptResponse.json();
    const meta =
        script.find(
            entry =>
                typeof entry === "object" &&
                entry.id === "_meta"
        );
    if(!meta){
        throw new Error(
            "Script has no metadata"
        );
    }
dailyScript = {
    name: meta.name,
    author: meta.author,
    logo: meta.logo,
    characters:
        script.filter(
            entry =>
                typeof entry === "string"
        ),
    date:
        dailyInfo.date
};
    console.log(
        "Loaded daily script:",
        dailyScript
    );
}
async function loadHomepageCharacters(){
    const response =
        await fetch("/data/characters.json");
    if(!response.ok){
        throw new Error(
            "Failed to load characters.json"
        );
    }
    const data =
        await response.json();
    homepageCharacters =
        Object.values(data);
    console.log(
        "Loaded homepage characters:",
        homepageCharacters.length
    );
}
/* ==========================================
   Display Daily Script
========================================== */
function showDailyScript(){
    if(!dailyScript){
        return;
    }
    const name =
        document.getElementById(
            "dailyScriptName"
        );
    const author =
        document.getElementById(
            "dailyScriptAuthor"
        );
    const tags =
        document.getElementById(
            "dailyScriptTags"
        );
    if(name){
        name.textContent =
            dailyScript.name || "Unknown Script";
    }
    if(author){
        author.textContent =
            dailyScript.author
            ? "by " + dailyScript.author
            : "";
    }
    if(tags){
        tags.innerHTML = "";
        // Temporary tags from available data
        if(dailyScript.logo){
            const tag =
                document.createElement("span");
            tag.className =
                "daily-script-tag";
            tag.textContent =
                "Custom Art";
            tags.appendChild(tag);
        }
    }
    buildDailyCharacterWheel();
}
function extractDailyCharacters(script){
    return script.filter(
        entry =>
        typeof entry === "string" ||
        (
            typeof entry === "object" &&
            entry.id !== "_meta"
        )
    );
}
/* ==========================================
   Daily Script Character Wheel
========================================== */
function buildDailyCharacterWheel(){

    const wheel =
        document.getElementById(
            "dailyCharacterWheel"
        );

    if(!wheel || !dailyScript){
        return;
    }

    wheel.innerHTML = "";


    const characterObjects =
        dailyScript.characters
        .map(id => getCharacter(id))
        .filter(Boolean);


const visibleCount = 7;


    const radius = 450;

    const centerX = 400;
    const centerY = 625;

const arcStart = Math.PI * 1.15;
const arcEnd = Math.PI * 1.85;

    const tokens = [];


    for(let i = 0; i < visibleCount; i++){

        const img =
            document.createElement("img");

        img.className =
            "daily-character-icon";

        img.src =
            characterObjects[i].image;


        wheel.appendChild(img);


tokens.push({

    element: img,

progress:
    i / (visibleCount - 1),

    characterIndex:
        i,

    passed:false

});

    }


    let movement = 0;


    function animate(){

       movement -= 0.00015;


        if(movement <= -1){
            movement += 1;
        }


        tokens.forEach(token=>{


            let progress =
                token.progress +
                movement;


            if(progress < 0){
                progress += 1;
            }


            const angle =
                arcStart +
                (
                    (arcEnd - arcStart)
                    *
                    progress
                );


            const x =
                centerX +
                Math.cos(angle) *
                radius;


            const y =
                centerY +
                Math.sin(angle) *
                radius;


token.element.style.transform =
`
translate(${x}px, ${y}px)
translate(-50%, -50%)
rotate(${angle * 180 / Math.PI + 90}deg)
`;


            // change character only when completing a loop
if(progress < 0.02 && !token.passed){

    token.characterIndex++;

    if(token.characterIndex >= characterObjects.length){
        token.characterIndex = 0;
    }

    token.element.src =
        characterObjects[
            token.characterIndex
        ].image;

    token.passed = true;
}


if(progress > 0.5){
    token.passed = false;
}


        });


        requestAnimationFrame(
            animate
        );

    }


    animate();

}
/* ==========================================
   Random Character
========================================== */
function showRandomCharacter(){
    if(!homepageCharacters.length){
        return;
    }
    const historySize =
    Math.min(10, Math.max(1, homepageCharacters.length - 1));
    let available =
        homepageCharacters.filter(character =>
            !recentCharacters.includes(character.name)
        );
    if(available.length === 0){
        recentCharacters.shift();
        available =
            homepageCharacters.filter(character =>
                !recentCharacters.includes(character.name)
            );
    }
    const character =
        available[
            Math.floor(
                Math.random() *
                available.length
            )
        ];
    recentCharacters.push(character.name);
    if(recentCharacters.length > historySize){
        recentCharacters.shift();
    }
    const token =
        document.getElementById(
            "characterToken"
        );
    const card =
        document.querySelector(
            ".home-interaction-card"
        );
    // Collapse card toward token
    if(card){
        card.classList.add(
            "card-spin"
        );
    }
    // Spin token
    if(token){
        token.classList.remove(
            "token-spin"
        );
        void token.offsetWidth;
        token.classList.add(
            "token-spin"
        );
    }
    // Wait for animation, then update
    setTimeout(() => {
        document.getElementById(
            "tokenImage"
        ).src =
            character.image;
        document.getElementById(
            "tokenImage"
        ).alt =
            character.name;
        updateInteractionCard(
            character
        );
        if(card){
            card.classList.remove(
                "card-spin"
            );
        }
    },350);
}
function getShortInteractionForCharacter(characterName){
    const maxLength = 200;
    const possible =
        interactions.filter(interaction =>
            interaction.text.includes(
                `[${characterName}]`
            ) &&
            interaction.text.length <= maxLength
        );
    if(!possible.length){
        return null;
    }
    return possible[
        Math.floor(
            Math.random() * possible.length
        )
    ];
}
function updateInteractionCard(character){
const teamColors = {
    "Townsfolk":"blue",
    "Outsiders":"blue",
    "Minions":"red",
    "Demons":"red",
    "Travellers":"traveller",
    "Loric":"lime",
    "Fabled":"copper"
};
const teamNames = {
    "Townsfolk":"Townsfolk",
    "Outsiders":"Outsider",
    "Minions":"Minion",
    "Demons":"Demon",
    "Travellers":"Traveller",
    "Loric":"Loric",
    "Fabled":"Fabled"
};
const teamClass =
    teamColors[
        character.team?.trim()
    ] || "blue";

const card =
    document.querySelector(
        ".home-interaction-card"
    );

if(card){
    card.className =
        "home-interaction-card " + teamClass;
}
    const team =
        document.getElementById(
            "interactionTeam"
        );
team.textContent =
    character.team
        ? `(${teamNames[character.team] || character.team})`
        : "";
team.className = teamClass;
    const name =
        document.getElementById(
            "interactionCharacter"
        );
    name.textContent =
        character.name;
name.className = teamClass;
    document.getElementById(
        "interactionAbility"
    ).textContent =
        character.ability || "";
    const interaction =
        getShortInteractionForCharacter(
            character.name
        );
    const fact =
        document.getElementById(
            "interactionFact"
        );
   fact.className =
    "interaction-fact " + teamClass;
    if(!interaction){
        fact.textContent =
            "No interactions found.";
        return;
    }
    fact.innerHTML =
        formatCharacters(
            interaction.text
        );
}
/* ==========================================
   Start Homepage
========================================== */
async function initializeHomepage(){
    try{
await loadCharacters();
await loadHomepageCharacters();
await loadInteractions();
await loadDailyScript();
showRandomCharacter();
showDailyScript();
const token =
    document.getElementById(
        "characterToken"
    );
if(token){
    token.addEventListener(
        "click",
        showRandomCharacter
    );
}
    }
    catch(error){
        console.error(
            "Homepage failed:",
            error
        );
    }
}
initializeHomepage();
