console.log("interactions Updated 8/03/26 22:55");
let interactions = [];
async function loadInteractions(){
    const response = await fetch("/data/interactions.json");
    interactions = await response.json();
}
function getCharacters(text){
    const matches=text.match(/\[(.*?)\]/g);
    if(!matches) return [];
    return matches.map(match=>
        match.slice(1,-1)
    );
}
function getInteractionCharacters(){
    const set = new Set();
    interactions.forEach(interaction=>{
        getCharacters(interaction.text)
        .forEach(character=>{
            set.add(character);
        });
    });
    return [...set].sort((a,b)=>a.localeCompare(b));
}
function getInteractionColor(interaction){
    const chars = getCharacters(interaction.text);
    let colors = [];
    chars.forEach(character=>{
        const slug = getSlug(character);
        const data = characters[slug];
        if(data){
            const color = teamColors[data.team] || "default";
            if(color && !colors.includes(color)){
                colors.push(color);
            }
        }
    });
    // Traveller gets priority
    if(colors.includes("traveller")){
        return "traveller";
    }
    // If all same color, use it
    if(colors.length === 1){
        return colors[0];
    }
    // Mixed teams default purple
    return "purple";
}
function createInteractionCard(interaction){
    const li = document.createElement("li");
    const interactionColor = getInteractionColor(interaction);
    li.className = `interaction-card ${interactionColor}`;
    let infoButtons = "";
    let mathTriangle = "";
    if(interaction.math){
        let mathText = interaction.mathInfo ||
            (interaction.math === "green"
                ? "Mathematician registers this as normal."
                : "Mathematician registers this as abnormal.");
        mathTriangle = `
        <span class="math-triangle ${interaction.math}"
        data-info="${mathText.replace(/"/g, '&quot;')}">
        </span>
        `;
    }
    if(interaction.reason){
        infoButtons += `
        <span class="info-button info-popup"
        data-info="${interaction.reason.replace(/"/g, '&quot;')}">
            ?
        </span>
        `;
    }
li.innerHTML = `
    <div class="interaction-text">
        ${formatCharacters(interaction.text)}
    </div>
    <div class="interaction-icons">
        ${infoButtons}
        ${mathTriangle}
    </div>
`;
    return li;
}
