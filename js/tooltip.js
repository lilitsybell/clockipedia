console.log("tooltip.js updated 7/31/26 16:43");
document.addEventListener("DOMContentLoaded", async () => {
    await loadCharacters();
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
        const character = characters[target.dataset.character];
        if(!character) return;
        tooltip.className =
            "ability-tooltip " + (teamColors[character.team] || "purple");
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <img src="${character.image}">
                <div class="tooltip-title">
                    <strong>${character.name}</strong>
                    <span>${singularTeams(character.team)}</span>
                </div>
            </div>

            <div class="tooltip-ability">
                ${character.ability}
            </div>
        `;
        tooltip.style.display = "block";
        const rect = target.getBoundingClientRect();
        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + 10;
        if(left + 320 > window.innerWidth){
            left = window.innerWidth - 340;
        }
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    });
    document.addEventListener("mouseout", event=>{
        if(event.target.closest("[data-character]")){
            tooltip.style.display = "none";
        }
    });
}
