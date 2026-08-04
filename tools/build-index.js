const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "../data");

const scriptsListPath = path.join(
    dataFolder,
    "scripts.json"
);

const outputPath = path.join(
    dataFolder,
    "index.json"
);


// Load scripts.json

const scriptsList = JSON.parse(
    fs.readFileSync(
        scriptsListPath,
        "utf8"
    )
);


const index = [];

const charactersPath = path.join(
    dataFolder,
    "characters.json"
);

const characterData = JSON.parse(
    fs.readFileSync(
        charactersPath,
        "utf8"
    )
);
const characterLookup = new Map();
// Handle official characters.json object
for(const [id, character] of Object.entries(characterData)){
    if(
        character &&
        character.name
    ){
        characterLookup.set(
            id,
            character.name
        );
    }
}
// Process every script

for (const scriptEntry of scriptsList) {

const scriptPath = scriptEntry.file.startsWith("data/")
    ? path.join(__dirname, "../", scriptEntry.file)
    : path.join(dataFolder, scriptEntry.file);
let characters = [];
let meta = {};
let hasHomebrew = false;

try {

        const script = JSON.parse(
            fs.readFileSync(
                scriptPath,
                "utf8"
            )
        );
characters = script
    .map(entry => {
        // Official character ID
        if(typeof entry === "string"){
            return (
                characterLookup.get(entry) ||
                entry
                    .replace(/_/g," ")
                    .replace(/\b\w/g,c=>c.toUpperCase())
            );
        }
        // Homebrew character object
        if(
            typeof entry === "object" &&
            entry.id &&
            entry.id !== "_meta"
        ){
            return entry.name || entry.id;
        }
        return null;
    })
    .filter(Boolean);
        const foundMeta = script.find(
            entry =>
                typeof entry === "object" &&
                entry.id === "_meta"
        );

for (const entry of script) {

    // Custom character object
    if (
        typeof entry === "object" &&
        entry.id &&
        entry.id !== "_meta"
    ) {
        hasHomebrew = true;
    }

    // Unknown character IDs
    if (
        typeof entry === "string"
    ) {
        // Optional: handled later if you load characters.json
    }

}


        if(foundMeta){
            meta = foundMeta;
        }

    }
catch(error){
    console.error(
        "Could not load:",
        scriptEntry.file,
        error
    );
}


    index.push({

        file:
            scriptEntry.file,

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
    Boolean(
        hasHomebrew ||
        meta.bootlegger ||
        meta.homebrew
    ),
characters: characters,
        tags:
            meta.tags ||
            [],

        logo:
            meta.logo ||
            null

    });

}


fs.writeFileSync(
    outputPath,
    JSON.stringify(
        index,
        null,
        4
    )
);


console.log(
    `Created index.json with ${index.length} scripts`
);
