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
        await fetch("./data/daily-script.json");
    if(!response.ok){
        throw new Error(
            "Failed to load daily-script.json"
        );
    }
    const dailyInfo =
        await response.json();
    const scriptResponse =
        await fetch("./" + dailyInfo.file);
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
        await fetch("./data/characters.json");
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
const particleWheel =
    document.getElementById("dailyParticleWheel");
   if(!particleWheel){
    console.log("Particle wheel not found!");
    return;
}
particleWheel.innerHTML = "";
const particles = [];
for(let i = 0; i < 30; i++){
const dot = document.createElement("div");
dot.className = "daily-particle";
const size = 1 + Math.random() * 7;
dot.style.width = `${size}px`;
dot.style.height = `${size}px`;
dot.style.background =
    Math.random() < 0.25
        ? "#ffffff"
        : "#8b84d8";
dot.style.animationDelay =
    `${Math.random() * 2}s`;
particleWheel.appendChild(dot);
particles.push({
    element: dot,
    progress: Math.random(),
    speed: 0.00005 + Math.random()*0.00015,
radiusOffset: (Math.random()-0.5)*25,
wobble: 5 + Math.random()*10,
    wobbleSpeed: 0.001 + Math.random()*0.003,
    wobblePhase: Math.random()*Math.PI*2,
    opacity: 0.25 + Math.random()*0.6
});
dot.style.opacity = particles.at(-1).opacity;
dot.style.opacity = particles.at(-1).opacity;
}
    const wheel =
        document.getElementById(
            "dailyCharacterWheel"
        );
    if(!wheel || !dailyScript){
        return;
    }
    wheel.innerHTML = "";
if(dailyWheelAnimation){
    cancelAnimationFrame(dailyWheelAnimation);
}
    const characterObjects =
        dailyScript.characters
        .map(id => getCharacter(id))
        .filter(Boolean);
const visibleCount = Math.min(9, characterObjects.length);
    const radius = 450;
    const centerX = 410;
    const centerY = 630;
const arcStart = Math.PI;
const arcEnd = Math.PI *2.00;
    const tokens = [];
function getRandomAvailableCharacter(currentToken){

    const currentlyShown =
        tokens
        .filter(token => token !== currentToken)
        .map(token =>
            token.characterIndex
        );

    const available =
        characterObjects
        .map((character,index)=>index)
        .filter(index =>
            !currentlyShown.includes(index)
        );

    if(available.length === 0){
        return null;
    }

    return available[
        Math.floor(
            Math.random() * available.length
        )
    ];
}
    for(let i = 0; i < visibleCount; i++){
        const img =
            document.createElement("img");
        img.className =
            "daily-character-icon";
let startingIndex;

do{
    startingIndex =
        Math.floor(
            Math.random() *
            characterObjects.length
        );

} while(
    tokens.some(token =>
        token.characterIndex === startingIndex
    )
);
img.src =
    characterObjects[startingIndex].image;
        wheel.appendChild(img);
tokens.push({
    element: img,
progress:
    i / (visibleCount - 1),
characterIndex:
    startingIndex,
    passed:false
});

    }
let movement = 0;
function animate(){
    movement -= 0.00015;
    if(movement <= -1){
        movement += 1;
    }
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
const newCharacter =
    getRandomAvailableCharacter(token);
    if(newCharacter !== null){

        token.characterIndex =
            newCharacter;

        token.element.src =
            characterObjects[
                newCharacter
            ].image;
    }

    token.passed = true;
}
if(progress > 0.5){
    token.passed = false;
}
        });
particles.forEach(p => {

 p.progress -= p.speed;

    if(p.progress < 0){
        p.progress += 1;
    }

    const angle =
        arcStart +
        (arcEnd - arcStart) * p.progress;

    // Radius gently expands/contracts
const r =
    radius +
    60 +
    p.radiusOffset +
        Math.sin(
            performance.now() *
            p.wobbleSpeed +
            p.wobblePhase
        ) * p.wobble;

    // Tiny sideways drift
    const drift =
        Math.cos(
            performance.now() *
            p.wobbleSpeed * 0.7 +
            p.wobblePhase
        ) * 8;

    const x =
        centerX +
        Math.cos(angle) * r +
        Math.cos(angle + Math.PI/2) * drift;

    const y =
        centerY +
        Math.sin(angle) * r +
        Math.sin(angle + Math.PI/2) * drift;
p.element.style.transform =
    `
    translate(${x}px, ${y}px)
    translate(-50%, -50%)
    `;
});
dailyWheelAnimation =
    requestAnimationFrame(animate);

    }
requestAnimationFrame(animate);

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
            );        }

    }
    catch(error){
        console.error(
            "Homepage failed:",
            error
        );
    }
}
initializeHomepage();
