document.addEventListener("DOMContentLoaded", () => {
    const tooltip = document.createElement("div");
    tooltip.className = "ability-tooltip";
    document.body.appendChild(tooltip);
    document.addEventListener("mouseover", (event)=>{
        const link = event.target.closest(".character-link");
        if(!link) return;
        const ability = link.dataset.ability;
        if(!ability) return;
        tooltip.textContent = ability;
        tooltip.style.display = "block";
    });
    document.addEventListener("mousemove", (event)=>{
        if(tooltip.style.display === "block"){
            tooltip.style.left = event.pageX + 15 + "px";
            tooltip.style.top = event.pageY + 15 + "px";
        }
    });
    document.addEventListener("mouseout", (event)=>{
        const link = event.target.closest(".character-link");
        if(!link) return;
        tooltip.style.display = "none";
    });
});
