document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    console.log(sidebar);

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


<nav>

<div class="nav-section">

<a href="/index.html" class="nav-link">
Home
</a>

</div>


<div class="nav-section">

<div class="nav-title">
Tools
</div>

<a href="/tools/interaction-finder.html" class="nav-link">
Interaction Finder
</a>

<a href="/tools/script-generator.html" class="nav-link">
Random Script Generator
</a>

</div>


<div class="nav-section">

<div class="nav-title">
Characters
</div>

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

<div class="nav-title">
Other
</div>

<a href="/contact.html" class="nav-link">
Contact
</a>

</div>


</nav>

`;


    // Highlight current page

    const currentPage = window.location.pathname;

    document.querySelectorAll(".nav-link").forEach(link => {

        if (link.pathname === currentPage) {
            link.classList.add("active");
        }

    });

});
