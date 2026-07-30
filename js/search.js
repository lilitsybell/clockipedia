async function loadSearch(){

    const searchBox = document.getElementById("searchBox");
    const searchResults = document.getElementById("searchResults");

    if (!searchBox || !searchResults) return;


    let searchCharacters = [];

    
const singularTeams = {
    "Townsfolk": "Townsfolk",
    "Outsiders": "Outsider",
    "Minions": "Minion",
    "Demons": "Demon",
    "Travellers": "Traveller",
    "Loric": "Loric"
};

    // Load character data
    try {

        const response = await fetch("/data/characters.json");
        console.log("Characters response:", response);

        const data = await response.json();

        searchCharacters = Object.entries(data).map(([id, character]) => ({
            id,
            ...character
        }));

    } catch (error) {

        console.error("Could not load characters:", error);

    }

    searchBox.addEventListener("input", () => {

        const query = searchBox.value.toLowerCase().trim();


        searchResults.innerHTML = "";


        if (!query) {

            searchResults.style.display = "none";
            return;

        }



        const matches = searchCharacters.filter(character =>

            character.name.toLowerCase().includes(query)

        ).slice(0, 8);



        if (matches.length === 0) {

            searchResults.style.display = "none";
            return;

        }



        matches.forEach(character => {


            const item = document.createElement("div");

            item.className = "search-item";


item.innerHTML = `

    <img src="${character.image}" class="search-icon">

    <div>
        <strong>${character.name}</strong>

        <br>

        <small>${singularTeams[character.team] || character.team}</small>
    </div>

`;


item.onclick = () => {

    window.location.href = "/character.html?id=" + character.id;

};


            searchResults.appendChild(item);


        });


        searchResults.style.display = "block";


    });

    searchBox.addEventListener("keydown", (event)=>{

    if(event.key === "Enter"){

        const first = searchCharacters.filter(character =>
            character.name.toLowerCase().includes(searchBox.value.toLowerCase())
        )[0];

if(first){
    window.location.href = "/character.html?id=" + first.id;
}

    }

});



    // Hide when clicking elsewhere

    document.addEventListener("click", (event) => {

        if (!event.target.closest(".search-box")) {

            searchResults.style.display = "none";

        }

    });
}
