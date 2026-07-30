document.addEventListener("DOMContentLoaded", () => {

const sidebar = document.getElementById("sidebar");

sidebar.innerHTML = `

<div class="logo">

<img src="/images/logo.png">

</div>


<div class="search-box">

<input 
type="text"
placeholder="Search for a character..."
>

</div>


<nav>


<a href="/index.html">
Home
</a>


<h3>Tools</h3>

<a href="/tools/interaction-finder.html">
Interaction Finder
</a>

<a href="/tools/script-generator.html">
Random Script Generator
</a>


<h3>Characters</h3>

<a href="/characters/townsfolk.html">
Townsfolk
</a>

<a href="/characters/outsiders.html">
Outsiders
</a>

<a href="/characters/minions.html">
Minions
</a>

<a href="/characters/demons.html">
Demons
</a>

<a href="/characters/travellers.html">
Travellers
</a>

<a href="/characters/loric.html">
Loric
</a>

<a href="/characters/fabled.html">
Fabled
</a>


<h3>Other</h3>

<a href="/contact.html">
Contact
</a>


</nav>

`;

});

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
