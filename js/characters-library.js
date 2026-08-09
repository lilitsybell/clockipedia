console.log("characters-library.js updated 8/08/26 23:06");

let characterLibrary = [];
let characterSort = "team";
const teamOrder = [
    "Townsfolk",
    "Outsiders",
    "Minions",
    "Demons",
    "Travellers",
    "Loric",
    "Fabled"
];
const editionOrder = [
    "Trouble Brewing",
    "Sects and Violets",
    "Bad Moon Rising",
    "Carousel",
    "NPCs"
];
const editionScriptFiles = {
    "Trouble Brewing":
        "./data/scripts/trouble-brewing.json",
    "Sects and Violets":
        "./data/scripts/sects-and-violets.json",
    "Bad Moon Rising":
        "./data/scripts/bad-moon-rising.json"
};
const editionCharacterOrder = {};
/* ==========================================
   Load Characters
========================================== */
async function loadEditionCharacterOrders(){
    for(
        const [edition, file]
        of Object.entries(editionScriptFiles)
    ){
        try{
            const response =
                await fetch(file);
            if(!response.ok){
                throw new Error(
                    `Failed to load ${file}`
                );
            }
            const script =
                await response.json();
            const characterIds =
                script.filter(
                    entry =>
                        typeof entry === "string"
                );
            editionCharacterOrder[edition] =
                characterIds;
        }
        catch(error){
            console.error(
                `Failed to load ${edition} order:`,
                error
            );
        }
    }
}
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
await loadEditionCharacterOrders();
setupCharacterSort();
renderCharacterLibrary();
}
/* ==========================================
   Sort Characters
========================================== */
function sortCharacters(){
    if(characterSort === "alphabetical"){
        characterLibrary.sort(
            (a,b) =>
                a.name.localeCompare(b.name)
        );
        return;
    }
if(characterSort === "edition"){
    characterLibrary.sort(
        (a,b) => {
            const editionA =
                a.edition || "";
            const editionB =
                b.edition || "";
            const editionIndexA =
                editionOrder.indexOf(
                    editionA
                );
            const editionIndexB =
                editionOrder.indexOf(
                    editionB
                );
            /*
             * First sort by our custom
             * edition order.
             */
            if(
                editionIndexA !==
                editionIndexB
            ){
                return (
                    editionIndexA -
                    editionIndexB
                );
            }
            /*
             * Get the official script
             * character order.
             */
            const order =
                editionCharacterOrder[
                    editionA
                ];
            if(order){
                const idA =
                    order.indexOf(
                        a.id
                    );
                const idB =
                    order.indexOf(
                        b.id
                    );
                /*
                 * Characters found in the
                 * script use script order.
                 */
                if(
                    idA !== -1 &&
                    idB !== -1
                ){
                    return idA - idB;
                }
                /*
                 * Anything not found in
                 * the script goes afterward.
                 */
                if(idA !== -1){
                    return -1;
                }
                if(idB !== -1){
                    return 1;
                }
            }
            /*
             * Fallback to alphabetical.
             */
            return a.name.localeCompare(
                b.name
            );
        }
    );
    return;
}
    /* Default: Team */
    characterLibrary.sort(
        (a,b) => {
            const teamA =
                teamOrder.indexOf(a.team);
            const teamB =
                teamOrder.indexOf(b.team);
            return (
                teamA - teamB
                ||
                a.name.localeCompare(
                    b.name
                )
            );
        }
    );
}
/* ==========================================
   Render Characters
========================================== */
function renderCharacterLibrary(){

    const container =
        document.getElementById(
            "characterLibrary"
        );
    if(!container){
        return;
    }
    container.innerHTML = "";
    sortCharacters();
    let currentGroup = null;
    let grid = null;
    characterLibrary.forEach(
        character => {
/*
 * Team and Edition sorting get section headings.
 * Alphabetical sorting uses one continuous grid.
 */
let groupValue = null;
if(characterSort === "team"){
    groupValue = character.team || "Unknown";
}
if(characterSort === "edition"){
    groupValue = character.edition || "Unknown Edition";
}
if(
    (characterSort === "team" ||
     characterSort === "edition") &&
    groupValue !== currentGroup
){
    currentGroup = groupValue;
    const heading =
        document.createElement(
            "h2"
        );
    heading.className =
        "character-team-heading";
    heading.textContent =
        currentGroup;
    container.appendChild(
        heading
    );
    grid =
        document.createElement(
            "div"
        );
    grid.className =
        "character-directory-grid";
    container.appendChild(
        grid
    );
}
const card =
    document.createElement("a");
card.className =
    "character-directory-card";
const teamClass =
    teamColors[
        character.team
    ] || "blue";
card.classList.add(teamClass);
card.href =
    `/character.html?id=${character.id}`;
/* Character icon */
const image =
    document.createElement("img");
image.className =
    "character-directory-icon";
image.src =
    character.image;
image.alt =
    character.name;
/* Card content */
const content =
    document.createElement("div");
content.className =
    "character-directory-content";
/* Character name */
const name =
    document.createElement("h2");
name.textContent =
    character.name;
/* Ability */
const ability =
    document.createElement("p");
ability.className =
    "character-directory-ability";
ability.textContent =
    character.ability || "";
/* Tags */
const tags =
    document.createElement("div");
tags.className =
    "character-directory-tags";
if(character.tags){
    character.tags.forEach(
        tag => {
            const tagElement =
                document.createElement("span");
            tagElement.className =
                "character-directory-tag";
            tagElement.textContent =
                tag;
            tags.appendChild(
                tagElement
            );
        }
    );
}
/* Assemble card */
content.appendChild(name);
content.appendChild(ability);
content.appendChild(tags);
card.appendChild(image);
card.appendChild(content);
grid.appendChild(card);
        }
    );
}
/* ==========================================
   Sort Control
========================================== */
function setupCharacterSort(){
    const sort =
        document.getElementById(
            "character-library-sort"
        );
    if(!sort){
        console.warn(
            "Character sort control not found"
        );
        return;
    }
    sort.value =
        characterSort;
    sort.addEventListener(
        "change",
        () => {
            characterSort =
                sort.value;
            renderCharacterLibrary();
        }
    );
}
/* ==========================================
   Start
========================================== */
loadCharacterLibrary();
