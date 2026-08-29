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
   Start Page
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ==================================
           Load Existing Bookings
        ================================== */

        loadBookings();


        /* ==================================
           Elements
        ================================== */

        const modal =
            document.getElementById(
                "booking-modal"
            );

        const openButton =
            document.getElementById(
                "open-booking-button"
            );

        const closeButton =
            document.getElementById(
                "close-booking-modal"
            );

        const backdrop =
            modal.querySelector(
                ".booking-modal-backdrop"
            );

        const bedOptions =
            document.querySelectorAll(
                'input[name="booking-bed"]'
            );

        const summaryBed =
            document.getElementById(
                "booking-summary-bed"
            );

        const summaryPrice =
            document.getElementById(
                "booking-summary-price"
            );

        const addNameButton =
            document.getElementById(
                "add-booking-name"
            );

        const nameList =
            document.getElementById(
                "booking-name-list"
            );


        /* ==================================
           Open Modal
        ================================== */

        function openModal(){

            modal.classList.add(
                "open"
            );

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow =
                "hidden";

        }


        /* ==================================
           Close Modal
        ================================== */

        function closeModal(){

            modal.classList.remove(
                "open"
            );

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.style.overflow =
                "";

        }


        openButton.addEventListener(
            "click",
            openModal
        );


        closeButton.addEventListener(
            "click",
            closeModal
        );


        backdrop.addEventListener(
            "click",
            closeModal
        );


        document.addEventListener(
            "keydown",
            event => {

                if(
                    event.key ===
                    "Escape"
                ){

                    closeModal();

                }

            }
        );


        /* ==================================
           Bed Selection
        ================================== */

        bedOptions.forEach(
            option => {

                option.addEventListener(
                    "change",
                    () => {

                        const label =
                            option.closest(
                                ".booking-bed-option"
                            );


                        const bedName =
                            label
                                .querySelector(
                                    ".booking-bed-option-info strong"
                                )
                                .textContent
                                .trim();


                        const roomName =
                            label
                                .querySelector(
                                    ".booking-bed-option-info small"
                                )
                                .textContent
                                .trim();


                        const price =
                            label
                                .querySelector(
                                    ".booking-bed-option-price"
                                )
                                .textContent
                                .trim();


                        summaryBed.textContent =
                            bedName +
                            " — " +
                            roomName;


                        summaryPrice.textContent =
                            price;

                    }
                );

            }
        );


        /* ==================================
           Add Another Person
        ================================== */

        addNameButton.addEventListener(
            "click",
            () => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "booking-name-row";


                const input =
                    document.createElement(
                        "input"
                    );


                input.type =
                    "text";

                input.className =
                    "booking-name-input";

                input.placeholder =
                    "Name";


                const removeButton =
                    document.createElement(
                        "button"
                    );


                removeButton.type =
                    "button";

                removeButton.className =
                    "booking-remove-name";

                removeButton.textContent =
                    "Remove";


                removeButton.addEventListener(
                    "click",
                    () => {

                        row.remove();

                    }
                );


                row.appendChild(
                    input
                );

                row.appendChild(
                    removeButton
                );


                nameList.appendChild(
                    row
                );


                input.focus();

            }
        );

    }
);
