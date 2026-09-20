document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");

sidebar.innerHTML = `

<div class="mobile-sidebar-header">

    <a
        href="/index.html"
        class="mobile-logo"
    >
        <img
            src="/images/clockipedia-logo.png"
            alt="Clockipedia"
        >
    </a>

    <button
        class="mobile-menu-toggle"
        type="button"
        aria-label="Open navigation"
        aria-expanded="false"
    >
        <span></span>
        <span></span>
        <span></span>
    </button>

</div>


<div class="sidebar-content">

    <a
        href="/index.html"
        class="logo"
    >
        <img
            src="/images/clockipedia-logo.png"
            alt="Clockipedia"
        >
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
            class="search-results"
        ></div>

    </div>


    <nav class="sidebar-nav">

        <a
            href="/interaction-finder.html"
            class="nav-link"
        >
            Interactions
        </a>

        <a
            href="/scripts.html"
            class="nav-link"
        >
            Scripts
        </a>

        <a
            href="/characters.html"
            class="nav-link"
        >
            Characters
        </a>

        <a
            href="/games.html"
            class="nav-link"
        >
            Games
        </a>

    </nav>

</div>
`;
    const mobileMenuToggle =
    sidebar.querySelector(
        ".mobile-menu-toggle"
    );


if(mobileMenuToggle){

    mobileMenuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                sidebar.classList.toggle(
                    "mobile-open"
                );

            mobileMenuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

            mobileMenuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );

        }
    );

}
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
