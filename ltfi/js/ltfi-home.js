console.log(
    "ltfi-home.js loaded"
);


document.addEventListener(
    "DOMContentLoaded",
    () => {

        buildHomeCalendar();

    }
);


/* ==========================================
   Build Current Month Calendar
========================================== */

function buildHomeCalendar(){

    const grid =
        document.getElementById(
            "home-calendar-grid"
        );


    const title =
        document.getElementById(
            "home-calendar-title"
        );


    if(
        !grid ||
        !title
    ){
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        today.getMonth();


    const monthName =
        today.toLocaleString(
            "en-US",
            {
                month:
                    "long"
            }
        );


    title.textContent =
        monthName +
        " " +
        year;


    /* --------------------------------------
       Month Information
    -------------------------------------- */

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    grid.innerHTML =
        "";


    /* --------------------------------------
       Empty Beginning Cells
    -------------------------------------- */

    for(
        let i = 0;
        i < firstDay;
        i++
    ){

        const emptyCell =
            document.createElement(
                "div"
            );


        emptyCell.className =
            "home-calendar-day empty";


        grid.appendChild(
            emptyCell
        );

    }


    /* --------------------------------------
       Days
    -------------------------------------- */

    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ){

        const dayCell =
            document.createElement(
                "div"
            );


        dayCell.className =
            "home-calendar-day";


        const dateNumber =
            document.createElement(
                "span"
            );


        dateNumber.className =
            "home-calendar-date";


        dateNumber.textContent =
            day;


        dayCell.appendChild(
            dateNumber
        );


        /* ----------------------------------
           Today
        ---------------------------------- */

        if(
            day === today.getDate()
        ){

            dayCell.classList.add(
                "today"
            );

        }


        grid.appendChild(
            dayCell
        );

    }

}
