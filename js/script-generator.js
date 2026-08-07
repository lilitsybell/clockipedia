console.log("script-generator.js updated 8/04/26 18:57");
function getScriptSlug(script){
    return script.file
        .replace(/^scripts\//, "")
        .replace(/\.json$/, "");
}
async function initializeGenerator() {
    try {
        await loadOfficialCharacters();
        console.log(
            ScriptGenerator.officialCharacters
        );
        await loadScriptIndex();
        const params =
    new URLSearchParams(window.location.search);
const scriptSlug =
    params.get("script");
let indexScript;
if(scriptSlug){
    indexScript =
        ScriptGenerator.scripts.find(
            script =>
                getScriptSlug(script) === scriptSlug
        );
}
if(!indexScript){
    const daily =
        await loadDailyScript();
    indexScript =
        ScriptGenerator.scripts.find(
            script =>
                script.file === daily.file
        );
}
if(!indexScript){
    throw new Error(
        "Script not found."
    );
}
const script =
    await loadScript(indexScript.file);
indexScript.isDaily =
    !scriptSlug;
applyScriptIndexData(
    script,
    indexScript
);
ScriptGenerator.currentScript =
    script;
updateRecentScripts(indexScript);
buildCharacterLookup(script);
renderScriptHeader(script);
renderScriptCharacters(script);
    }
    catch(error){
        console.error(error);
    }
}
initializeGenerator();
async function generateScript() {
    if (!ScriptGenerator.scripts.length) {
        console.error("No scripts loaded");
        return;
    }
    // Pick random script
const availableScripts =
    ScriptGenerator.scripts.filter(script=>{
        // Character filter
if(
    ScriptGenerator.filters.character
){
    if(
        !script.characters ||
        !script.characters.some(character =>
character
.toLowerCase()
.replace(/_/g," ")
.includes(
    ScriptGenerator.filters.character
)
        )
    ){
        return false;
    }
}
        // Homebrew filter
if(
    ScriptGenerator.filters.homebrew === "yes" &&
    !script.homebrew
){
            return false;
        }
if(
    ScriptGenerator.filters.homebrew === "no" &&
    script.homebrew
){
            return false;
        }
        // Size filter
if(
    ScriptGenerator.filters.size !== "any" &&
    script.size !== ScriptGenerator.filters.size
){
            return false;
        }
        return true;
    });
if(!availableScripts.length){
    console.warn(
        "No scripts match filters"
    );
    return;
}
let possibleScripts =
    availableScripts.filter(
        script =>
            !ScriptGenerator.recentScripts.includes(
                script.file
            )
    );
// If every script has been recently seen,
// allow repeats
if(!possibleScripts.length){
    possibleScripts = availableScripts;
}
const script =
    possibleScripts[
        Math.floor(
            Math.random() *
            possibleScripts.length
        )
    ];
    console.log("Selected script:", script);
    updateRecentScripts(script);
    // Load BOTC JSON
const loadedScript =
    await loadScript(script.file);
applyScriptIndexData(
    loadedScript,
    script
);
    ScriptGenerator.currentScript = loadedScript;
    // Build character database
    buildCharacterLookup(loadedScript);
// Render characters
renderScriptHeader(loadedScript);
renderScriptCharacters(loadedScript);
}
document
    .getElementById("generateScriptButton")
    .addEventListener("click", generateScript);
document
    .getElementById("copyJsonButton")
    .addEventListener("click", copyCurrentScript);
async function copyCurrentScript(){
    if(!ScriptGenerator.currentScript){
        return;
    }
    const json = JSON.stringify(
        ScriptGenerator.currentScript,
        null,
        4
    );
    try{
        await navigator.clipboard.writeText(json);
const button =
    document.getElementById(
        "copyJsonButton"
    );
const img =
    button.querySelector("img");
const original =
    img.src;
img.src =
    "/images/check.png";
setTimeout(()=>{
    img.src =
        original;
},2000);
    }
    catch(error){
        console.error(
            "Copy failed:",
            error
        );
    }
}
const downloadButton =
    document.getElementById("downloadJsonButton");
if(downloadButton){
    downloadButton.addEventListener(
        "click",
        downloadCurrentScript
    );
}
function downloadCurrentScript(){
    if(!ScriptGenerator.currentScript){
        return;
    }
    const json =
        JSON.stringify(
            ScriptGenerator.currentScript,
            null,
            4
        );
    const blob =
        new Blob(
            [json],
            {
                type:"application/json"
            }
        );
    const url =
        URL.createObjectURL(blob);
    const link =
        document.createElement("a");
    link.href = url;
    // Use script name if available
    const meta =
        ScriptGenerator.currentScript.meta;
    const filename =
        meta?.name
        ? meta.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g,"-")
            + ".json"
        : "script.json";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
const characterSearch =
    document.getElementById("characterSearch");
const clearCharacterSearch =
    document.getElementById("clearCharacterSearch");
const characterSearchResults =
    document.getElementById("characterSearchResults");
if(characterSearch){
    characterSearch.addEventListener(
        "input",
        ()=>{
            const value =
                characterSearch.value
                .trim()
                .toLowerCase();
            ScriptGenerator.filters.character =
                value;
            characterSearchResults.innerHTML="";
            if(!value){
                characterSearchResults.style.display="none";
                return;
            }
            const matches =
                [...ScriptGenerator.officialCharacters.values()]
                .filter(character =>
                    character.name
                    .toLowerCase()
                    .includes(value)
                )
                .slice(0,8);
            if(!matches.length){
                characterSearchResults.style.display="none";
                return;
            }
            matches.forEach(character=>{
                const option =
                    document.createElement("div");
                option.className =
                    "character-search-option";
                option.innerHTML = `
                    <img src="${character.image}">
                    <span>${character.name}</span>
                `;
                option.addEventListener(
                    "click",
                    ()=>{
characterSearch.value =
    character.name;
ScriptGenerator.filters.character =
    character.name
    .toLowerCase();
if(clearCharacterSearch){
    clearCharacterSearch.style.display =
        "flex";
}
characterSearchResults.style.display="none";
                    }
                );
                characterSearchResults.appendChild(option);
            });
            characterSearchResults.style.display="block";
        }
    );
    document.addEventListener(
        "click",
        e=>{
            if(
                !characterSearch.contains(e.target) &&
                !characterSearchResults.contains(e.target)
            ){
                characterSearchResults.style.display="none";
            }
        }
    );
}
const homebrewButton =
    document.getElementById("homebrewButton");

if(homebrewButton){
    homebrewButton.addEventListener(
        "click",
        ()=>{
            const options = [
                "maybe",
                "no",
                "yes"
            ];

            let index =
                options.indexOf(
                    ScriptGenerator.filters.homebrew
                );

            index =
                (index + 1) %
                options.length;

            ScriptGenerator.filters.homebrew =
                options[index];

            homebrewButton.textContent =
                ScriptGenerator.filters.homebrew
                .charAt(0)
                .toUpperCase()
                +
                ScriptGenerator.filters.homebrew
                .slice(1);
        }
    );
}

if(clearCharacterSearch){

    clearCharacterSearch.addEventListener(
        "click",
        ()=>{

            characterSearch.value = "";

            ScriptGenerator.filters.character =
                null;

            clearCharacterSearch.style.display =
                "none";

        }
    );

}
const scriptSizeButton =
    document.getElementById("scriptSizeButton");

if(scriptSizeButton){
    scriptSizeButton.addEventListener(
        "click",
        ()=>{
            const options = [
                "any",
                "full",
                "teensy"
            ];

            let index =
                options.indexOf(
                    ScriptGenerator.filters.size
                );

            index =
                (index + 1) %
                options.length;

            ScriptGenerator.filters.size =
                options[index];

            scriptSizeButton.textContent =
                ScriptGenerator.filters.size
                .charAt(0)
                .toUpperCase()
                +
                ScriptGenerator.filters.size
                .slice(1);
        }
    );
}
function applyScriptIndexData(
    loadedScript,
    indexScript
){
    loadedScript.size =
        indexScript.size;
    loadedScript.homebrew =
        indexScript.homebrew;
    loadedScript.logo =
        indexScript.logo;
    loadedScript.isDaily =
        Boolean(indexScript.isDaily);
}
