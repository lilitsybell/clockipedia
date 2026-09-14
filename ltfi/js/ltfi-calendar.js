console.log(
    "ltfi-calendar.js loaded"
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


        day.innerHTML = `
            <div class="calendar-day-number">
                ${date.getDate()}
            </div>
        `;


        calendarGrid.appendChild(
            day
        );

    }

}


/* ==========================================
   Helpers
========================================== */

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


/* ==========================================
   Initial Render
========================================== */

renderCalendar();
