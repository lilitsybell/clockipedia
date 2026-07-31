console.log("tooltip.js loaded");
document.addEventListener("DOMContentLoaded", () => {
    const tooltip = document.createElement("div");
    tooltip.className = "ability-tooltip";
    document.body.appendChild(tooltip);
    document.addEventListener("mouseover", (event)=>{
        const target = event.target.closest("[data-tooltip], .character-link");
        if(!target) return;
        let text = target.dataset.tooltip;
        // Character ability support
        if(target.classList.contains("character-link")){
            text = target.dataset.ability;
        }
        if(!text || text.trim() === "") return;
        tooltip.textContent = text;
        tooltip.style.display = "block";
        const rect = target.getBoundingClientRect();
        tooltip.style.left =
            rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)
            + "px";
        tooltip.style.top =
            rect.top - tooltip.offsetHeight - 10
            + "px";
    });
    document.addEventListener("mouseout", (event)=>{
        const target = event.target.closest("[data-tooltip], .character-link");
        if(!target) return;
        tooltip.style.display = "none";
    });
});
