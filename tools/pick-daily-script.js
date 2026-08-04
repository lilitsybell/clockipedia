const fs = require("fs");
const path = require("path");

const dataFolder =
    path.join(__dirname, "../data");

const indexPath =
    path.join(dataFolder, "index.json");

const outputPath =
    path.join(dataFolder, "daily-script.json");


// Load scripts
const scripts =
    JSON.parse(
        fs.readFileSync(
            indexPath,
            "utf8"
        )
    );


// Pick random script
const script =
    scripts[
        Math.floor(
            Math.random() *
            scripts.length
        )
    ];


// Create daily file
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
