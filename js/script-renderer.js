console.log(
    "script-renderer.js updated 8/04/26 10:29"
);
console.log(
    "script-renderer.js updated 8/04/26 10:29"
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
function renderScriptCharacters(script){
    const characters =
    extractScriptCharacters(script);
    const container =
        document.getElementById(
            "characterContainer"
        );
    container.innerHTML = "";
    const teams = [
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
