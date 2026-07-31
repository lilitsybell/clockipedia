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
    "Loric":"green",
    "Fabled":"gold"
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
    "Organ Grinder":"organgrinder",
    "Lil’ Monsta":"lilmonsta",
    "Lil' Monsta":"lilmonsta",
    "Pit-Hag":"pithag",
    "Devil’s Advocate":"devilsadvocate",
    "Devil's Advocate":"devilsadvocate",
    "Hell’s Librarian":"hellslibrarian",
    "Hell's Librarian":"hellslibrarian",
    "Al-Hadikhia":"alhadikhia",
    "Bounty Hunter":"bountyhunter",
    "Cult Leader":"cultleader",
    "Evil Twin":"eviltwin",
    "Fang Gu":"fanggu",
    "Fortune Teller":"fortuneteller",
    "High Priestess":"highpriestess",
    "Lord of Typhon":"lordoftyphon",
    "No Dashii":"nodashii",
    "Poppy Grower":"poppygrower",
    "Plague Doctor":"plaguedoctor",
    "Scarlet Woman":"scarletwoman",
    "Snake Charmer":"snakecharmer",
    "Spirit of Ivory":"spiritofivory",
    "Tea Lady":"tealady",
    "Town Crier":"towncrier",
    "Village Idiot":"villageidiot",
    "Deus ex Fiasco":"deusexfiasco",
    "Big Wig":"bigwig",
    "God of Ug":"godofug",
    "Storm Catcher":"stormcatcher"
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
    const response = await fetch("/data/characters.json");
    characters = await response.json();
    return characters;
}
function getCharacter(id){
    return characters[id];
}
function formatCharacters(text){
    return text.replace(/\[(.*?)\]/g, (_, character)=>{
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
}
function getCharacters(text){
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
