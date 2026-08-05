console.log("homepage.js updated 8/05/26 17:43");
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
    scriptCharacters.forEach(characterID => {
        const character =
            getCharacter(characterID);
        if(!character){
            return;
        }
        const img =
            document.createElement("img");
        img.src =
            character.image;
        img.alt =
            character.name;
        img.title =
            character.name;
        img.className =
            "daily-character-icon";
        wheel.appendChild(img);
    });
    // Duplicate characters for seamless loop
    const originals =
        [...wheel.children];
    originals.forEach(img => {
        const clone =
            img.cloneNode(true);
        wheel.appendChild(clone);
    });
    startDailyWheel();
}
function startDailyWheel(){
    const wheel =
        document.getElementById(
            "dailyCharacterWheel"
        );
    if(!wheel){
        return;
    }
    let position = 0;
    let paused = false;
    wheel.onmouseenter = () => {
        paused = true;
    };
    wheel.onmouseleave = () => {
        paused = false;
    };
    function animate(){
        if(!paused){
            position -= 0.5;
            const resetPoint =
                wheel.scrollWidth / 2;
            if(Math.abs(position) >= resetPoint){
                position = 0;
            }
            wheel.style.transform =
                `translateX(${position}px)`;
        }
        dailyWheelAnimation =
            requestAnimationFrame(
                animate
            );
    }
    if(dailyWheelAnimation){
        cancelAnimationFrame(
            dailyWheelAnimation
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
