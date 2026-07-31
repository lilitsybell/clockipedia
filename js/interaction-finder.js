console.log("interaction-finder Updated 7/31/26 1:50PM");
let characters = {};
let interactions = [];
const teamColors = {
    "Townsfolk":"blue",
    "Outsider":"blue",
    "Outsiders":"blue",
    "Minion":"red",
    "Minions":"red",
    "Demon":"red",
    "Demons":"red",
    "Traveller":"traveller",
    "Travellers":"traveller",
    "Loric":"green",
    "Fabled":"gold"
};
const slugExceptions = {
    "Organ Grinder": "organgrinder",
    "Lil’ Monsta": "lilmonsta",
    "Lil' Monsta": "lilmonsta",
    "Pit-Hag": "pithag",
    "Devil’s Advocate": "devilsadvocate",
    "Devil's Advocate": "devilsadvocate",
    "Hell’s Librarian": "hellslibrarian",
    "Hell's Librarian": "hellslibrarian",
    "Al-Hadikhia": "alhadikhia",
    "Bounty Hunter": "bountyhunter",
    "Cult Leader": "cultleader",
    "Evil Twin": "eviltwin",
    "Fortune Teller": "fortuneteller",
    "High Priestess": "highpriestess",
    "Lord of Typhon": "lordoftyphon",
    "No Dashii": "nodashii",
    "Poppy Grower": "poppygrower",
    "Plague Doctor": "plaguedoctor",
    "Scarlet Woman": "scarletwoman",
    "Snake Charmer": "snakecharmer",
    "Spirit of Ivory": "spiritofivory",
    "Tea Lady": "tealady",
    "Town Crier": "towncrier",
    "Village Idiot": "villageidiot",
    "Deus ex Fiasco": "deusexfiasco",
    "Big Wig": "bigwig",
    "God of Ug": "godofug",
    "Storm Catcher": "stormcatcher",
};
function getSlug(name){
    return slugExceptions[name] || name
        .toLowerCase()
        .replace(/[’']/g,"")
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,"");
}
function formatCharacters(text){
    return text.replace(/\[(.*?)\]/g, (_, character)=>{
        const slug = getSlug(character);
        const linkedCharacter = characters[slug];

        let team = "default";
        let ability = "";

        if(linkedCharacter){
            team = teamColors[linkedCharacter.team] || "default";
            ability = linkedCharacter.ability || "";
        }

        return `
            <a
                href="character.html?id=${slug}"
                class="character-link ${team}"
                data-character="${slug}"
            >
                ${character}
            </a>
        `;
    });
}
function getCharacters(text){
    const matches=text.match(/\[(.*?)\]/g);
    if(!matches) return [];
    return matches.map(match=>
        match.slice(1,-1)
    );
}
function getInteractionCharacters(){
    const set = new Set();
    interactions.forEach(interaction=>{
        getCharacters(interaction.text)
        .forEach(character=>{
            set.add(character);
        });
    });
    return [...set].sort((a,b)=>a.localeCompare(b));
}
function getInteractionColor(interaction){
    const chars = getCharacters(interaction.text);
    let colors = [];
    chars.forEach(character=>{
        const slug = getSlug(character);
        const data = characters[slug];
        if(data){
            const color = teamColors[data.team];
            if(color && !colors.includes(color)){
                colors.push(color);
            }
        }
    });
    // Traveller gets priority
    if(colors.includes("traveller")){
        return "traveller";
    }
    // If all same color, use it
    if(colors.length === 1){
        return colors[0];
    }
    // Mixed teams default purple
    return "purple";
}
document.addEventListener("DOMContentLoaded", async()=>{
    try{
        const characterResponse = await fetch("/data/characters.json");
        characters = await characterResponse.json();
        const interactionResponse = await fetch("/data/interactions.json");
        interactions = await interactionResponse.json();
        buildPage();
    }
    catch(error){
        console.error("Interaction Finder failed:",error);
    }
});
function buildPage(){
    document.getElementById("interaction-finder").innerHTML = `
<div class="finder-container">
    <div class="finder-header">
        Interaction Finder
    </div>
    <div class="selector-container">
<div class="character-selector" id="selector1"></div>
<div class="character-selector" id="selector2"></div>
<div class="character-selector" id="selector3"></div>
        <button id="clearButton">
            Clear
        </button>
    </div>
<div class="legend">
    <div class="legend-item">
        <span class="triangle green">▲</span>
        The <b>Mathematician</b> registers this as <b>normal</b>.
    </div>
    <div class="legend-item">
        <span class="triangle red">▲</span>
        The <b>Mathematician</b> registers this as <b>abnormal</b>.
    </div>
</div>
<div id="results">
    <div id="result-count">
        Interactions: 0
    </div>

    <ul id="list"></ul>
</div>
</div>
`;
    setupEvents();
    updateResults();
}
function updateResults(){
const selected = [
    document.querySelector("#selector1").getValue(),
    document.querySelector("#selector2").getValue(),
    document.querySelector("#selector3").getValue()
].filter(x => x !== "");
    const list = document.getElementById("list");
    list.innerHTML = "";
    const resultCount = document.getElementById("result-count");
    interactions.forEach(interaction=>{
const charactersInInteraction = new Set(
    getCharacters(interaction.text)
);
        const show = selected.every(character =>
            charactersInInteraction.has(character)
        );
        if(show){
const li = document.createElement("li");
const interactionColor = getInteractionColor(interaction);
li.className = `interaction-card ${interactionColor}`;
let infoButtons = "";
let mathTriangle = "";
if(interaction.math){
    let mathText = interaction.mathInfo || 
        (interaction.math === "green"
            ? "Mathematician registers this as normal."
            : "Mathematician registers this as abnormal.");

    mathTriangle = `
    <span class="math-triangle ${interaction.math}"
    data-info="${mathText.replace(/"/g, '&quot;')}">
    </span>
    `;
}
if(interaction.reason){
    infoButtons += `
    <span class="info-button info-popup"
    data-info="${interaction.reason.replace(/"/g, '&quot;')}">
        ?
    </span>
    `;
}
li.innerHTML =
formatCharacters(interaction.text)
+ " "
+ infoButtons
+ mathTriangle;
list.appendChild(li);
        }
    });
    resultCount.textContent =
    `Interaction${list.children.length === 1 ? "" : "s"}: ${list.children.length}`;
    if(list.children.length === 0){
        list.innerHTML = "<li>No interactions found.</li>";
    }
}
function createCharacterSearch(id){
    const container = document.getElementById(id);
container.innerHTML = `
<div class="character-search-wrapper">
    <input class="character-search" placeholder="Select Character...">
    <span class="clear-character">&times;</span>
</div>
<div class="character-results"></div>
`;
    const input = container.querySelector(".character-search");
    const results = container.querySelector(".character-results");
    const clearButton = container.querySelector(".clear-character");
    clearButton.style.display = "none";
    let selected = "";
    input.addEventListener("input",()=>{
        const query = input.value.toLowerCase().trim();
        results.innerHTML = "";
        if(!query){
            results.style.display="none";
            return;
        }
        const matches = Object.entries(characters)
            .filter(([id,char]) =>
                char.name.toLowerCase().includes(query)
            )
            .slice(0,8);
        matches.forEach(([id,char])=>{
            const item=document.createElement("div");
            item.className="search-item";
            item.innerHTML=`
                <img src="${char.image}" class="search-icon">
                <div class="search-text">
                    <strong>${char.name}</strong>
                    <small>${char.team}</small>
                </div>
            `;
            item.onclick=()=>{
                selected = char.name;
                input.value = char.name;
                clearButton.style.display = "flex";
                results.style.display="none";
                updateResults();
            };
            results.appendChild(item);
        });
        results.style.display="block";
    });
container.getValue = ()=>{
    return selected;
};
container.clear = ()=>{
    selected = "";
    input.value = "";
    clearButton.style.display = "none";
};
    clearButton.onclick = (event)=>{
    event.stopPropagation();

    selected = "";
    input.value = "";
    results.innerHTML = "";
    results.style.display = "none";
    clearButton.style.display = "none";

    updateResults();
};
    document.addEventListener("click",(event)=>{
        if(!event.target.closest("#"+id)){
            results.style.display="none";
        }
    });
}
function setupEvents(){
    createCharacterSearch("selector1");
    createCharacterSearch("selector2");
    createCharacterSearch("selector3");
    document.getElementById("clearButton").onclick = ()=>{
document.querySelectorAll(".character-selector")
    .forEach(selector=>{
        selector.clear();
    });
updateResults();
    };
}
