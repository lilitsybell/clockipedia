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
            <a href="/scripts.html" class="nav-link">
                Scripts
            </a>
            <a href="/characters.html" class="nav-link">
                Characters
            </a>
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
