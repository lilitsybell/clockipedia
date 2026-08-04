console.log("script-loader.js updated 8/04/26 09:53");
/* ======================================================
   Script Generator Data
====================================================== */
const ScriptGenerator = {
    scripts: [],
    characters: new Map(),
    currentScript: null,
    characterLookup: new Map()
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
    ScriptGenerator.characters.clear();
    data.forEach(character => {
        ScriptGenerator.characters.set(character.id, character);
    });
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
    console.log("Loaded script:", script.name || path);
    return script;
}
/* ======================================================
   Build Character Lookup
====================================================== */
function buildCharacterLookup(script) {
    ScriptGenerator.characterLookup = new Map();
    // Start with official characters
    ScriptGenerator.characters.forEach((character, id) => {
        ScriptGenerator.characterLookup.set(id, character);
    });
    // Add embedded homebrew characters
    if (script.characters) {
        script.characters.forEach(character => {
            if (typeof character === "object") {
                ScriptGenerator.characterLookup.set(
                    character.id,
                    character
                );
            }
        });
    }
    console.log(
        "Lookup contains",
        ScriptGenerator.characterLookup.size,
        "characters"
    );
}
