console.log("tooltip.js updated 7/31/26 14:24");
let tooltipCharacters = {};
const tooltipTeamColors = {
    "Townsfolk":"blue",
    "Outsider":"blue",
    "Outsiders":"blue",
    "Minion":"red",
    "Minions":"red",
    "Demon":"red",
    "Demons":"red",
    "Traveller":"traveller",
    "Travellers":"traveller",
    "Loric":"green",
    "Fabled":"gold"
};
const singularTeams = {
    "Townsfolk": "Townsfolk",
    "Outsiders": "Outsider",
    "Minions": "Minion",
    "Demons": "Demon",
    "Travellers": "Traveller",
    "Loric": "Loric",
    "Fabled": "Fabled"
};
fetch("/data/characters.json")
.then(response => response.json())
.then(data => {
    tooltipCharacters = data;
    setupTooltips();
});
function setupTooltips(){
    let tooltip = document.querySelector(".ability-tooltip");
    if(!tooltip){
        tooltip = document.createElement("div");
        tooltip.className = "ability-tooltip";
        document.body.appendChild(tooltip);
    }
    document.addEventListener("mouseover", event=>{
        const target = event.target.closest("[data-character]");
        if(!target) return;
        const id = target.dataset.character;
        const character = tooltipCharacters[id];
        if(!character) return;
        const teamClass = tooltipTeamColors[character.team] || "purple";
        tooltip.className = 
            "ability-tooltip " + teamClass;
tooltip.innerHTML = `
<div class="tooltip-header">
    <img src="${character.image}">
    <div class="tooltip-title">
        <strong>${character.name}</strong>
        <span>${singularTeams[character.team] || character.team}</span>
    </div>
</div>
<div class="tooltip-ability">
    ${character.ability}
</div>
`;
        tooltip.style.display = "block";
        const rect = target.getBoundingClientRect();
        let left =
            rect.left + window.scrollX;
        let top =
            rect.bottom + window.scrollY + 10;
        // Keep tooltip on screen
        if(left + 320 > window.innerWidth){
            left = window.innerWidth - 340;
        }
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    });
    document.addEventListener("mouseout", event=>{
        const target = event.target.closest("[data-character]");
        if(!target) return;
        tooltip.style.display="none";
    });
});
