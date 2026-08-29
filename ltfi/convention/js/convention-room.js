console.log(
    "convention-room.js loaded"
);

const BOOKING_API =
    "https://script.google.com/macros/s/AKfycbxsN8ESL2dW6EDROGQqv2-Z_glDrnZ6UUAtya9cdXui0RsNPTCr8vCVpJSmhKon9xCqhg/exec";


/* ==========================================
   Load Existing Bookings
========================================== */

function loadBookings(){

    const callbackName =
        "receiveRoomBookings_" +
        Date.now();


    window[callbackName] =
        function(data){

            console.log(
                "Bookings loaded:",
                data
            );


            if(
                data &&
                data.success
            ){

                updateBookedBeds(
                    data.bookings || {}
                );

            }


            delete window[
                callbackName
            ];

            script.remove();

        };


    const script =
        document.createElement(
            "script"
        );


    script.src =
        BOOKING_API +
        "?type=bookings" +
        "&callback=" +
        callbackName;


    document.body.appendChild(
        script
    );

}


/* ==========================================
   Update Beds
========================================== */

function updateBookedBeds(
    bookings
){

    document
        .querySelectorAll(
            ".booking-bed-card"
        )
        .forEach(
            card => {

                const bedId =
                    card.dataset.bedId;


                const booking =
                    bookings[
                        bedId
                    ];


                const occupant =
                    card.querySelector(
                        ".booking-bed-occupant strong"
                    );


                if(!occupant){
                    return;
                }


                if(booking){

                    occupant.textContent =
                        booking.names.join(
                            " & "
                        );

                    card.classList.add(
                        "booked"
                    );

                }
                else{

                    occupant.textContent =
                        "Empty";

                    card.classList.remove(
                        "booked"
                    );

                }

            }
        );

}


/* ==========================================
   Start
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadBookings();

    }
);
