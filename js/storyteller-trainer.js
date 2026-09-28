console.log("storyteller-trainer.js loaded");


/* ==========================================
   Game Settings
========================================== */

const trainerPlayerCount = 12;


/* ==========================================
   Temporary Player Names
========================================== */

/*
   We'll replace these with your random
   name pool later.
*/

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

        const seat =
            createPlayerSeat(
                i
            );


        ring.appendChild(
            seat
        );

    }

}


/* ==========================================
   Create Player Seat
========================================== */

function createPlayerSeat(index){

    const seat =
        document.createElement(
            "div"
        );


    seat.className =
        "trainer-player";


    seat.dataset.seat =
        index;


    /*
       Seat 1 starts at the top.

       The remaining seats continue
       clockwise around the circle.
    */

    const angle =
        (360 / trainerPlayerCount) *
        index -
        90;


    seat.style.setProperty(
        "--seat-angle",
        `${angle}deg`
    );


    seat.innerHTML = `

        <div class="player-token">

            <div class="player-number">
                ${index + 1}
            </div>


            <div class="player-character">

                <span class="player-character-placeholder">
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


    return seat;

}
