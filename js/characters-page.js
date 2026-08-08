console.log("characters-page.js loaded");

let allCharacters = [];

const teamOrder = [
"Townsfolk",
"Outsiders",
"Minions",
"Demons",
"Loric",
"Fabled"
];

const teamColors = {
"Townsfolk":"blue",
"Outsiders":"blue",
"Minions":"red",
"Demons":"red",
"Loric":"lime",
"Fabled":"copper"
};

function getCharacterId(character){
return Object.keys(
window.characterData
).find(
id =>
window.characterData[id] === character
);
}

function createCharacterCard(character, id){

```
const card =
    document.createElement("a");

card.className =
    "character-directory-card";

card.href =
    `/character.html?id=${id}`;

const teamClass =
    teamColors[character.team] || "blue";

card.classList.add(teamClass);

const icon =
    document.createElement("img");

icon.className =
    "character-directory-icon";

icon.src =
    character.image;

icon.alt =
    character.name;

const content =
    document.createElement("div");

content.className =
    "character-directory-content";

const name =
    document.createElement("h2");

name.textContent =
    character.name;

const ability =
    document.createElement("p");

ability.className =
    "character-directory-ability";

ability.textContent =
    character.ability || "";

const tags =
    document.createElement("div");

tags.className =
    "character-directory-tags";

if(character.tags){
    character.tags.forEach(tag => {

        const tagElement =
            document.createElement("span");

        tagElement.className =
            "character-directory-tag";

        tagElement.textContent =
            tag;

        tags.appendChild(
            tagElement
        );

    });
}

content.appendChild(name);
content.appendChild(ability);
content.appendChild(tags);

card.appendChild(icon);
card.appendChild(content);

return card;
```

}

function renderCharacters(){

```
const container =
    document.getElementById(
        "characterDirectory"
    );

if(!container){
    console.error(
        "Character directory not found"
    );
    return;
}

container.innerHTML = "";

teamOrder.forEach(team => {

    const characters =
        allCharacters.filter(
            character =>
                character.team === team
        );

    if(!characters.length){
        return;
    }

    const section =
        document.createElement("section");

    section.className =
        "character-team-section";

    const heading =
        document.createElement("h2");

    heading.className =
        "character-team-heading";

    heading.textContent =
        team;

    section.appendChild(
        heading
    );

    const grid =
        document.createElement("div");

    grid.className =
        "character-directory-grid";

    characters.forEach(
        character => {

            const id =
                getCharacterId(
                    character
                );

            if(!id){
                return;
            }

            grid.appendChild(
                createCharacterCard(
                    character,
                    id
                )
            );

        }
    );

    section.appendChild(grid);

    container.appendChild(section);

});
```

}

async function loadCharacterDirectory(){

```
try{

    const response =
        await fetch(
            "/data/characters.json"
        );

    if(!response.ok){
        throw new Error(
            "Failed to load characters.json"
        );
    }

    const data =
        await response.json();

    window.characterData =
        data;

    allCharacters =
        Object.values(data);

    console.log(
        "Loaded characters:",
        allCharacters.length
    );

    renderCharacters();

}
catch(error){

    console.error(
        "Character directory failed:",
        error
    );

}
```

}

document.addEventListener(
"DOMContentLoaded",
loadCharacterDirectory
);
