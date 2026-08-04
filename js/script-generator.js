console.log("script-generator.js updated 8/04/26 09:55");
async function initializeGenerator() {
    try {
        await loadOfficialCharacters();
        console.log(data);
        await loadScriptIndex();
        console.log("Generator ready.");
    }
    catch (error) {
        console.error(error);
    }
}
initializeGenerator();
