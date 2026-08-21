console.log("Lock the Fuck In Seattle convention loaded");
/* ==========================================
   Convention Gallery
========================================== */
const galleryPhotos = [];
for(let i = 1; i <= 52; i++){
    galleryPhotos.push(
        `/ltfi/convention/images/gallery/photo${i}.jpg`
    );
}
let currentGalleryIndex = 0;
/* ==========================================
   Build Gallery
========================================== */
function buildGallery(){
    const gallery =
        document.getElementById("gallery-grid");
    if(!gallery){
        return;
    }
    gallery.innerHTML = "";
    galleryPhotos.forEach((photo, index) => {
        const item =
            document.createElement("div");
        item.className = "gallery-item";
        const image =
            document.createElement("img");
        image.src = photo;
        image.alt =
            `Lock the Fuck In 2026 - Photo ${index + 1}`;
        image.loading = "lazy";
        item.appendChild(image);
        gallery.appendChild(item);
        item.addEventListener("click", () => {
            openGallery(index);
        });
    });
}
/* ==========================================
   Open Gallery
========================================== */
function openGallery(index){
    currentGalleryIndex = index;
    updateGalleryViewer();
    document
        .getElementById("gallery-viewer")
        .classList.add("open");
    document.body.classList.add("gallery-open");
}
/* ==========================================
   Close Gallery
========================================== */
function closeGallery(){
    document
        .getElementById("gallery-viewer")
        .classList.remove("open");
    document.body.classList.remove("gallery-open");
}
/* ==========================================
   Previous Photo
========================================== */
function previousGalleryPhoto(){
    currentGalleryIndex--;
    if(currentGalleryIndex < 0){
        currentGalleryIndex =
            galleryPhotos.length - 1;
    }
    updateGalleryViewer();
}
/* ==========================================
   Next Photo
========================================== */
function nextGalleryPhoto(){
    currentGalleryIndex++;
    if(
        currentGalleryIndex >=
        galleryPhotos.length
    ){
        currentGalleryIndex = 0;
    }
    updateGalleryViewer();
}
/* ==========================================
   Update Viewer
========================================== */
function updateGalleryViewer(){
    const image =
        document.getElementById("gallery-viewer-image");
    const counter =
        document.getElementById("gallery-counter");
    image.src =
        galleryPhotos[currentGalleryIndex];
    image.alt =
        `Lock the Fuck In 2026 - Photo ${
            currentGalleryIndex + 1
        }`;
    counter.textContent =
        `${currentGalleryIndex + 1} / ${
            galleryPhotos.length
        }`;
}
/* ==========================================
   Gallery Controls
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    buildGallery();
    document
        .getElementById("gallery-close")
        .addEventListener("click", closeGallery);
    document
        .getElementById("gallery-previous")
        .addEventListener(
            "click",
            previousGalleryPhoto
        );
    document
        .getElementById("gallery-next")
        .addEventListener(
            "click",
            nextGalleryPhoto
        );
    /*
        Clicking the dark background
        closes the viewer.
    */
    document
        .getElementById("gallery-viewer")
        .addEventListener("click", event => {
            if(
                event.target.id ===
                "gallery-viewer"
            ){
                closeGallery();
            }
        });
    /*
        Keyboard controls
    */
    document.addEventListener(
        "keydown",
        event => {
            const viewer =
                document.getElementById(
                    "gallery-viewer"
                );
            if(
                !viewer.classList.contains("open")
            ){
                return;
            }
            if(event.key === "Escape"){
                closeGallery();
            }
            if(event.key === "ArrowLeft"){
                previousGalleryPhoto();
            }
            if(event.key === "ArrowRight"){
                nextGalleryPhoto();
            }
        }
    );
});
/* ==========================================
   Convention Countdown
========================================== */
const conventionDate = new Date(
    "2027-08-04T00:00:00-07:00"
);
function updateCountdown(){
    const now = new Date();
    const difference =
        conventionDate.getTime() - now.getTime();
    /*
        Convention has started
    */
    if(difference <= 0){
        document.getElementById("countdown").innerHTML = `
            <div class="countdown-started">
                LOCK THE FUCK IN
            </div>
        `;
        return;
    }
    const totalSeconds =
        Math.floor(difference / 1000);
    const days =
        Math.floor(totalSeconds / 86400);
    const hours =
        Math.floor((totalSeconds % 86400) / 3600);
    const minutes =
        Math.floor((totalSeconds % 3600) / 60);
    const seconds =
        totalSeconds % 60;
    document.getElementById("days").textContent =
        String(days).padStart(3, "0");
    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);
/* ==========================================
   Attendance Page
========================================== */
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
    "Reece"
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
let attendanceData =
    JSON.parse(
        localStorage.getItem(
            "ltfi-attendance"
        ) || "{}"
    );
/* ==========================================
   Current User
========================================== */
let selectedGuest = "";
let selectedDates = new Set();
/* ==========================================
   Initialize Attendance Page
========================================== */
function initializeAttendance(){
    const guestSelect =
        document.getElementById(
            "guest-select"
        );
    /*
        This isn't the attendance page.
    */
    if(!guestSelect){
        return;
    }
    populateGuestSelect();
    buildPersonalCalendar();
    buildHeatMap();
    setupAttendanceEvents();
}
/* ==========================================
   Populate Guest Dropdown
========================================== */
function populateGuestSelect(){
    const select =
        document.getElementById(
            "guest-select"
        );
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
    const total =
        guests.length;
    const percentage =
        total === 0
            ? 0
            : count / total;
    if(count === 0){
        cell.classList.add(
            "heat-none"
        );
    }
    else if(
        percentage <= .20
    ){
        cell.classList.add(
            "heat-good"
        );
    }
    else if(
        percentage <= .40
    ){
        cell.classList.add(
            "heat-mixed"
        );
    }
    else if(
        percentage <= .60
    ){
        cell.classList.add(
            "heat-difficult"
        );
    }
    else{
        cell.classList.add(
            "heat-bad"
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
function submitAvailability(){
    if(!selectedGuest){
        showSubmissionMessage(
            "Please select your name first.",
            "error"
        );
        return;
    }
    attendanceData[selectedGuest] =
        Array.from(selectedDates);
    localStorage.setItem(
        "ltfi-attendance",
        JSON.stringify(
            attendanceData
        )
    );
    showSubmissionMessage(
        `Availability saved for ${selectedGuest}.`,
        "success"
    );
    buildHeatMap();
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
document.addEventListener(
    "DOMContentLoaded",
    initializeAttendance
);
