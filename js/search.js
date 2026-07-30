document.addEventListener("DOMContentLoaded", async () => {

    const searchBox = document.getElementById("searchBox");
    const searchResults = document.getElementById("searchResults");

    if (!searchBox || !searchResults) return;


    let searchCharacters = [];


    // Load character data
    try {

        const response = await fetch("/data/characters.json");

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
                <small>${character.team}</small>
                </div>

        `;


            item.onclick = () => {

                window.location.href = "/characters/" + character.id + ".html";

            };


            searchResults.appendChild(item);


        });


        searchResults.style.display = "block";


    });



    // Hide when clicking elsewhere

    document.addEventListener("click", (event) => {

        if (!event.target.closest(".search-box")) {

            searchResults.style.display = "none";

        }

    });


});
