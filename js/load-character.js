console.log("Character ID:", characterID);
document.addEventListener("DOMContentLoaded", async () => {

    try {

        const response = await fetch("../data/characters.json");
        console.log("Characters loaded:", characters);

        const characters = await response.json();

        const character = characters[characterID];


        if (!character) {

            document.body.innerHTML = "<h1>Character not found</h1>";
            return;

        }


        document.title = character.name;


        document.body.innerHTML = `

        <div class="wiki">

            <div class="character-header">

                <img src="${character.image}" id="characterImage">

                <div>

                    <h1>${character.name}</h1>

                    <h3>${character.team}</h3>

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


            <div class="content">


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
