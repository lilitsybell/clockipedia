console.log("tooltip.js updated 7/31/26 16:43");
document.addEventListener("DOMContentLoaded", async () => {
    await loadCharacters();
    setupTooltips();
});
function setupTooltips(){
    let tooltipTimer;
    let tooltip = document.querySelector(".ability-tooltip");
    if(!tooltip){
        tooltip = document.createElement("div");
        tooltip.className = "ability-tooltip";
        document.body.appendChild(tooltip);
    }
    document.addEventListener("mouseover", event=>{
        const target = event.target.closest("[data-character]");
        if(!target) return;
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(()=>{
            const character = characters[target.dataset.character];
            if(!character) return;
            tooltip.className =
                "ability-tooltip " + 
                (teamColors[character.team] || "purple");
            tooltip.innerHTML = `
                <div class="tooltip-header">
                    <img src="${character.image}">
                    <div class="tooltip-title">
                        <strong>${character.name}</strong>
                        <span>${singularTeam(character.team)}</span>
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
            const tooltipWidth = 320;
            const tooltipHeight = tooltip.offsetHeight;
            // Prevent right edge overflow
            if(left + tooltipWidth > window.innerWidth){
                left = window.innerWidth - tooltipWidth - 20;
            }
            // Prevent bottom overflow
            if(top + tooltipHeight > window.innerHeight + window.scrollY){
                top = rect.top + window.scrollY - tooltipHeight - 10;
            }
            // Prevent left overflow
            if(left < 10){
                left = 10;
            }
            tooltip.style.left = left + "px";
            tooltip.style.top = top + "px";
        },250);
    });
document.addEventListener("mouseout", event=>{
    if(event.target.closest("[data-character]")){
        clearTimeout(tooltipTimer);
        tooltip.style.display = "none";
        tooltip.innerHTML = "";
        tooltip.className = "ability-tooltip";
    }
});
}
