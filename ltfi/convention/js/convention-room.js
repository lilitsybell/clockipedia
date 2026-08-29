console.log(
    "convention-room.js loaded"
);


const BOOKING_API =
    "https://script.google.com/macros/s/AKfycbxsN8ESL2dW6EDROGQqv2-Z_glDrnZ6UUAtya9cdXui0RsNPTCr8vCVpJSmhKon9xCqhg/exec";


/* ==========================================
   Load Existing Bookings
========================================== */

async function loadBookings(){

    try{

        const response =
            await fetch(
                BOOKING_API +
                "?type=bookings"
            );


        if(!response.ok){

            throw new Error(
                "Booking request failed: " +
                response.status
            );

        }


        const data =
            await response.json();


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

    }
    catch(error){

        console.error(
            "Could not load bookings:",
            error
        );

    }

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

const confirmButton =
    document.getElementById(
        "confirm-booking-button"
    );

const paymentConfirmed =
    document.getElementById(
        "booking-payment-confirmed"
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
/* ==================================
   Confirm Booking
================================== */

confirmButton.addEventListener(
    "click",
    async () => {

        /* --------------------------
           Selected Bed
        -------------------------- */

        const selectedBed =
            document.querySelector(
                'input[name="booking-bed"]:checked'
            );


        if(!selectedBed){

            alert(
                "Please choose a bed."
            );

            return;

        }


        /* --------------------------
           Names
        -------------------------- */

        const names =
            Array.from(
                document.querySelectorAll(
                    ".booking-name-input"
                )
            )
            .map(
                input =>
                    input.value.trim()
            )
            .filter(
                name =>
                    name !== ""
            );


        if(names.length === 0){

            alert(
                "Please enter at least one name."
            );

            return;

        }


        /* --------------------------
           Payment Confirmation
        -------------------------- */

        if(
            !paymentConfirmed.checked
        ){

            alert(
                "Please confirm that you have paid or have a payment plan made."
            );

            return;

        }


        /* --------------------------
           Bed Information
        -------------------------- */

        const bedId =
            selectedBed.value;


        let room;
        let bed;
        let price;


        if(
            bedId ===
            "cannibal-cottage-sofa"
        ){

            room =
                "Cannibal Cottage";

            bed =
                "Queen Sofa Bed";

            price =
                479;

        }
        else if(
            bedId ===
            "hermit-hideout-queen"
        ){

            room =
                "Hermit Hideout";

            bed =
                "Queen Bed";

            price =
                522;

        }
        else{

            alert(
                "Something went wrong selecting this bed."
            );

            return;

        }


        /* --------------------------
           Disable Button
        -------------------------- */

        confirmButton.disabled =
            true;

        confirmButton.textContent =
            "Booking...";


        /* --------------------------
           Send Booking
        -------------------------- */

        try{

            const response =
                await fetch(
                    BOOKING_API,
                    {
                        method:
                            "POST",

                        body:
                            JSON.stringify(
                                {
                                    type:
                                        "booking",

                                    bedId:
                                        bedId,

                                    room:
                                        room,

                                    bed:
                                        bed,

                                    name:
    names.join(" & "),

                                    price:
                                        price,

                                    paymentConfirmed:
                                        true
                                }
                            )
                    }
                );


            const data =
                await response.json();


            console.log(
                "Booking response:",
                data
            );


            /* ----------------------
               Booking Failed
            ---------------------- */

            if(
                !data.success
            ){

                alert(
                    data.error ||
                    "This bed could not be booked."
                );

                loadBookings();

                return;

            }


            /* ----------------------
               Booking Successful
            ---------------------- */

            alert(
                "Your room has been booked!"
            );


            closeModal();


            loadBookings();

        }
        catch(error){

            console.error(
                "Booking failed:",
                error
            );


            alert(
                "Something went wrong while booking. Please try again."
            );

        }
        finally{

            confirmButton.disabled =
                false;

            confirmButton.textContent =
                "Confirm Booking";

        }

    }
);
    }
);
