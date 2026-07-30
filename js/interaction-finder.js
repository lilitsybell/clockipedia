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

    "Loric":"gold",
    "Fabled":"green"

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


<div class="page-card">


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

    document.getElementById("char1").value,
    document.getElementById("char2").value,
    document.getElementById("char3").value

].filter(x => x !== "");


    const list = document.getElementById("list");

    list.innerHTML = "";


    interactions.forEach(interaction=>{


        const charactersInInteraction = getCharacters(interaction.text);


        const show = selected.every(character =>
            charactersInInteraction.includes(character)
        );


        if(show){

            const li = document.createElement("li");

            li.textContent = interaction.text;

            list.appendChild(li);

        }


    });


    if(list.children.length === 0){

        list.innerHTML = "<li>No interactions found.</li>";

    }

}



function setupEvents(){

    document.getElementById("char1").onchange = updateResults;
    document.getElementById("char2").onchange = updateResults;
    document.getElementById("char3").onchange = updateResults;


    document.getElementById("clearButton").onclick = ()=>{

document.getElementById("char1").selectedIndex = 0;
document.getElementById("char2").selectedIndex = 0;
document.getElementById("char3").selectedIndex = 0;

        updateResults();

    };

}
