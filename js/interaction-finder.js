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

function setupEvents(){

}

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


}
