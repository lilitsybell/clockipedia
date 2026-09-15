console.log("ltfi-calendar.js loaded");


/* ==========================================
   Calendar Events
========================================== */

/*
    repeat options:

    "none"
    "yearly"
    "weekly"
    "biweekly"

    For a multi-day trip/event:
    add an "end" date.

    The date under "start" is also the anchor
    date for weekly and biweekly events.
*/

let calendarEvents = [];

/* ==========================================
   Elements
========================================== */
const downloadButton =
    document.getElementById(
        "calendar-download"
    );
const calendarTitle =
    document.getElementById(
        "calendar-title"
    );

const calendarGrid =
    document.getElementById(
        "calendar-grid"
    );

const prevButton =
    document.getElementById(
        "calendar-prev"
    );

const nextButton =
    document.getElementById(
        "calendar-next"
    );

const todayButton =
    document.getElementById(
        "calendar-today"
    );


let currentDate =
    new Date();

currentDate.setDate(1);

async function loadCalendarEvents(){

    const response =
        await fetch(
            "/ltfi/data/calendar-events.json"
        );

    if(!response.ok){
        throw new Error(
            "Failed to load calendar-events.json"
        );
    }

    calendarEvents =
        await response.json();

}
/* ==========================================
   Date Helpers
========================================== */

function parseDate(dateString){

    const [
        year,
        month,
        day
    ] = dateString
        .split("-")
        .map(Number);

    return new Date(
        year,
        month - 1,
        day
    );

}


function startOfDay(date){

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

}


function daysBetween(start, end){

    const milliseconds =
        startOfDay(end) -
        startOfDay(start);

    return Math.round(
        milliseconds /
        86400000
    );

}


function isToday(date){

    const today =
        new Date();

    return (
        date.getFullYear() ===
            today.getFullYear() &&

        date.getMonth() ===
            today.getMonth() &&

        date.getDate() ===
            today.getDate()
    );

}


/* ==========================================
   Event Matching
========================================== */

function eventOccursOnDate(
    event,
    date
){

    const start =
        parseDate(event.start);


    /* --------------------------------------
       Yearly
    -------------------------------------- */

    if(
        event.repeat === "yearly"
    ){

        return (
            date.getMonth() ===
                start.getMonth() &&

            date.getDate() ===
                start.getDate()
        );

    }


    /* --------------------------------------
       Weekly
    -------------------------------------- */

    if(
        event.repeat === "weekly"
    ){

        const difference =
            daysBetween(
                start,
                date
            );

        return (
            difference >= 0 &&
            difference % 7 === 0
        );

    }


    /* --------------------------------------
       Every Other Week
    -------------------------------------- */

    if(
        event.repeat === "biweekly"
    ){

        const difference =
            daysBetween(
                start,
                date
            );

        return (
            difference >= 0 &&
            difference % 14 === 0
        );

    }


    /* --------------------------------------
       Fixed Date / Date Range
    -------------------------------------- */

    const end =
        event.end
            ? parseDate(event.end)
            : start;


    const target =
        startOfDay(date);


    return (
        target >=
            startOfDay(start) &&

        target <=
            startOfDay(end)
    );

}


/* ==========================================
   Get Events For Date
========================================== */

function getEventsForDate(date){

    return calendarEvents.filter(
        event =>
            eventOccursOnDate(
                event,
                date
            )
    );

}


/* ==========================================
   Create Event
========================================== */

function createCalendarEvent(event){

    const item =
        document.createElement(
            "div"
        );


    item.className =
        `calendar-event ${event.type}`;


    item.innerHTML = `
        <span class="calendar-event-emoji">
            ${event.emoji}
        </span>

        <span class="calendar-event-title">
            ${event.title}
        </span>
    `;


    return item;

}


/* ==========================================
   Render Calendar
========================================== */

function renderCalendar(){

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    calendarTitle.textContent =
        currentDate.toLocaleDateString(
            "en-US",
            {
                month:"long",
                year:"numeric"
            }
        );


    calendarGrid.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const startDate =
        new Date(
            year,
            month,
            1 - firstDay.getDay()
        );


    for(
        let i = 0;
        i < 42;
        i++
    ){

        const date =
            new Date(startDate);


        date.setDate(
            startDate.getDate() + i
        );


        const day =
            document.createElement(
                "div"
            );


        day.className =
            "calendar-day";


        if(
            date.getMonth() !== month
        ){
            day.classList.add(
                "outside-month"
            );
        }


        if(
            isToday(date)
        ){
            day.classList.add(
                "today"
            );
        }


        const number =
            document.createElement(
                "div"
            );


        number.className =
            "calendar-day-number";


        number.textContent =
            date.getDate();


        day.appendChild(
            number
        );


        const events =
            getEventsForDate(date);


        if(
            events.length > 0
        ){

            const eventList =
                document.createElement(
                    "div"
                );


            eventList.className =
                "calendar-event-list";


            events.forEach(
                event => {

                    eventList.appendChild(
                        createCalendarEvent(
                            event
                        )
                    );

                }
            );


            day.appendChild(
                eventList
            );

        }


        calendarGrid.appendChild(
            day
        );

    }

}


/* ==========================================
   Navigation
========================================== */

prevButton.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);


nextButton.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);


todayButton.addEventListener(
    "click",
    () => {

        currentDate =
            new Date();

        currentDate.setDate(1);

        renderCalendar();

    }
);


async function initializeCalendar(){

    try{

        await loadCalendarEvents();

        renderCalendar();

    }catch(error){

        console.error(
            "Calendar failed to load:",
            error
        );

    }

}
/* ==========================================
   Download Calendar PNG
========================================== */

downloadButton.addEventListener(
    "click",
    async () => {

        const calendarSection =
            document.querySelector(
                ".ltfi-calendar-page-section"
            );

        calendarSection.classList.add(
            "calendar-exporting"
        );

        try{

            const canvas =
                await html2canvas(
                    calendarSection,
                    {
                        scale:2,
                        backgroundColor:"#f1f1f2"
                    }
                );

            const monthName =
                currentDate.toLocaleDateString(
                    "en-US",
                    {
                        month:"long",
                        year:"numeric"
                    }
                )
                .replace(/\s+/g, "-")
                .toLowerCase();

            const link =
                document.createElement(
                    "a"
                );

            link.download =
                `ltfi-calendar-${monthName}.png`;

            link.href =
                canvas.toDataURL(
                    "image/png"
                );

            link.click();

        }catch(error){

            console.error(
                "Calendar PNG failed:",
                error
            );

        }finally{

            calendarSection.classList.remove(
                "calendar-exporting"
            );

        }

    }
);

initializeCalendar();
