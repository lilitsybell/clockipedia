console.log("load-character updated 7/30/2026 5:35PM");
console.log("Character ID:", characterID);

let characters = {};

function singularTeam(team){

    const singular = {
        "Townsfolk": "Townsfolk",
        "Outsiders": "Outsider",
        "Minions": "Minion",
        "Demons": "Demon",
        "Travellers": "Traveller",
        "Loric": "Loric",
        "Fabled": "Fabled"
    };

    return singular[team] || team;

}

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

document.addEventListener("DOMContentLoaded", async () => {

    try {

        const response = await fetch("/data/characters.json");

        characters = await response.json();

                console.log("Characters loaded:", characters);

        const character = characters[characterID];
        console.log("Character team:", character.team);
console.log("Color class:", teamColors[character.team]);


        if (!character) {

            document.getElementById("character").innerHTML = "<h1>Character not found</h1>";
            return;

        }


        document.title = character.name;


        document.getElementById("character").innerHTML = `

        <div class="wiki ${teamColors[character.team]}">

<div class="character-header">

    <div class="character-title">

        <h1 class="${teamColors[character.team]}">
            ${character.name}
<span class="character-team">
    (${singularTeam(character.team)})
</span>
        </h1>

        <p class="character-ability">
            "${character.ability}"
        </p>

    </div>


    <img src="${character.image}">

</div>


            <div class="tabs">

                <div class="tab active" onclick="showPage(0)">
                    Overview
                </div>

                <div class="tab" onclick="showPage(1)">
                    How to Run
                </div>

                <div class="tab" onclick="showPage(2)">
                    Examples
                </div>

            </div>


            <div class="content ${teamColors[character.team]}">


                <div class="page active">

                    <div class="example">
                        <i>${character.flavor || ""}</i>
                    </div>


                    <h2>Purpose</h2>

                    <p>${character.purpose || ""}</p>


                    <h2>Summary</h2>

                    <ul>

                    ${(character.summary || [])
                        .map(item => `<li>${item}</li>`)
                        .join("")}

                    </ul>


                </div>
                
<div class="page">

    ${
        Object.entries(character.run || {})
        .map(([section, items]) => `

            <h2>${section}</h2>

            <ul>
                ${
                    (items || [])
                    .map(item => `<li>${item}</li>`)
                    .join("")
                }
            </ul>

        `)
        .join("")
    }

</div>


<div class="page">

    <h2>Written Examples</h2>

    ${(character.examples || [])
        .map(item => `
            <div class="example">
                ${item}
            </div>
        `)
        .join("")}

</div>


            </div>

        </div>
        `;


        document.querySelectorAll(".page").forEach(page => {
            page.innerHTML = formatCharacters(page.innerHTML);
        });


    } catch(error) {

        console.error("Character loading failed:", error);

    }


});



function showPage(index){

    const tabs = document.querySelectorAll(".tab");
    const pages = document.querySelectorAll(".page");


    tabs.forEach(tab => tab.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));


    tabs[index].classList.add("active");
    pages[index].classList.add("active");

}

function formatCharacters(text){

    return text.replace(/\[(.*?)\]/g, (_, character) => {

const slug = slugExceptions[character] || character
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");


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
