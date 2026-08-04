console.log("script-generator.js updated 8/04/26 09:55");
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
    // Build character database
    buildCharacterLookup(loadedScript);
    // Render characters
    renderScriptCharacters(
        loadedScript
    );
}
document
    .getElementById("generateScriptButton")
    .addEventListener("click", generateScript);
