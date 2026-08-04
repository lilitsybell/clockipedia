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
    ScriptGenerator.filters.character
){
    if(
        !script.characters ||
        !script.characters.some(character =>
            character
            .toLowerCase()
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
if(characterSearch){
    characterSearch.addEventListener(
        "input",
        ()=>{
            ScriptGenerator.filters.character =
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
