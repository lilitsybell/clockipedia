console.log("script-loader.js updated 8/04/26 11:07");
/* ======================================================
   Script Generator Data
====================================================== */
const ScriptGenerator = {
    scripts: [],
    officialCharacters: new Map(),
    characterLookup: new Map(),
    currentScript: null
};
/* ======================================================
   Normalize Character Data
====================================================== */
function normalizeCharacter(character){
    if(Array.isArray(character.image)){
        character.image = character.image[0];
    }
    if(character.team){
        character.team =
            character.team.charAt(0).toUpperCase() +
            character.team.slice(1).toLowerCase();
    }
    return character;
}
/* ======================================================
   Load Official Characters
====================================================== */
async function loadOfficialCharacters() {
    const response = await fetch("/data/characters.json");
    if (!response.ok) {
        throw new Error("Failed to load characters.json");
    }
    const data = await response.json();
    ScriptGenerator.officialCharacters = new Map();
    Object.entries(data).forEach(([id, character]) => {
        ScriptGenerator.officialCharacters.set(
            id,
            {
                id,
                ...character,
                official: true,
                homebrew: false
            }
        );
    });
    console.log(
        "Loaded",
        ScriptGenerator.officialCharacters.size,
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
    const meta = script.find(
        entry => 
            typeof entry === "object" &&
            entry.id === "_meta"
    );
    if(meta){
        script.meta = meta;
    }
    console.log(
        "Loaded script:",
        meta?.name || path
    );
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
            const character = ScriptGenerator.officialCharacters.get(entry);
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
    return characters;
}
/* ======================================================
   Build Character Lookup
====================================================== */
function buildCharacterLookup(script){
    ScriptGenerator.characterLookup = new Map();
    // Add official characters
    ScriptGenerator.officialCharacters.forEach((character,id)=>{
        ScriptGenerator.characterLookup.set(
            id,
            character
        );
    });
    // Add homebrew characters
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
