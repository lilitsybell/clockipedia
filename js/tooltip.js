console.log("tooltip.js updated 7/31/26 14:05");
document.addEventListener("DOMContentLoaded", () => {
    const tooltip = document.createElement("div");
    tooltip.className = "ability-tooltip";
    document.body.appendChild(tooltip);
    document.addEventListener("mouseover", event=>{
        const target = event.target.closest("[data-character]");
        if(!target) return;
        const id = target.dataset.character;
        const character = characters[id];
        if(!character) return;
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <img src="${character.image}">
                <div>
                    <strong>${character.name}</strong>
                    <span>${character.team}</span>
                </div>
            </div>
            <div class="tooltip-ability">
                ${character.ability}
            </div>
        `;
        tooltip.className =
            "ability-tooltip " +
            (teamColors[character.team] || "");
        tooltip.style.display="block";
        const rect = target.getBoundingClientRect();
        tooltip.style.left =
            rect.left + window.scrollX
            + "px";
        tooltip.style.top =
            rect.bottom + window.scrollY + 8
            + "px";
    });
    document.addEventListener("mouseout", event=>{
        const target = event.target.closest("[data-character]");
        if(!target) return;
        tooltip.style.display="none";
    });
});
