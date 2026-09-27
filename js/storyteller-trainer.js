console.log("storyteller-trainer.js loaded");


/* ==========================================
   Temporary Game Settings
========================================== */

const trainerPlayerCount = 12;


/* ==========================================
   Initialize
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    buildPlayerRing();

});


/* ==========================================
   Build Player Ring
========================================== */

function buildPlayerRing(){

    const ring =
        document.querySelector("#player-ring");

    if(!ring) return;

    ring.innerHTML = "";


    for(
        let i = 0;
        i < trainerPlayerCount;
        i++
    ){

        const player =
            document.createElement("div");

        player.className = "trainer-player";


        /* Start at the top of the circle */

        const angle =
            (360 / trainerPlayerCount) * i - 90;


        player.style.setProperty(
            "--player-angle",
            `${angle}deg`
        );


        player.innerHTML = `
            <div class="trainer-player-avatar">
                ${i + 1}
            </div>

            <div class="trainer-player-name">
                Player ${i + 1}
            </div>
        `;


        ring.appendChild(player);

    }

}
