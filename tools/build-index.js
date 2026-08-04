const fs = require("fs");
const path = require("path");
const dataFolder = path.join(__dirname, "../data");
const scriptsFolder = path.join(dataFolder, "scripts");
const scriptsList = JSON.parse(
    fs.readFileSync(
        path.join(dataFolder, "scripts.json"),
        "utf8"
    )
);
const index = [];
for (const scriptEntry of scriptsList) {
    const filePath = path.join(
        dataFolder,
        scriptEntry.file
    );
    let meta = {};
    try {
        const script = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );
        const metadata = script.find(
            entry =>
                typeof entry === "object" &&
                entry.id === "_meta"
        );
        if(metadata){
            meta = metadata;
        }
    }
    catch(error){
        console.error(
            "Failed loading:",
            scriptEntry.file
        );
    }
index.push({
    file: scriptEntry.file,
    name:
        meta.name ||
        "Unknown Script",
    author:
        meta.author ||
        "Unknown",
    size:
        scriptEntry.size ||
        "full",
    homebrew:
        meta.bootlegger ||
        meta.homebrew ||
        false,
    tags:
        meta.tags ||
        [],
    logo:
        meta.logo ||
        null
});
}
fs.writeFileSync(
    path.join(dataFolder, "index.json"),
    JSON.stringify(index, null, 4)
);
console.log(
    `Generated index.json (${index.length} scripts)`
);
