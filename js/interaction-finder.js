console.log("interaction-finder Updated 8/03/26 23:02");
document.addEventListener("DOMContentLoaded", async()=>{
    try{
        await loadCharacters();
        const interactionResponse = await fetch("/data/interactions.json");
        interactions = await interactionResponse.json();
buildPage();
loadURLCharacters();
    }
    catch(error){
        console.error("Interaction Finder failed:", error);
    }
});
function loadURLCharacters(){
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("characters");
    if(!ids) return;
    const charactersFromURL = ids.split(",");
    const selectors = [
        document.querySelector("#selector1"),
        document.querySelector("#selector2"),
        document.querySelector("#selector3")
    ];
    charactersFromURL.forEach((id,index)=>{
        const character = characters[id];
        if(!character) return;
        if(selectors[index] && selectors[index].setValue){
            selectors[index].setValue(character.name);
        }
    });
    updateResults();
}
function updateURLCharacters(){
    const selected = [
        document.querySelector("#selector1").getValue(),
        document.querySelector("#selector2").getValue(),
        document.querySelector("#selector3").getValue()
    ]
    .filter(x => x !== "")
    .map(name => getSlug(name));
    const url = new URL(window.location);
    if(selected.length){
        url.searchParams.set(
            "characters",
            selected.join(",")
        );
    }
    else{
        url.searchParams.delete("characters");
    }
    history.replaceState(null,"",url);
}
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
const matchingInteractions = interactions.filter(interaction=>{
    const charactersInInteraction = new Set(
        getCharacters(interaction.text)
    );
    return selected.every(character =>
        charactersInInteraction.has(character)
    );
});
matchingInteractions
.sort((a,b)=>{
    const aCharacters = new Set(getCharacters(a.text)).size;
    const bCharacters = new Set(getCharacters(b.text)).size;
    // First: fewest unique characters
    if(aCharacters !== bCharacters){
        return aCharacters - bCharacters;
    }
    // Second: shortest interaction text
    return a.text.length - b.text.length;
})
.forEach(interaction=>{
list.appendChild(createInteractionCard(interaction));
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
                    <small>${singularTeam(char.team)}</small>
                </div>
            `;
item.onclick=()=>{
    selected = char.name;
    input.value = char.name;
    clearButton.style.display = "flex";
    results.style.display="none";
    updateURLCharacters();
    updateResults();
};
            results.appendChild(item);
        });
        results.style.display="block";
    });
container.setValue = (name)=>{
    selected = name;
    input.value = name;
    clearButton.style.display = "flex";
};
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
    updateURLCharacters();
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
updateURLCharacters();
updateResults();
    };
}
