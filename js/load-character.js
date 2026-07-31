console.log("load-character updated 7/31/2026 16:37PM");
console.log("Character ID:", characterID);
document.addEventListener("DOMContentLoaded", async () => {
    try {
await loadCharacters();
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
<span 
    class="character-link ${teamColors[character.team]}"
    data-character="${characterID}"
>
    ${character.name}
</span>
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
const slug = getSlug(character);
        const linkedCharacter = characters[slug];
const team =
    linkedCharacter
        ? teamColors[linkedCharacter.team] || "default"
        : "default";
return `
<a 
    href="character.html?id=${slug}" 
    class="character-link ${team}"
    data-character="${slug}"
>
    ${character}
</a>`;
    });
}
