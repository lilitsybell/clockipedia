document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");

    sidebar.innerHTML = `

        <div class="logo">
            <img src="https://betterbotcwiki.weebly.com/uploads/1/4/0/2/140233688/better-botc-wiki-by-bell.png">
        </div>


        <div class="search-box">
            <input 
                type="text"
                placeholder="Search for a character..."
            >
        </div>


        <nav class="sidebar-nav">


            <a href="/index.html" class="nav-link">
                Home
            </a>


            <a href="/tools/interaction-finder.html" class="nav-link">
                Interaction Finder
            </a>


            <a href="/tools/script-generator.html" class="nav-link">
                Random Script Generator
            </a>



            <div class="character-section">

                <div class="nav-link character-toggle">
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

document.querySelectorAll("a.nav-link").forEach(link => {

    if (link.href && link.href.includes(currentPage)) {
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


});
