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

for(const character of characterData){

    if(
        character.id &&
        character.name
    ){
        characterLookup.set(
            character.id,
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

        let id = null;

        // Official character stored as string
        if(typeof entry === "string"){
            id = entry;
        }

        // Homebrew character object
        else if(
            typeof entry === "object" &&
            entry.id &&
            entry.id !== "_meta"
        ){
            id = entry.id;
        }


        if(!id){
            return null;
        }


        // Use stored character name
        return (
            characterLookup.get(id) ||
            entry.name ||
            id
        );

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
