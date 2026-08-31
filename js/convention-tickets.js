console.log(
    "convention-tickets.js loaded"
);


const TICKET_API =
    "https://script.google.com/macros/s/AKfycbxsN8ESL2dW6EDROGQqv2-Z_glDrnZ6UUAtya9cdXui0RsNPTCr8vCVpJSmhKon9xCqhg/exec";


const TICKET_PRICE =
    150;


/* ==========================================
   Start Page
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupTicketForm();

        loadTicketAttendees();

    }
);


/* ==========================================
   Setup Ticket Form
========================================== */

function setupTicketForm(){

    const addNameButton =
        document.getElementById(
            "add-ticket-name"
        );

    const purchaseButton =
        document.getElementById(
            "purchase-ticket-button"
        );


    if(addNameButton){

        addNameButton.addEventListener(
            "click",
            addTicketName
        );

    }


    if(purchaseButton){

        purchaseButton.addEventListener(
            "click",
            purchaseTickets
        );

    }


    updateTicketTotal();

}


/* ==========================================
   Add Another Person
========================================== */

function addTicketName(){

    const nameList =
        document.getElementById(
            "ticket-name-list"
        );


    if(!nameList){
        return;
    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "ticket-name-row";


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "text";

    input.className =
        "ticket-name-input";

    input.placeholder =
        "Name";


    const removeButton =
        document.createElement(
            "button"
        );


    removeButton.type =
        "button";

    removeButton.className =
        "ticket-remove-name";

    removeButton.textContent =
        "Remove";


    removeButton.addEventListener(
        "click",
        () => {

            row.remove();

            updateTicketTotal();

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


    updateTicketTotal();


    input.focus();

}


/* ==========================================
   Ticket Count / Total
========================================== */

function updateTicketTotal(){

    const rows =
        document.querySelectorAll(
            ".ticket-name-row"
        );


    const ticketCount =
        Math.max(
            1,
            rows.length
        );


    const total =
        ticketCount *
        TICKET_PRICE;


    const countElement =
        document.getElementById(
            "ticket-count"
        );


    const totalElement =
        document.getElementById(
            "ticket-total"
        );


    if(countElement){

        countElement.textContent =
            ticketCount;

    }


    if(totalElement){

        totalElement.textContent =
            "$" +
            total.toLocaleString(
                "en-US"
            );

    }

}


/* ==========================================
   Get Names
========================================== */

function getTicketNames(){

    return Array.from(
        document.querySelectorAll(
            ".ticket-name-input"
        )
    )
    .map(
        input =>
            input.value.trim()
    );

}


/* ==========================================
   Purchase Tickets
========================================== */

async function purchaseTickets(){

    const button =
        document.getElementById(
            "purchase-ticket-button"
        );


    const paymentConfirmed =
        document.getElementById(
            "ticket-payment-confirmed"
        );


    const names =
        getTicketNames();


    /* ======================================
       Validate Names
    ====================================== */

    if(
        names.length === 0 ||
        names.some(
            name =>
                name === ""
        )
    ){

        showTicketMessage(
            "Please enter a name for every ticket.",
            "error"
        );

        return;

    }


    /* ======================================
       Prevent Duplicate Names In Form
    ====================================== */

    const normalizedNames =
        names.map(
            name =>
                name.toLowerCase()
        );


    const uniqueNames =
        new Set(
            normalizedNames
        );


    if(
        uniqueNames.size !==
        normalizedNames.length
    ){

        showTicketMessage(
            "The same name was entered more than once.",
            "error"
        );

        return;

    }


    /* ======================================
       Payment
    ====================================== */

    if(
        !paymentConfirmed ||
        !paymentConfirmed.checked
    ){

        showTicketMessage(
            "Please confirm that you have paid or have a payment plan made.",
            "error"
        );

        return;

    }


    const total =
        names.length *
        TICKET_PRICE;


    /* ======================================
       Disable Button
    ====================================== */

    button.disabled =
        true;


    button.textContent =
        "Confirming...";


    try{

        const payload = {

            type:
                "ticket",

            names:
                names,

            ticketPrice:
                TICKET_PRICE,

            total:
                total,

            paymentConfirmed:
                true

        };


        console.log(
            "Submitting tickets:",
            payload
        );


        const response =
            await fetch(
                TICKET_API,
                {
                    method:
                        "POST",

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if(!response.ok){

            throw new Error(
                "Ticket request failed: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Ticket response:",
            data
        );


        if(
            !data ||
            data.success !== true
        ){

            throw new Error(
                data &&
                data.error
                    ? data.error
                    : "Tickets could not be saved."
            );

        }


        showTicketMessage(
            names.length === 1
                ? "Your ticket is confirmed!"
                : `${names.length} tickets are confirmed!`,
            "success"
        );


        resetTicketForm();


        await loadTicketAttendees();

    }
    catch(error){

        console.error(
            "Ticket purchase failed:",
            error
        );


        showTicketMessage(
            "Something went wrong confirming your tickets. Please try again.",
            "error"
        );

    }
    finally{

        button.disabled =
            false;


        button.textContent =
            "Confirm Tickets";

    }

}


/* ==========================================
   Reset Form
========================================== */

function resetTicketForm(){

    const nameList =
        document.getElementById(
            "ticket-name-list"
        );


    if(nameList){

        nameList.innerHTML = `

            <div class="ticket-name-row">

                <input
                    type="text"
                    class="ticket-name-input"
                    placeholder="Name"
                    autocomplete="name"
                >

            </div>

        `;

    }


    const paymentConfirmed =
        document.getElementById(
            "ticket-payment-confirmed"
        );


    if(paymentConfirmed){

        paymentConfirmed.checked =
            false;

    }


    updateTicketTotal();

}


/* ==========================================
   Load Attendees
========================================== */

async function loadTicketAttendees(){

    const attendeeList =
        document.getElementById(
            "ticket-attendee-list"
        );


    if(!attendeeList){
        return;
    }


    try{

        const url =
            TICKET_API +
            "?type=tickets" +
            "&t=" +
            Date.now();


        const response =
            await fetch(
                url,
                {
                    method:
                        "GET",

                    cache:
                        "no-store"
                }
            );


        if(!response.ok){

            throw new Error(
                "Ticket attendee request failed: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Ticket attendees loaded:",
            data
        );


        if(
            !data ||
            data.success !== true
        ){

            throw new Error(
                "Unexpected ticket response."
            );

        }


        renderTicketAttendees(
            data.attendees || []
        );

    }
    catch(error){

        console.error(
            "Could not load ticket attendees:",
            error
        );


        attendeeList.innerHTML = `

            <div class="ticket-attendee-error">
                Attendee list could not be loaded.
            </div>

        `;

    }

}


/* ==========================================
   Render Attendees
========================================== */

function renderTicketAttendees(
    attendees
){

    const attendeeList =
        document.getElementById(
            "ticket-attendee-list"
        );


    const attendeeCount =
        document.getElementById(
            "attendee-count"
        );


    if(!attendeeList){
        return;
    }


    const cleanAttendees =
        attendees
            .map(
                name =>
                    String(
                        name
                    ).trim()
            )
            .filter(
                name =>
                    name !== ""
            );


    cleanAttendees.sort(
        (a, b) =>
            a.localeCompare(
                b
            )
    );


    if(attendeeCount){

        attendeeCount.textContent =
            cleanAttendees.length;

    }


    if(
        cleanAttendees.length === 0
    ){

        attendeeList.innerHTML = `

            <div class="ticket-attendee-empty">
                Nobody has locked themselves in yet.
            </div>

        `;


        return;

    }


    attendeeList.innerHTML =
        "";


    cleanAttendees.forEach(
        name => {

            const attendee =
                document.createElement(
                    "div"
                );


            attendee.className =
                "ticket-attendee";


            const icon =
                document.createElement(
                    "span"
                );


            icon.className =
                "ticket-attendee-icon";


            icon.textContent =
                "✓";


            const nameElement =
                document.createElement(
                    "strong"
                );


            nameElement.textContent =
                name;


            attendee.appendChild(
                icon
            );


            attendee.appendChild(
                nameElement
            );


            attendeeList.appendChild(
                attendee
            );

        }
    );

}


/* ==========================================
   Message
========================================== */

function showTicketMessage(
    message,
    type
){

    const element =
        document.getElementById(
            "ticket-submission-message"
        );


    if(!element){
        return;
    }


    element.textContent =
        message;


    element.className =
        "ticket-submission-message " +
        type;

}
