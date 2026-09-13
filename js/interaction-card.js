console.log("interactions Updated 8/05/26 11:49");
let interactions = [];
async function loadInteractions(){
    const response = await fetch("./data/interactions.json");
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
function createInteractionCard(interaction){
    const li = document.createElement("li");
    li.className = "interaction-card";
    let infoButtons = "";
    let mathTriangle = "";
    if(interaction.math){
        let mathText = interaction.mathInfo ||
            (interaction.math === "green"
                ? "Mathematician registers this as normal."
                : "Mathematician registers this as abnormal.");
mathTriangle = `
<span
    class="math-triangle ${interaction.math}"
    data-info="${mathText.replace(/"/g, '&quot;')}"
>▲</span>
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
function getInteractionsForCharacter(characterName){
    return interactions.filter(interaction =>
        getCharacters(interaction.text)
            .includes(characterName)
    );
}
function getRandomInteractionForCharacter(characterName){
    const matches =
        getInteractionsForCharacter(characterName);
    if(!matches.length){
        return null;
    }
    return matches[
        Math.floor(
            Math.random() *
            matches.length
        )
    ];
}
