console.log("characters.js loaded");
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
const slugExceptions = {
    "Organ Grinder": "organgrinder",
    "Lil’ Monsta": "lilmonsta",
    "Lil' Monsta": "lilmonsta",
    "Pit-Hag": "pithag",
    "Devil’s Advocate": "devilsadvocate",
    "Devil's Advocate": "devilsadvocate",
    "Hell’s Librarian": "hellslibrarian",
    "Hell's Librarian": "hellslibrarian",
    "Al-Hadikhia": "alhadikhia",
    "Bounty Hunter": "bountyhunter",
    "Cult Leader": "cultleader",
    "Evil Twin": "eviltwin",
    "Fortune Teller": "fortuneteller",
    "High Priestess": "highpriestess",
    "Lord of Typhon": "lordoftyphon",
    "No Dashii": "nodashii",
    "Poppy Grower": "poppygrower",
    "Plague Doctor": "plaguedoctor",
    "Scarlet Woman": "scarletwoman",
    "Snake Charmer": "snakecharmer",
    "Spirit of Ivory": "spiritofivory",
    "Tea Lady": "tealady",
    "Town Crier": "towncrier",
    "Village Idiot": "villageidiot",
    "Deus ex Fiasco": "deusexfiasco",
    "Big Wig": "bigwig",
    "God of Ug": "godofug",
    "Storm Catcher": "stormcatcher"
};
function getSlug(name){
    return slugExceptions[name] || name
        .toLowerCase()
        .replace(/[’']/g,"")
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,"");
}
async function loadCharacters(){
    const response = await fetch("/data/characters.json");
    characters = await response.json();
}
