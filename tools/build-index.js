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


// Process every script

for (const scriptEntry of scriptsList) {

    const scriptPath = path.join(
        dataFolder,
        scriptEntry.file
    );

    let meta = {};

    try {

        const script = JSON.parse(
            fs.readFileSync(
                scriptPath,
                "utf8"
            )
        );


        const foundMeta = script.find(
            entry =>
                typeof entry === "object" &&
                entry.id === "_meta"
        );


        if(foundMeta){
            meta = foundMeta;
        }

    }
    catch(error){

        console.error(
            "Could not load:",
            scriptEntry.file
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
                meta.bootlegger ||
                meta.homebrew
            ),

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
