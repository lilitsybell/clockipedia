console.log("convention-rooms.js loaded");


/* ==========================================
   Configuration
========================================== */

const BOOKING_API =
    "https://script.google.com/macros/s/AKfycbxsN8ESL2dW6EDROGQqv2-Z_glDrnZ6UUAtya9cdXui0RsNPTCr8vCVpJSmhKon9xCqhg/exec";


/* ==========================================
   Initialize
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRoomTabs();
        setAvailabilityLoading();
        loadRoomAvailability();

    }
);


/* ==========================================
   Tabs
========================================== */

function setupRoomTabs(){

    const tabs =
        document.querySelectorAll(
            ".rooms-tab"
        );

    const panels =
        document.querySelectorAll(
            ".rooms-tab-panel"
        );


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                tabs.forEach(otherTab => {

                    const isActive =
                        otherTab === tab;


                    otherTab.classList.toggle(
                        "active",
                        isActive
                    );


                    otherTab.setAttribute(
                        "aria-selected",
                        String(isActive)
                    );

                });


                panels.forEach(panel => {

                    const isActive =
                        panel.dataset.panel === target;


                    panel.classList.toggle(
                        "active",
                        isActive
                    );


                    panel.hidden =
                        !isActive;

                });

            }
        );

    });

}


/* ==========================================
   Loading State
========================================== */

function setAvailabilityLoading(){

    const statuses =
        document.querySelectorAll(
            ".room-list-status"
        );


    statuses.forEach(status => {

        status.textContent =
            "Checking availability...";

    });

}


/* ==========================================
   Load Bedroom Availability
========================================== */

async function loadRoomAvailability(){

    try{

        const url =
            BOOKING_API +
            "?type=bookings";


        console.log(
            "Loading room availability from:",
            url
        );


        const response =
            await fetch(
                url,
                {
                    method:
                        "GET"
                }
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
            "Room availability loaded:",
            data
        );


        if(
            !data ||
            data.success !== true
        ){

            throw new Error(
                "Unexpected booking response"
            );

        }


        updateRoomAvailability(
            data.bookings || {}
        );

    }
    catch(error){

        console.error(
            "Could not load room availability:",
            error
        );


        showAvailabilityError();

    }

}


/* ==========================================
   Availability Error
========================================== */

function showAvailabilityError(){

    const statuses =
        document.querySelectorAll(
            ".room-list-status"
        );


    statuses.forEach(status => {

        status.textContent =
            "View Room";

    });

}


/* ==========================================
   Update Bedroom Cards
========================================== */

function updateRoomAvailability(
    bookingsObject
){

    const bookings =
        Object.values(
            bookingsObject
        );


    const cards =
        document.querySelectorAll(
            '.room-list-card[data-bookable="true"]'
        );


    cards.forEach(card => {

        updateRoomCard(
            card,
            bookings
        );

    });


    sortBedroomCards();

}


/* ==========================================
   Update Individual Room
========================================== */

function updateRoomCard(
    card,
    bookings
){

    const roomNames =
        getRoomNames(
            card
        );


    const totalBeds =
        getBedCount(
            card
        );


    const bookedBeds =
        getBookedBedCount(
            roomNames,
            bookings
        );


    const availableBeds =
        Math.max(
            0,
            totalBeds - bookedBeds
        );


    const status =
        card.querySelector(
            ".room-list-status"
        );


    if(!status){
        return;
    }


    card.classList.remove(
        "fully-booked"
    );


    /* --------------------------------------
       Fully Booked
    -------------------------------------- */

    if(
        availableBeds === 0
    ){

        card.classList.add(
            "fully-booked"
        );


        status.textContent =
            "Fully Booked";


        return;

    }


    /* --------------------------------------
       One Bed
    -------------------------------------- */

    if(
        availableBeds === 1
    ){

        status.textContent =
            "1 Bed Available";


        return;

    }


    /* --------------------------------------
       Multiple Beds
    -------------------------------------- */

    status.textContent =
        availableBeds +
        " Beds Available";

}


/* ==========================================
   Get Room Names
========================================== */

function getRoomNames(
    card
){

    const value =
        card.dataset.roomNames || "";


    return value
        .split("|")
        .map(
            name =>
                name.trim()
        )
        .filter(Boolean);

}


/* ==========================================
   Get Bed Count
========================================== */

function getBedCount(
    card
){

    const bedCount =
        Number(
            card.dataset.bedCount
        );


    if(
        Number.isNaN(
            bedCount
        )
    ){

        return 0;

    }


    return bedCount;

}


/* ==========================================
   Count Booked Beds
========================================== */

function getBookedBedCount(
    roomNames,
    bookings
){

    return bookings.filter(
        booking => {

            if(
                !booking ||
                !booking.room
            ){
                return false;
            }


            return roomNames.includes(
                booking.room.trim()
            );

        }
    ).length;

}


/* ==========================================
   Available Rooms First
========================================== */

function sortBedroomCards(){

    const grid =
        document.querySelector(
            "#bedroom-grid"
        );


    if(!grid){
        return;
    }


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".room-list-card"
            )
        );


    cards.sort(
        (a, b) => {

            const aBooked =
                a.classList.contains(
                    "fully-booked"
                );


            const bBooked =
                b.classList.contains(
                    "fully-booked"
                );


            /* ----------------------------------
               Same Availability
            ---------------------------------- */

            if(
                aBooked === bBooked
            ){

                return 0;

            }


            /* ----------------------------------
               Fully Booked Goes Last
            ---------------------------------- */

            return aBooked
                ? 1
                : -1;

        }
    );


    cards.forEach(card => {

        grid.appendChild(
            card
        );

    });

}
