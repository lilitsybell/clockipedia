const fs = require("fs");
const path = require("path");

const scriptsPath = path.join(__dirname, "../data/scripts.json");
const outputPath = path.join(__dirname, "../data/index.json");

const scripts = JSON.parse(
    fs.readFileSync(scriptsPath, "utf8")
);

const index = scripts.map(script => ({
    id: script.id,
    name: script.name,
    author: script.author || "Unknown",
    file: script.file,
    tags: script.tags || [],
    homebrew: script.homebrew || false,
    size: script.size || "Full"
}));

fs.writeFileSync(
    outputPath,
    JSON.stringify(index, null, 4)
);

console.log(
    `Generated index.json with ${index.length} scripts`
);
