console.log("load-character updated 7/30/2026 12:05PM");
console.log("Character ID:", characterID);
const teamColors = {

    "Townsfolk":"blue",
    "Outsiders":"blue",

    "Minions":"red",
    "Demons":"red",

    "Travellers":"purple",

    "Loric":"gold",
    "Fabled":"green"

};
document.addEventListener("DOMContentLoaded", async () => {

    try {

        const response = await fetch("../data/characters.json");

        const characters = await response.json();

                console.log("Characters loaded:", characters);

        const character = characters[characterID];


        if (!character) {

            document.getElementById("character").innerHTML = "<h1>Character not found</h1>";
            return;

        }


        document.title = character.name;


        document.getElementById("character").innerHTML = `

        <div class="wiki">

<div class="character-header">

    <img src="${character.image}">

    <div>

        <h1 class="${teamColors[character.team]}">
            ${character.name}
        </h1>

        <h3>
            ${character.team}
        </h3>

    </div>

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

                    <h2>How to Run</h2>

                    <ul>

                    ${(character.run || [])
                        .map(item => `<li>${item}</li>`)
                        .join("")}

                    </ul>

                </div>



                <div class="page">

                    <h2>Examples</h2>

                    ${(character.examples || [])
                        .map(item => `<div class="example">${item}</div>`)
                        .join("")}

                </div>


            </div>

        </div>

        `;


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
