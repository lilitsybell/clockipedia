console.log("characters.js updated 7/31/26 16:45");
let characters = {};
const teamColors = {
    "Townsfolk":"blue",
    "Outsider":"blue",
    "Outsiders":"blue",
    "Minion":"red",
    "Minions":"red",
    "Demon":"red",
    "Demons":"red",
    "Traveller":"traveller",
    "Travellers":"traveller",
    "Loric":"lime",
    "Fabled":"copper"
};
const singularTeams = {
    "Townsfolk":"Townsfolk",
    "Outsiders":"Outsider",
    "Minions":"Minion",
    "Demons":"Demon",
    "Travellers":"Traveller",
    "Loric":"Loric",
    "Fabled":"Fabled"
};
const slugExceptions = {
    "Al-Hadikhia":"alhadikhia",
    "Big Wig":"bigwig",
    "Bounty Hunter":"bountyhunter",
    "Bone Collector":"bonecollector",
    "Cult Leader":"cultleader",
    "Deus ex Fiasco":"deusexfiasco",
    "Devil’s Advocate":"devilsadvocate",
    "Devil's Advocate":"devilsadvocate",
    "Evil Twin":"eviltwin",
    "Fang Gu":"fanggu",
    "Fortune Teller":"fortuneteller",
    "God of Ug":"godofug",
    "Hell’s Librarian":"hellslibrarian",
    "Hell's Librarian":"hellslibrarian",
    "High Priestess":"highpriestess",
    "Lil’ Monsta":"lilmonsta",
    "Lil' Monsta":"lilmonsta",
    "Lord of Typhon":"lordoftyphon",
    "No Dashii":"nodashii",
    "Organ Grinder":"organgrinder",
    "Pit-Hag":"pithag",
    "Poppy Grower":"poppygrower",
    "Plague Doctor":"plaguedoctor",
    "Scarlet Woman":"scarletwoman",
    "Snake Charmer":"snakecharmer",
    "Spirit of Ivory":"spiritofivory",
    "Storm Catcher":"stormcatcher",
    "Tea Lady":"tealady",
    "Town Crier":"towncrier",
    "Village Idiot":"villageidiot"
};
function singularTeam(team){
    return {
        "Townsfolk":"Townsfolk",
        "Outsiders":"Outsider",
        "Minions":"Minion",
        "Demons":"Demon",
        "Travellers":"Traveller",
        "Loric":"Loric",
        "Fabled":"Fabled"
    }[team] || team;
}
function getSlug(name){
    return slugExceptions[name] || name
        .toLowerCase()
        .replace(/[’']/g,"")
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,"");
}
async function loadCharacters(){
    if(Object.keys(characters).length){
        return characters;
    }
    const response = await fetch("./data/characters.json");
    characters = await response.json();
    return characters;
}
function getCharacter(id){
    return characters[id];
}
function formatCharacters(text){
    // Preserve escaped brackets
    text = text
        .replace(/\[\[/g, "__LBRACKET__")
        .replace(/\]\]/g, "__RBRACKET__");
    text = text.replace(/\[(.*?)\]/g, (_, character)=>{
        const slug = getSlug(character);
        const linkedCharacter = getCharacter(slug);
        let team = "default";
        if(linkedCharacter){
            team = teamColors[linkedCharacter.team] || "default";
        }
        return `
<a
    href="character.html?id=${slug}"
    class="character-link ${team}"
    data-character="${slug}">
    ${character}
</a>`;
    });
    return text
        .replace(/__LBRACKET__/g, "[")
        .replace(/__RBRACKET__/g, "]");
}
function getCharacters(text){
    text = text
        .replace(/\[\[/g, "__LBRACKET__")
        .replace(/\]\]/g, "__RBRACKET__");
    const matches = text.match(/\[(.*?)\]/g);
    if(!matches) return [];
    return matches.map(match =>
        match.slice(1,-1)
    );
}
function getInteractionColor(interaction){
    const chars = getCharacters(interaction.text);
    let colors = [];
    chars.forEach(character => {
        const slug = getSlug(character);
        const data = characters[slug];
        if(data){
            const color = teamColors[data.team];
            if(color && !colors.includes(color)){
                colors.push(color);
            }
        }
    });
    if(colors.includes("traveller")){
        return "traveller";
    }
    if(colors.length === 1){
        return colors[0];
    }
    return "purple";
}
