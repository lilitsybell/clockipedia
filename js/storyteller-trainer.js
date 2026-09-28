console.log("storyteller-trainer.js loaded");


/* ==========================================
   Game Settings
========================================== */

const trainerPlayerCount = 12;


/* ==========================================
   Temporary Player Names
========================================== */

const trainerPlayerNames = [

    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
    "Player 5",
    "Player 6",
    "Player 7",
    "Player 8",
    "Player 9",
    "Player 10",
    "Player 11",
    "Player 12"

];


/* ==========================================
   Initialize
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        buildPlayerRing();

    }
);


/* ==========================================
   Build Player Ring
========================================== */

function buildPlayerRing(){

    const ring =
        document.querySelector(
            "#player-ring"
        );


    if(!ring){
        return;
    }


    ring.innerHTML = "";


    for(
        let i = 0;
        i < trainerPlayerCount;
        i++
    ){

        const player =
            createPlayerSeat(i);


        ring.appendChild(player);

    }

}


/* ==========================================
   Create Player Seat
========================================== */

function createPlayerSeat(index){

    const player =
        document.createElement(
            "div"
        );


    player.className =
        "trainer-player";


    player.dataset.seat =
        index;


    /*
       Player 1 starts at the top.

       Players continue clockwise.
    */

    const angle =
        (
            360 /
            trainerPlayerCount
        ) *
        index -
        90;


    player.style.setProperty(
        "--seat-angle",
        `${angle}deg`
    );


    player.innerHTML = `

        <div class="player-token">

            <div class="player-number">
                ${index + 1}
            </div>


            <div class="player-character">

                <span
                    class="player-character-placeholder"
                >
                    ?
                </span>

            </div>


            <div class="player-name">
                ${trainerPlayerNames[index]}
            </div>


            <div class="player-role">
                Unknown
            </div>

        </div>

    `;


    return player;

}
