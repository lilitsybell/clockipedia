console.log(
    "script-renderer.js updated 8/04/26 11:45"
);
function normalizeTeam(team){
    if(!team) return "";
    team = team.toLowerCase();
    if(team === "townsfolk")
        return "townsfolk";
    if(team === "outsider")
        return "outsiders";
    if(team === "minion" || team === "minions")
        return "minions";
    if(team === "demon" || team === "demons")
        return "demons";
    if(team === "traveller" || team === "travellers")
        return "travellers";
    if(team === "loric")
        return "loric";
    if(team === "fabled")
        return "fabled";
    return team;
}
/* ======================================================
   Render Script Header
====================================================== */
function renderScriptHeader(script){
    const container =
        document.getElementById(
            "scriptHeader"
        );
    if(!container) return;
    const meta = script.meta;
    if(!meta) {
        console.warn("No script metadata found");
        return;
    }
    const title =
        document.getElementById("scriptTitle");
    const author =
        document.getElementById("scriptAuthor");
    const logo =
        document.getElementById("scriptLogo");
    const almanac =
        document.getElementById("scriptAlmanac");
    // Title
    if(title){
        title.textContent =
            meta.name || "Unknown Script";
    }
    // Author
    if(author){
        author.textContent =
            meta.author
            ? "by " + meta.author
            : "";
    }
    // Logo
    if(logo && meta.logo){
        logo.src = meta.logo;
        logo.style.display = "block";
    }
    // Almanac
    if(almanac){
        if(meta.almanac){
            almanac.href = meta.almanac;
            almanac.style.display = "inline-block";
        }
        else{
            almanac.style.display = "none";
        }
    }
    // Background
    if(meta.background){
        container.style.backgroundImage =
            `url("${meta.background}")`;
    }
}
    if(!meta) return;
    // Background
    if(meta.background){
        container.style.backgroundImage =
            `url("${meta.background}")`;
    }
    // Logo
    if(meta.logo){
        const logo =
            document.createElement("img");
        logo.src = meta.logo;
        logo.className = "script-logo";
        container.appendChild(logo);
    }
    // Title
    if(!meta.hideTitle){
        const title =
            document.createElement("h1");
        title.textContent =
            meta.name;
        container.appendChild(title);
    }
    // Author
    if(meta.author){
        const author =
            document.createElement("p");
        author.textContent =
            "Created by " + meta.author;
        author.className =
            "script-author";
        container.appendChild(author);
    }
    // Almanac
    if(meta.almanac){
        const link =
            document.createElement("a");
        link.href =
            meta.almanac;
        link.target =
            "_blank";
        link.textContent =
            "View Almanac";
        link.className =
            "script-almanac";
        container.appendChild(link);
    }
}
function renderScriptCharacters(script){
    const characters =
    extractScriptCharacters(script);
    characters.sort((a,b)=>{
    // Bootlegger always first
    if(a.id === "bootlegger") return -1;
    if(b.id === "bootlegger") return 1;
    return a.name.localeCompare(b.name);
});
    const container =
        document.getElementById(
            "characterContainer"
        );
    container.innerHTML = "";
const teams = [
    "loric",
    "fabled",
    "townsfolk",
    "outsiders",
    "minions",
    "demons"
];
    teams.forEach(team=>{
        const section =
            document.createElement("div");
        section.className =
            "team-section";
        const title =
            document.createElement("div");
        title.className =
            "team-title";
        title.textContent =
            team
            .charAt(0)
            .toUpperCase()
            +
            team.slice(1);
        section.appendChild(title);
        characters
            .filter(character=>{
                const id =
                    typeof character === "string"
                    ? character
                    : character.id;
                const data =
                    ScriptGenerator
                    .characterLookup
                    .get(id);
console.log(
    "Rendering:",
    id,
    data
);
        return data &&
       normalizeTeam(data.team) === team;
            })
            .forEach(character=>{
                const id =
                    typeof character === "string"
                    ? character
                    : character.id;
                const data =
                    ScriptGenerator
                    .characterLookup
                    .get(id);
                const card =
                    document.createElement("div");
                card.className =
                    "script-character";
                card.innerHTML = `
                    <img src="${data.image}">
                    <div>
                        <h3>${data.name}</h3>
                        <p>
                        ${data.ability}
                        </p>
                    </div>
                `;
                section.appendChild(card);
            });
        container.appendChild(section);
    });
}
