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
