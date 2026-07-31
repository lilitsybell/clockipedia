console.log("tooltip.js loaded");
let tooltip;
function initTooltips(){
    tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    document.body.appendChild(tooltip);
    document.addEventListener("mouseover", event => {
        const target = event.target.closest("[data-tooltip]");
        if(!target) return;
        tooltip.innerHTML = target.dataset.tooltip;
        tooltip.style.opacity = "1";
    });
    document.addEventListener("mousemove", event => {
        if(tooltip.style.opacity !== "1") return;
        tooltip.style.left = (event.pageX + 18) + "px";
        tooltip.style.top = (event.pageY + 18) + "px";
    });
    document.addEventListener("mouseout", event => {
        if(event.target.closest("[data-tooltip]")){
            tooltip.style.opacity = "0";
        }
    });
}
