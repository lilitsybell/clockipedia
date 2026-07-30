document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    const currentPage = window.location.pathname;

    sidebar.innerHTML = `

        <nav>

            <div class="search-box">
                <input 
                    type="text" 
                    id="characterSearch" 
                    placeholder="Search characters..."
                >
            </div>


            <a href="/index.html" class="nav-link">Home</a>


            <div class="nav-section">
                <div class="nav-title">Tools</div>

                <a href="/tools/interaction-finder.html" class="nav-link">
                    Interaction Finder
                </a>

                <a href="/tools/script-generator.html" class="nav-link">
                    Random Script Generator
                </a>

            </div>


            <div class="nav-section">
                <div class="nav-title">Characters</div>

                <a href="/characters/townsfolk.html" class="nav-link">
                    Townsfolk
                </a>

                <a href="/characters/outsiders.html" class="nav-link">
                    Outsiders
                </a>

                <a href="/characters/minions.html" class="nav-link">
                    Minions
                </a>

                <a href="/characters/demons.html" class="nav-link">
                    Demons
                </a>

                <a href="/characters/travellers.html" class="nav-link">
                    Travellers
                </a>

                <a href="/characters/loric.html" class="nav-link">
                    Loric
                </a>

                <a href="/characters/fabled.html" class="nav-link">
                    Fabled
                </a>

            </div>


            <div class="nav-section">

                <a href="/contact.html" class="nav-link">
                    Contact
                </a>

            </div>

        </nav>

    `;


    // Highlight current page

    document.querySelectorAll(".nav-link").forEach(link => {

        if (link.href.includes(currentPage)) {
            link.classList.add("active");
        }

    });

});
