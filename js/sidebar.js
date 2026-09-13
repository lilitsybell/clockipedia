document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");

    sidebar.innerHTML = `
<a href="/index.html" class="logo">
    <img src="/images/clockipedia-logo.png" alt="Clockipedia">
</a>
<div class="search-box">

    <input
        type="text"
        id="searchBox"
        placeholder="Search for a character..."
        autocomplete="off"
    >

    <div
        id="searchResults"
        class="search-results">
    </div>

</div>
        <nav class="sidebar-nav">
<a href="/interaction-finder.html" class="nav-link"> Interactions </a>
<a href="/scripts.html" class="nav-link"> Scripts </a>
<a href="/characters.html" class="nav-link"> Characters </a>
<a href="/games.html" class="nav-link"> Games </a>
        </nav>
    `;
// Highlight current section
const currentPath =
    window.location.pathname
        .replace(/index\.html$/, "")
        .replace(/\/$/, "");


document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        const linkPath =
            new URL(link.href)
                .pathname
                .replace(/index\.html$/, "")
                .replace(/\/$/, "");


        let isActive =
            currentPath === linkPath;


// Character pages
if(
    linkPath === "/characters.html" &&
    currentPath === "/character.html"
){
    isActive = true;
}


        // Game pages
        if(
            linkPath === "/games.html" &&
            currentPath.startsWith("/games/")
        ){
            isActive = true;
        }


        if(isActive){
            link.classList.add("active");
        }

    });
    // Character dropdown
    const characterToggle = document.querySelector(".character-toggle");
    const characterSection = document.querySelector(".character-section");

if (characterToggle && characterSection) {

    characterToggle.addEventListener("click", () => {

        characterSection.classList.toggle("open");

    });

}

loadSearch();


});
