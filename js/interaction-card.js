console.log("interactions Updated 8/03/26 22:55");
function getCharacters(text){
    const matches=text.match(/\[(.*?)\]/g);
    if(!matches) return [];
    return matches.map(match=>
        match.slice(1,-1)
    );
}
