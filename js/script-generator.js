console.log("script-generator.js updated 8/04/26 11:46");
async function initializeGenerator() {
    try {
        await loadOfficialCharacters();
        console.log(ScriptGenerator.officialCharacters);
        await loadScriptIndex();
        console.log("Generator ready.");
    }
    catch (error) {
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
    ScriptGenerator.characterFilter
){
    if(
        !script.characters ||
        !script.characters.some(character =>
            character
            .toLowerCase()
            .includes(
                ScriptGenerator.characterFilter
            )
        )
    ){
        return false;
    }
}
        // Homebrew filter
        if(
            ScriptGenerator.homebrewFilter === "Yes" &&
            !script.homebrew
        ){
            return false;
        }
        if(
            ScriptGenerator.homebrewFilter === "No" &&
            script.homebrew
        ){
            return false;
        }
        // Size filter
        if(
            ScriptGenerator.sizeFilter !== "Any" &&
            script.size !== ScriptGenerator.sizeFilter.toLowerCase()
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
const script =
    availableScripts[
        Math.floor(
            Math.random() *
            availableScripts.length
        )
    ];
    console.log("Selected script:", script);
    // Load BOTC JSON
    const loadedScript =
        await loadScript(script.file);
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
        const original =
            button.textContent;
        button.textContent =
            "✓ Copied!";
        setTimeout(()=>{
            button.textContent =
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
if(characterSearch){
    characterSearch.addEventListener(
        "input",
        ()=>{
            ScriptGenerator.characterFilter =
                characterSearch.value
                .trim()
                .toLowerCase();
        }
    );
}
const homebrewButton =
    document.getElementById("homebrewButton");
if(homebrewButton){
    homebrewButton.addEventListener(
        "click",
        ()=>{
            const states = [
                "Maybe",
                "No",
                "Yes"
            ];
            let index =
                states.indexOf(
                    ScriptGenerator.homebrewFilter
                );
            index++;
            if(index >= states.length){
                index = 0;
            }
            ScriptGenerator.homebrewFilter =
                states[index];
            homebrewButton.textContent =
                ScriptGenerator.homebrewFilter;
        }
    );
}
const scriptSizeButton =
    document.getElementById("scriptSizeButton");
if(scriptSizeButton){
    scriptSizeButton.addEventListener(
        "click",
        ()=>{
            const states = [
                "Any",
                "Full",
                "Teensy"
            ];
            let index =
                states.indexOf(
                    ScriptGenerator.sizeFilter
                );
            index++;
            if(index >= states.length){
                index = 0;
            }
            ScriptGenerator.sizeFilter =
                states[index];
            scriptSizeButton.textContent =
                ScriptGenerator.sizeFilter;
        }
    );
}
