console.log("interactions Updated 8/03/26 22:55");
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

    ...
    ...

    return li;
}
