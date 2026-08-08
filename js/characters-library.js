console.log("characters-library.js updated 8/08/26 09:05");
let characterLibrary = [];
async function loadCharacterLibrary(){
    const response =
        await fetch("./data/characters.json");
    if(!response.ok){
        throw new Error(
            "Failed to load characters.json"
        );
    }
    const data =
        await response.json();
    characterLibrary =
        Object.entries(data).map(
            ([id, character]) => ({
                id,
                ...character
            })
        );
    console.log(
        "Loaded character library:",
        characterLibrary.length
    );
    renderCharacterLibrary();
}
function renderCharacterLibrary(){
    const container =
        document.getElementById(
            "characterLibrary"
        );
    if(!container){
        return;
    }
    container.innerHTML = "";
    characterLibrary.forEach(
        character => {
            const card =
                document.createElement("a");
            card.className =
                "character-card";
            card.href =
                `/character.html?id=${character.id}`;
            card.innerHTML = `
                <div class="character-card-image">
                    <img
                        src="${character.image}"
                        alt="${character.name}"
                    >
                </div>
                <h2>
                    ${character.name}
                </h2>
                <p class="character-card-ability">
                    ${character.ability || ""}
                </p>
            `;
            container.appendChild(card);
        }
    );
}
loadCharacterLibrary();
