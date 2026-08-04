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
    const script =
        ScriptGenerator.scripts[
            Math.floor(
                Math.random() *
                ScriptGenerator.scripts.length
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
