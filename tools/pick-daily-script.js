const fs = require("fs");
const path = require("path");

const dataFolder =
    path.join(__dirname, "../data");

const indexPath =
    path.join(dataFolder, "index.json");

const outputPath =
    path.join(dataFolder, "daily-script.json");

const historyPath =
    path.join(dataFolder, "daily-history.json");


// Load scripts

const scripts =
    JSON.parse(
        fs.readFileSync(
            indexPath,
            "utf8"
        )
    );


// Load history

let history = [];

if(fs.existsSync(historyPath)){
    history =
        JSON.parse(
            fs.readFileSync(
                historyPath,
                "utf8"
            )
        );
}


// Remove recently used scripts

let availableScripts =
    scripts.filter(
        script =>
            !history.includes(
                script.file
            )
    );


// If every script was recently used,
// allow repeats

if(!availableScripts.length){
    availableScripts = scripts;
}


// Pick random script

const script =
    availableScripts[
        Math.floor(
            Math.random() *
            availableScripts.length
        )
    ];


// Update history

history.unshift(
    script.file
);


// Keep only last 100

history =
    history.slice(
        0,
        100
    );


// Save history

fs.writeFileSync(
    historyPath,
    JSON.stringify(
        history,
        null,
        4
    )
);


// Save today's script

const dailyScript = {

    file:
        script.file,

    name:
        script.name,

    author:
        script.author,

    logo:
        script.logo || null,

    date:
        new Date()
        .toISOString()
        .split("T")[0]

};


fs.writeFileSync(
    outputPath,
    JSON.stringify(
        dailyScript,
        null,
        4
    )
);


console.log(
    "Script of the Day:",
    script.name
);
