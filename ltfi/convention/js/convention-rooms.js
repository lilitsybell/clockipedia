console.log("convention-rooms.js loaded");


const BOOKING_API =
    "https://script.google.com/macros/s/AKfycbxsN8ESL2dW6EDROGQqv2-Z_glDrnZ6UUAtya9cdXui0RsNPTCr8vCVpJSmhKon9xCqhg/exec";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRoomTabs();
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

                    const active =
                        otherTab === tab;

                    otherTab.classList.toggle(
                        "active",
                        active
                    );

                    otherTab.setAttribute(
                        "aria-selected",
                        active
                    );

                });


                panels.forEach(panel => {

                    const active =
                        panel.dataset.panel === target;

                    panel.classList.toggle(
                        "active",
                        active
                    );

                    panel.hidden =
                        !active;

                });

            }
        );

    });

}


/* ==========================================
   Load Bedroom Availability
========================================== */

async function loadRoomAvailability(){

    try{

        const url =
            BOOKING_API +
            "?type=bookings" +
            "&t=" +
            Date.now();


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    cache: "no-store"
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


        document
            .querySelectorAll(
                ".room-list-status"
            )
            .forEach(status => {

                status.textContent =
                    "View room";

            });

    }

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

        const roomNames =
            card.dataset.roomNames
                .split("|")
                .map(
                    name =>
                        name.trim()
                );


        const totalBeds =
            Number(
                card.dataset.bedCount
            );


        const bookedBeds =
            bookings.filter(
                booking =>
                    roomNames.includes(
                        booking.room
                    )
            ).length;


        const availableBeds =
            Math.max(
                0,
                totalBeds - bookedBeds
            );


        const status =
            card.querySelector(
                ".room-list-status"
            );


        card.classList.remove(
            "fully-booked"
        );


        if(
            availableBeds === 0
        ){

            card.classList.add(
                "fully-booked"
            );

            status.textContent =
                "Fully Booked";

        }
        else if(
            availableBeds === 1
        ){

            status.textContent =
                "1 Bed Available";

        }
        else{

            status.textContent =
                availableBeds +
                " Beds Available";

        }

    });


    sortBedroomCards();

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


            if(
                aBooked === bBooked
            ){
                return 0;
            }


            return aBooked
                ? 1
                : -1;

        }
    );


    cards.forEach(
        card =>
            grid.appendChild(card)
    );

}
