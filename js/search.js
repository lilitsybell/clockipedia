console.log("search.js updated 7/31/26 17:10");
async function loadSearch(){
    const searchBox = document.getElementById("searchBox");
    const searchResults = document.getElementById("searchResults");
    if (!searchBox || !searchResults) return;
    await loadCharacters();
    const searchCharacters = Object.entries(characters).map(([id, character]) => ({
        id,
        ...character
    }));
    searchBox.addEventListener("input", () => {
        const query = searchBox.value.toLowerCase().trim();
        searchResults.innerHTML = "";
        if (!query){
            searchResults.style.display = "none";
            return;
        }
        const matches = searchCharacters
            .filter(character =>
                character.name.toLowerCase().includes(query)
            )
            .slice(0, 8);
        if(matches.length === 0){
            searchResults.style.display = "none";
            return;
        }
        matches.forEach(character => {
            const item = document.createElement("div");
            item.className = "search-item";
            const teamClass = teamColors[character.team] || "default";
            item.innerHTML = `
                <img src="${character.image}" class="search-icon">
                <div class="search-text ${teamClass}">
                    <strong>${character.name}</strong>
                    <small>${singularTeam(character.team)}</small>
                </div>
            `;
            item.onclick = () => {
                window.location.href =
                    "/character.html?id=" + character.id;
            };
            searchResults.appendChild(item);
        });
        searchResults.style.display = "block";
    });
    searchBox.addEventListener("keydown", event => {
        if(event.key === "Enter"){
            const first = searchCharacters.find(character =>
                character.name
                    .toLowerCase()
                    .includes(searchBox.value.toLowerCase())
            );
            if(first){
                window.location.href =
                    "/character.html?id=" + first.id;
            }
        }
    });
    document.addEventListener("click", event => {
        if(!event.target.closest(".search-box")){
            searchResults.style.display = "none";
        }
    });
}
