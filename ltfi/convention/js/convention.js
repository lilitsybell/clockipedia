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
    });
}
buildGallery();
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
