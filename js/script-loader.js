console.log("script-loader.js updated 8/04/26 10:39");
/* ======================================================
   Script Generator Data
====================================================== */
const ScriptGenerator = {
    scripts: [],
    // Official characters only
    officialCharacters: new Map(),
    // Official + homebrew characters
    characterLookup: new Map(),
    currentScript: null
};
/* ======================================================
   Load Official Characters
====================================================== */
async function loadOfficialCharacters() {
    const response = await fetch("/data/characters.json");
    if (!response.ok) {
        throw new Error("Failed to load characters.json");
    }
    const data = await response.json();
    ScriptGenerator.characters =
        new Map(Object.entries(data));
    console.log(
        "Loaded",
        ScriptGenerator.characters.size,
        "official characters"
    );
}
/* ======================================================
   Load Script Index
====================================================== */
async function loadScriptIndex() {
    const response = await fetch("/data/index.json");
    if (!response.ok) {
        throw new Error("Failed to load index.json");
    }
    ScriptGenerator.scripts = await response.json();
    console.log(
        "Loaded",
        ScriptGenerator.scripts.length,
        "scripts"
    );
}
/* ======================================================
   Load One Script
====================================================== */
async function loadScript(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Failed to load " + path);
    }
const script = await response.json();
ScriptGenerator.currentScript = script;
console.log(
    "Script entries:",
    script.length
);
    console.log("Loaded script:", script.name || path);
    return script;
}
/* ======================================================
   Extract Characters From Script
====================================================== */
function extractScriptCharacters(script) {
    const characters = [];
    if (!Array.isArray(script)) {
        console.error("Script is not an array:", script);
        return characters;
    }
    script.forEach(entry => {
        // Ignore metadata
        if (
            typeof entry === "object" &&
            entry.id === "_meta"
        ) {
            return;
        }
        // Official character ID
        if (typeof entry === "string") {
            const character = ScriptGenerator.characters.get(entry);
            if (character) {
                characters.push({
                    id: entry,
                    ...character,
                    official: true,
                    homebrew: false
                });
            }
            else {
                console.warn(
                    "Missing official character:",
                    entry
                );
            }
        }
        // Homebrew character
        else if (
            typeof entry === "object" &&
            entry.id
        ) {
            characters.push({
                ...entry,
                official: false,
                homebrew: true
            });
        }
    });
    console.log(
        "Extracted",
        characters.length,
        "script characters"
    );
    characters.forEach(character => {
        console.log(
            character.id,
            character.name,
            character.team
        );
    });
function normalizeCharacter(character){
    // Fix image arrays
    if(Array.isArray(character.image)){
        character.image = character.image[0];
    }
    // Normalize team capitalization
    if(character.team){
        character.team =
            character.team.charAt(0).toUpperCase() +
            character.team.slice(1).toLowerCase();
    }
    return normalizeCharacter(character);
}
    return characters;
}
/* ======================================================
   Build Character Lookup
====================================================== */
function buildCharacterLookup(script){
    ScriptGenerator.characterLookup = new Map();
    // Add all official characters first
    ScriptGenerator.characters.forEach((character,id)=>{
        ScriptGenerator.characterLookup.set(id, character);
    });
    // Add homebrew characters from script
    const scriptCharacters = extractScriptCharacters(script);
    scriptCharacters.forEach(character=>{
        if(character.id){
            ScriptGenerator.characterLookup.set(
                character.id,
                normalizeCharacter(character)
            );
        }
    });
    console.log(
        "Lookup contains",
        ScriptGenerator.characterLookup.size,
        "characters"
    );
}
