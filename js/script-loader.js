console.log("script-loader.js updated 8/04/26 10:05");
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
    ScriptGenerator.officialCharacters = new Map();
    Object.entries(data).forEach(([id, character]) => {
        character.id = id;
        ScriptGenerator.officialCharacters.set(
            id,
            character
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
console.log(
    "Script entries:",
    script.length
);
    console.log("Loaded script:", script.name || path);
    return script;
}
/* ======================================================
   Build Character Lookup
====================================================== */
function buildCharacterLookup(script){
    ScriptGenerator.characterLookup =
        new Map();
    // official characters
    ScriptGenerator.officialCharacters
    .forEach((character,id)=>{
        ScriptGenerator.characterLookup.set(
            id,
            character
        );
    });
    // homebrew characters
    const characters =
        extractScriptCharacters(script);
    characters.forEach(character=>{
        if(typeof character === "object"){
            ScriptGenerator.characterLookup.set(
                character.id,
                character
            );
        }
    });
    console.log(
        "Lookup contains",
        ScriptGenerator.characterLookup.size,
        "characters"
    );
}
