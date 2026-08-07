console.log("script-loader.js updated 8/04/26 16:37");
/* ======================================================
   Script Generator Data
====================================================== */
const ScriptGenerator = {
    scripts: [],
    officialCharacters: new Map(),
    characterLookup: new Map(),
    currentScript: null,
    recentScripts: [],
    filters:{
        homebrew:"maybe",
        size:"any",
        character:null
    }
};
/* ======================================================
   Load Script of the Day
====================================================== */

async function loadDailyScript(){

    const response =
        await fetch("./data/daily-script.json");

    if(!response.ok){
        throw new Error(
            "Failed to load daily-script.json"
        );
    }

    return await response.json();
}
function updateRecentScripts(script){
    const index =
        ScriptGenerator.recentScripts.indexOf(
            script.file
        );
    // Remove if already seen
    if(index !== -1){
        ScriptGenerator.recentScripts.splice(index,1);
    }
    // Add newest to front
    ScriptGenerator.recentScripts.unshift(
        script.file
    );
    // Keep only last 100
    if(ScriptGenerator.recentScripts.length > 100){
        ScriptGenerator.recentScripts.pop();
    }
}
/* ======================================================
   Normalize Character Data
====================================================== */
function normalizeCharacter(character){
    if(Array.isArray(character.image)){
        character.image = character.image[0];
    }
if(character.team){
    character.team =
        character.team
        .replace(/s$/, "")
        .charAt(0)
        .toUpperCase()
        +
        character.team
        .replace(/s$/, "")
        .slice(1)
        .toLowerCase();
}
    return character;
}
/* ======================================================
   Load Official Characters
====================================================== */
async function loadOfficialCharacters() {
    const response = await fetch("./data/characters.json");
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
}
/* ======================================================
   Load Script Index
====================================================== */
async function loadScriptIndex() {
    const response = await fetch("./data/index.json");
    if (!response.ok) {
        throw new Error("Failed to load index.json");
    }
    ScriptGenerator.scripts = await response.json();
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
    return script;
}
/* ======================================================
   Extract Characters From Script
====================================================== */
function extractScriptCharacters(script) {
    const characters = [];
    let meta = null;
    if (!Array.isArray(script)) {
        console.error("Script is not an array:", script);
        return characters;
    }
    script.forEach(entry => {
        // Metadata
        if (
            typeof entry === "object" &&
            entry.id === "_meta"
        ) {
            meta = entry;
            return;
        }
        // Official character ID
        if (typeof entry === "string") {
            const character =
                ScriptGenerator.officialCharacters.get(entry);
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
// Add or update Bootlegger automatically
const needsBootlegger =
    meta &&
    (
        meta.bootlegger ||
        characters.some(c => c.homebrew)
    );
if (needsBootlegger) {
    let bootlegger = characters.find(
        character => character.id === "bootlegger"
    );
    // Add Bootlegger if missing
    if (!bootlegger) {
        const officialBootlegger =
            ScriptGenerator.officialCharacters.get("bootlegger");
        if (officialBootlegger) {
            bootlegger = {
                id: "bootlegger",
                ...officialBootlegger,
                official: true,
                homebrew: false
            };
            characters.unshift(bootlegger);
        }
    }
    // Replace ability with custom Bootlegger rule
    if (
        bootlegger &&
        meta.bootlegger
    ) {
        bootlegger.ability =
    meta.bootlegger;
    }
}
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
   preloadCharacterImages(scriptCharacters);
    scriptCharacters.forEach(character=>{
        if(character.id){
            ScriptGenerator.characterLookup.set(
                character.id,
                normalizeCharacter(character)
            );
        }
    });
}
function preloadCharacterImages(characters){
    characters.forEach(character=>{
        if(!character.image) return;

        const images = Array.isArray(character.image)
            ? character.image
            : [character.image];

        images.forEach(src=>{
            const img = new Image();
            img.src = src;
        });
    });
}
