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

            <a href="/interaction-finder.html" class="nav-link">
                Interactions
            </a>


            <a href="/script-generator.html" class="nav-link">
                Scripts
            </a>
            <div class="character-section">

                <div class="character-toggle">
                Characters
                <span class="arrow">▼</span>
                </div>


                <div class="character-dropdown">

                    <a href="/characters/townsfolk.html" class="nav-link sub-link">
                        Townsfolk
                    </a>

                    <a href="/characters/outsiders.html" class="nav-link sub-link">
                        Outsiders
                    </a>

                    <a href="/characters/minions.html" class="nav-link sub-link">
                        Minions
                    </a>

                    <a href="/characters/demons.html" class="nav-link sub-link">
                        Demons
                    </a>

                    <a href="/characters/travellers.html" class="nav-link sub-link">
                        Travellers
                    </a>

                    <a href="/characters/loric.html" class="nav-link sub-link">
                        Loric
                    </a>

                    <a href="/characters/fabled.html" class="nav-link sub-link">
                        Fabled
                    </a>

                </div>

            </div>



            <a href="/contact.html" class="nav-link">
                Contact
            </a>


        </nav>

    `;


// Highlight current page
const currentPage = window.location.pathname;
document.querySelectorAll(".nav-link").forEach(link => {
    if (new URL(link.href).pathname === currentPage) {
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
