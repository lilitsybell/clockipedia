console.log("tooltip.js updated 7/31/26 2:00PM");
document.addEventListener("DOMContentLoaded", () => {
let tooltip = document.querySelector(".ability-tooltip");
if(!tooltip){
    tooltip = document.createElement("div");
    tooltip.className = "ability-tooltip";
    document.body.appendChild(tooltip);
}
    document.addEventListener("mouseover", (event)=>{
        const target = event.target.closest("[data-tooltip], .character-link");
        if(!target) return;
        let text = target.dataset.tooltip;
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
