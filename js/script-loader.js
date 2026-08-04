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
        // Official character ID
        if (typeof entry === "string") {
            let character;
            // Map format
            if (ScriptGenerator.characters instanceof Map) {
                character = ScriptGenerator.characters.get(entry);
            }
            // Object format fallback
            else {
                character = ScriptGenerator.characters[entry];
            }
            if (character) {
                characters.push(character);
            }
            else {
                console.warn(
                    "Missing official character:",
                    entry
                );
            }
        }
        // Homebrew character object
        else if (
            typeof entry === "object" &&
            entry.id
        ) {
            characters.push(entry);
        }
    });
    console.log(
        "Extracted",
        characters.length,
        "script characters"
    );
   console.log("Extracted character list:");
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
function buildCharacterLookup(script) {
    ScriptGenerator.characterLookup = new Map();
    const characters = extractScriptCharacters(script);
    characters.forEach(character => {
        ScriptGenerator.characterLookup.set(
            character.id,
            character
        );
    });
    console.log(
        "Lookup contains",
        ScriptGenerator.characterLookup.size,
        "characters"
    );
    return characters;
}
