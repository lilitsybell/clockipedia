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
    const title =
        document.getElementById("scriptTitle");
    const author =
        document.getElementById("scriptAuthor");
    const almanac =
        document.getElementById("scriptAlmanac");
    const meta =
    script.meta ||
    script.find(
        entry =>
            typeof entry === "object" &&
            entry.id === "_meta"
    );
    if(!meta){
        console.warn("No metadata found");
        return;
    }
    if(title){
        title.textContent =
            meta.name || "Unknown Script";
    }
    if(author){
        author.textContent =
            meta.author
            ? "by " + meta.author
            : "";
    }
if(almanac){
    if(meta.almanac){
        almanac.href = meta.almanac;
        almanac.style.display = "inline-block";
    }
    else{
        almanac.removeAttribute("href");
        almanac.style.display = "none";
    }
}
    const header =
        document.getElementById("scriptHeader");
}
function renderScriptCharacters(script){
    const characters =
    extractScriptCharacters(script);
// Keep script order
// Move Bootlegger to the front if present
const bootleggerIndex =
    characters.findIndex(
        c => c.id === "bootlegger"
    );
if(bootleggerIndex > -1){
    const bootlegger =
        characters.splice(
            bootleggerIndex,
            1
        )[0];
    characters.unshift(
        bootlegger
    );
}
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
