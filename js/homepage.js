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
const scriptCharacters =
    dailyScript.characters || [];

const visibleCount = 8;

const characterObjects =
    scriptCharacters
    .map(id => getCharacter(id))
    .filter(Boolean);


let startIndex = 0;


function renderArc(){

    wheel.innerHTML = "";

    const radius = 400;

    const centerX = 400;
    const centerY = 500;

    const arcStart = Math.PI;
    const arcEnd = Math.PI * 2;


    for(let i = 0; i < visibleCount; i++){

        const character =
            characterObjects[
                (startIndex + i) %
                characterObjects.length
            ];

        const img =
            document.createElement("img");

        img.src =
            character.image;

        img.alt =
            character.name;

        img.className =
            "daily-character-icon";


        const progress =
            i /
            (visibleCount - 1);


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


        img.style.left =
            `${x}px`;

        img.style.top =
            `${y}px`;


        img.style.transform =
        `
        translate(-50%,-50%)
        rotate(${angle * 180 / Math.PI + 90}deg)
        `;


        wheel.appendChild(img);
    }
}

// initial render
renderArc();
// move carousel
setInterval(()=>{
    startIndex++;
    if(startIndex >= characterObjects.length){
        startIndex = 0;
    }
    renderArc();
},3000);
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
