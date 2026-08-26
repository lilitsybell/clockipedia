const ATTENDANCE_API =
    "https://script.google.com/macros/s/AKfycbxXemVNG_-JqYDPdfZuqNNfSawQqumf3tPHNneHSXuzjVJty2Q7KuyDViJhZGDi811dpw/exec";
/* ==========================================
   Guest List
========================================== */
const guests = [
    "Corey",
    "Bell",
    "Amon",
    "Ben",
    "Eddie",
    "elder",
    "Juniper",
    "Kenni",
    "Clover",
    "Josh",
    "Seaplus",
    "Sara+",
    "birdbath",
    "Broom",
    "Dani",
    "Carla",
    "CJ",
    "Clayzerr",
    "darkends",
    "Dr. Croissant",
    "Liv",
    "Nate",
    "Nic",
    "Pear",
    "Reece",
    "Rosie"
];
/* ==========================================
   Date Range
========================================== */
const attendanceStart =
    new Date(2027, 6, 1);
const attendanceEnd =
    new Date(2027, 9, 31);
/* ==========================================
   Local Test Data
========================================== */
let attendanceData = {};
let attendanceLoaded = false;
/* ==========================================
   Current User
========================================== */
let selectedGuest = "";
let selectedDates = new Set();
/* ==========================================
   Initialize Attendance Page
========================================== */
async function initializeAttendance(){
    const guestSelect =
        document.getElementById(
            "guest-select"
        );
    if(!guestSelect){
        return;
    }
    populateGuestSelect();
    buildPersonalCalendar();
    buildHeatMap();
    setupAttendanceEvents();
    await loadAttendanceData();
}
/* ==========================================
   Populate Guest Dropdown
========================================== */
function populateGuestSelect(){
    const select =
        document.getElementById("guest-select");
    if(!select){
        return;
    }
    // Clear anything currently in the dropdown
    select.innerHTML = "";
    // Default option
    const defaultOption =
        document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent =
        "Select your name...";
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    // Add every guest
    guests.forEach(guest => {
        const option =
            document.createElement("option");
        option.value = guest;
        option.textContent = guest;
        select.appendChild(option);
    });
}
/* ==========================================
   Date Utilities
========================================== */
function dateKey(date){
    return date
        .toISOString()
        .split("T")[0];
}
function formatDate(date){
    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}
async function loadAttendanceData(){
    try{
        const response =
            await fetch(
                ATTENDANCE_API
            );
        if(!response.ok){
            throw new Error(
                "Failed to load attendance data"
            );
        }
        attendanceData =
            await response.json();
        attendanceLoaded = true;
        buildHeatMap();
    }
    catch(error){
        console.error(
            "Could not load attendance:",
            error
        );
    }
}
/* ==========================================
   Generate Date List
========================================== */
function getAllAttendanceDates(){
    const dates = [];
    const current =
        new Date(attendanceStart);
    while(
        current <= attendanceEnd
    ){
        dates.push(
            new Date(current)
        );
        current.setDate(
            current.getDate() + 1
        );
    }
    return dates;
}
/* ==========================================
   Personal Calendar
========================================== */
function buildPersonalCalendar(){
    const container =
        document.getElementById(
            "personal-calendar"
        );
    if(!container){
        return;
    }
    container.innerHTML = "";
    const months = [
        {
            month: 6,
            name: "July"
        },
        {
            month: 7,
            name: "August"
        },
        {
            month: 8,
            name: "September"
        },
        {
            month: 9,
            name: "October"
        }
    ];
    months.forEach(monthInfo => {
        const month =
            buildMonthCalendar(
                2027,
                monthInfo.month,
                monthInfo.name,
                true
            );
        container.appendChild(month);
    });
}
/* ==========================================
   Heat Map Calendar
========================================== */
function buildHeatMap(){
    const container =
        document.getElementById(
            "heat-map-calendar"
        );
    if(!container){
        return;
    }
    container.innerHTML = "";
    const months = [
        {
            month: 6,
            name: "July"
        },
        {
            month: 7,
            name: "August"
        },
        {
            month: 8,
            name: "September"
        },
        {
            month: 9,
            name: "October"
        }
    ];
    months.forEach(monthInfo => {
        const month =
            buildMonthCalendar(
                2027,
                monthInfo.month,
                monthInfo.name,
                false
            );
        container.appendChild(month);
    });
}
/* ==========================================
   Build Individual Month
========================================== */
function buildMonthCalendar(
    year,
    month,
    monthName,
    interactive
){
    const wrapper =
        document.createElement("div");
    wrapper.className =
        "attendance-month";
    const heading =
        document.createElement("h3");
    heading.textContent =
        `${monthName} ${year}`;
    wrapper.appendChild(heading);
    const grid =
        document.createElement("div");
    grid.className =
        "attendance-calendar";
    /*
        Weekday headings
    */
    const weekdays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];
    weekdays.forEach(day => {
        const weekday =
            document.createElement("div");
        weekday.className =
            "calendar-weekday";
        weekday.textContent =
            day;
        grid.appendChild(weekday);
    });
    const firstDay =
        new Date(
            year,
            month,
            1
        );
    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );
    /*
        Empty cells before month
    */
    for(
        let i = 0;
        i < firstDay.getDay();
        i++
    ){
        const empty =
            document.createElement("div");
        empty.className =
            "calendar-day empty";
        grid.appendChild(empty);
    }
    /*
        Actual days
    */
    for(
        let day = 1;
        day <= lastDay.getDate();
        day++
    ){
        const date =
            new Date(
                year,
                month,
                day
            );
        const key =
            dateKey(date);
        const cell =
            document.createElement("button");
        cell.type = "button";
        cell.className =
            "calendar-day";
        cell.dataset.date =
            key;
        /*
            Personal availability calendar
        */
        if(interactive){
            if(
                selectedDates.has(key)
            ){
                cell.classList.add(
                    "selected"
                );
            }
            cell.addEventListener(
                "click",
                () => {
                    if(
                        selectedDates.has(key)
                    ){
                        selectedDates.delete(
                            key
                        );
                        cell.classList.remove(
                            "selected"
                        );
                    }
                    else{
                        selectedDates.add(
                            key
                        );
                        cell.classList.add(
                            "selected"
                        );
                    }
                    updateSelectedCount();
                }
            );
        }
        /*
            Heat map
        */
        else{
            applyHeatMapColor(
                cell,
                key
            );
        }
        const number =
            document.createElement("span");
        number.className =
            "calendar-day-number";
        number.textContent =
            day;
        cell.appendChild(number);
        /*
            Heat map count
        */
        if(!interactive){
            const count =
                getUnavailableCount(
                    key
                );
            const countElement =
                document.createElement("small");
            countElement.className =
                "calendar-day-count";
            countElement.textContent =
                `${count}/${guests.length}`;
            cell.appendChild(
                countElement
            );
        }
        grid.appendChild(cell);
    }
    wrapper.appendChild(grid);
    return wrapper;
}
/* ==========================================
   Unavailable Count
========================================== */
function getUnavailableCount(
    date
){
    let count = 0;
    guests.forEach(guest => {
        if(
            attendanceData[guest] &&
            attendanceData[guest].includes(
                date
            )
        ){
            count++;
        }
    });
    return count;
}
/* ==========================================
   Heat Map Colors
========================================== */
function applyHeatMapColor(
    cell,
    date
){
    const count =
        getUnavailableCount(date);
    if(count === 0){
        // Everyone can attend
        cell.classList.add(
            "heat-good"
        );
    }
    else if(count === 1){
        // One person cannot attend
        cell.classList.add(
            "heat-one"
        );
    }
    else if(count === 2){
        // Two people cannot attend
        cell.classList.add(
            "heat-two"
        );
    }
    else{
        // Three or more cannot attend
        cell.classList.add(
            "heat-three"
        );
    }
}
/* ==========================================
   Guest Selection
========================================== */
function handleGuestChange(){
    const select =
        document.getElementById(
            "guest-select"
        );
    selectedGuest =
        select.value;
    selectedDates =
        new Set();
    if(
        selectedGuest &&
        attendanceData[selectedGuest]
    ){
        selectedDates =
            new Set(
                attendanceData[selectedGuest]
            );
    }
    buildPersonalCalendar();
    updateSelectedCount();
    const card =
        document.getElementById(
            "date-selection-card"
        );
    if(selectedGuest){
        card.classList.add(
            "enabled"
        );
    }
    else{
        card.classList.remove(
            "enabled"
        );
    }
}
/* ==========================================
   Selected Count
========================================== */
function updateSelectedCount(){
    const element =
        document.getElementById(
            "selected-count"
        );
    if(!element){
        return;
    }
    const count =
        selectedDates.size;
    element.textContent =
        `${count} ${
            count === 1
                ? "date"
                : "dates"
        } selected`;
}
/* ==========================================
   Submit
========================================== */
async function submitAvailability(){
    if(!selectedGuest){
        showSubmissionMessage(
            "Please select your name first.",
            "error"
        );
        return;
    }
    const button =
        document.getElementById(
            "submit-availability"
        );
    button.disabled = true;
    button.textContent =
        "Saving...";
    try{
        const response =
            await fetch(
                ATTENDANCE_API,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: selectedGuest,
                        dates:
                            Array.from(
                                selectedDates
                            )
                    })
                }
            );
        if(!response.ok){
            throw new Error(
                "Submission failed"
            );
        }
        const result =
            await response.json();
        if(!result.success){
            throw new Error(
                result.error ||
                "Submission failed"
            );
        }
        /*
            Update local data immediately so
            the heat map changes without
            requiring a page reload.
        */
        attendanceData[selectedGuest] =
            Array.from(selectedDates);
        buildHeatMap();
        showSubmissionMessage(
            `Availability saved for ${selectedGuest}.`,
            "success"
        );
    }
    catch(error){
        console.error(
            "Could not submit availability:",
            error
        );
        showSubmissionMessage(
            "Something went wrong saving your availability. Please try again.",
            "error"
        );
    }
    finally{
        button.disabled = false;
        button.textContent =
            "Submit Availability";
    }
}
/* ==========================================
   Submission Message
========================================== */
function showSubmissionMessage(
    message,
    type
){
    const element =
        document.getElementById(
            "submission-message"
        );
    element.textContent =
        message;
    element.className =
        `submission-message ${type}`;
}
/* ==========================================
   Event Listeners
========================================== */
function setupAttendanceEvents(){
    document
        .getElementById(
            "guest-select"
        )
        .addEventListener(
            "change",
            handleGuestChange
        );
    document
        .getElementById(
            "submit-availability"
        )
        .addEventListener(
            "click",
            submitAvailability
        );
}
/* ==========================================
   Start Attendance Page
========================================== */
if(document.readyState === "loading"){
    document.addEventListener(
        "DOMContentLoaded",
        initializeAttendance
    );
}
else{
    initializeAttendance();
}
