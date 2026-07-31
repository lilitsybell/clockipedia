console.log("tooltip.js updated 7/31/26 14:24");
document.addEventListener("DOMContentLoaded", () => {
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
        const character = characters[id];
        if(!character) return;
        const teamClass = teamColors[character.team] || "purple";
        tooltip.className = 
            "ability-tooltip " + teamClass;
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <img src="${character.image}">
                <div class="tooltip-title">
                    <strong>${character.name}</strong>
                    <span>${character.team}</span>
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
