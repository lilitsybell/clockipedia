console.log("interaction-finder loaded");


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


        if(linkedCharacter){

            team = teamColors[linkedCharacter.team] || "default";

        }


        return `<a href="character.html?id=${slug}" class="character-link ${team}">
            ${character}
        </a>`;

    });

}

function fillDropdown(id){

    const select=document.getElementById(id);

    select.innerHTML="";


    const blank=document.createElement("option");

    blank.value="";

    blank.textContent="-- Select Character --";

    select.appendChild(blank);


    getInteractionCharacters()
    .forEach(character=>{

        const option=document.createElement("option");

        option.value=character;

        option.textContent=character;

        select.appendChild(option);

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

        <select id="char1"></select>
        <select id="char2"></select>
        <select id="char3"></select>

        <button id="clearButton">
            Clear
        </button>

    </div>


    <div class="legend">

        <span class="triangle green">▲</span>
        Mathematician registers this as <b>normal</b>

        <span class="triangle red">▲</span>
        Mathematician registers this as <b>abnormal</b>

    </div>


    <div id="results">

        <ul id="list"></ul>

    </div>

</div>

`;

    fillDropdown("char1");
    fillDropdown("char2");
    fillDropdown("char3");

    setupEvents();
    updateResults();
}

function updateResults(){

const selected = [

    document.querySelector("#char1").tomselect.getValue(),
    document.querySelector("#char2").tomselect.getValue(),
    document.querySelector("#char3").tomselect.getValue()

].filter(x => x !== "");


    const list = document.getElementById("list");

    list.innerHTML = "";


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
if(interaction.math === "green"){
    mathTriangle = `
    <span class="triangle green info-button"
    title="Mathematician registers this as normal">
    ▲
    </span>
    `;
}
if(interaction.math === "red"){
    mathTriangle = `
    <span class="triangle red info-button"
    title="Mathematician registers this as abnormal">
    ▲
    </span>
    `;

}


if(interaction.reason){

    infoButtons += `
    <span class="info-button" title="${interaction.reason.replace(/"/g, '&quot;')}">
        ?
    </span>
    `;

}


if(interaction.mathInfo){

    infoButtons += `
    <span class="info-button" title="${interaction.mathInfo.replace(/"/g, '&quot;')}">
        ▲
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


    if(list.children.length === 0){

        list.innerHTML = "<li>No interactions found.</li>";

    }

}



function setupEvents(){

    const selectors = [
        "#char1",
        "#char2",
        "#char3"
    ];


    selectors.forEach(selector=>{

        new TomSelect(selector,{

            create:false,
            highlight:false,

            sortField:{
                field:"text",
                direction:"asc"
            },

            onChange:updateResults

        });

    });



document.getElementById("clearButton").onclick = ()=>{
document.querySelector("#char1").tomselect.clear();
document.querySelector("#char2").tomselect.clear();
document.querySelector("#char3").tomselect.clear();


        updateResults();

    };


}
