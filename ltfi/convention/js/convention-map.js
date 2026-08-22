console.log(
    "Lock the Fuck In Seattle map loaded"
);
/* ==========================================
   Map Configuration
========================================== */
const mapBasePath =
    "/ltfi/convention/images/map/";
const floors = {
    lower: {
        title: "Lower Floor",
        description:
            "Bedrooms, theater, and game spaces.",
        base:
            "lower-2.PNG",
        labels:
            "lower-1.PNG",
        rooms: [
            {
                id: "cannibal-cottage",
                name: "Cannibal Cottage",
                image: "cannibal-cottage.PNG"
            }
        ]
    },
    main: {
        title: "Main Floor",
        description:
            "Entry, gathering spaces, kitchen, dining, and bedrooms.",
        base:
            "main-2.PNG",
        labels:
            "main-1.PNG",
        rooms: [
            {
                id: "generals-quarters",
                name: "General's Quarters",
                image: "generals-quarters.PNG"
            },
            {
                id: "huntsmans-hideout",
                name: "Huntsman's Hideout",
                image: "huntsmans-hideout.PNG"
            },
            {
                id: "clockmakers-workshop",
                name: "Clockmaker's Workshop",
                image: "clockmakers-workshop.PNG"
            }
        ]
    },
    upper: {
        title: "Upper Floor",
        description:
            "Bedrooms, decks, conference space, and the hot tub.",
        base:
            "upper-2.PNG",
        labels:
            "upper-1.PNG",
        rooms: [
            {
                id: "kazali-campground",
                name: "Kazali Campground",
                image: "kazali-campground.PNG"
            },
            {
                id: "politician-office",
                name: "Politician Office",
                image: "politician-office.PNG"
            },
            {
                id: "witches-den",
                name: "Witches Den",
                image: "witches-den.PNG"
            },
            {
                id: "cult-leader-compound",
                name: "Cult Leader Compound",
                image: "cult-leader-compound.PNG"
            },
            {
                id: "goblins-grotto",
                name: "Goblin's Grotto",
                image: "goblins-grotto.PNG"
            }
        ]
    },
    observatory: {
        title: "Observatory",
        description:
            "The top-floor Ojo Observatory.",
        single:
            "observatory.PNG",
        rooms: []
    }
};
/* ==========================================
   State
========================================== */
let currentFloor = "lower";
let selectedRoom = null;
/* ==========================================
   Initialize
========================================== */
function initializeMap(){
    const map =
        document.getElementById("floor-map");
    if(!map){
        return;
    }
    buildRoomDropdown();
    setupFloorTabs();
    setupRoomControls();
    renderFloor();
}
if(document.readyState === "loading"){
    document.addEventListener(
        "DOMContentLoaded",
        initializeMap
    );
}
else{
    initializeMap();
}
/* ==========================================
   Room Dropdown
========================================== */
function buildRoomDropdown(){
    const select =
        document.getElementById("room-select");
    Object.entries(floors)
        .forEach(([floorId, floor]) => {
            if(
                !floor.rooms ||
                floor.rooms.length === 0
            ){
                return;
            }
            const group =
                document.createElement("optgroup");
            group.label =
                floor.title;
            floor.rooms.forEach(room => {
                const option =
                    document.createElement("option");
                option.value =
                    `${floorId}:${room.id}`;
                option.textContent =
                    room.name;
                group.appendChild(option);
            });
            select.appendChild(group);
        });
}
/* ==========================================
   Floor Tabs
========================================== */
function setupFloorTabs(){
    const tabs =
        document.querySelectorAll(
            ".floor-tab"
        );
    tabs.forEach(tab => {
        tab.addEventListener(
            "click",
            () => {
                currentFloor =
                    tab.dataset.floor;
                selectedRoom = null;
                document
                    .getElementById(
                        "room-select"
                    )
                    .value = "";
                updateFloorTabs();
                renderFloor();
            }
        );
    });
}
/* ==========================================
   Room Controls
========================================== */
function setupRoomControls(){
    const select =
        document.getElementById(
            "room-select"
        );
    const showAllButton =
        document.getElementById(
            "show-all-rooms"
        );
    select.addEventListener(
        "change",
        () => {
            const value =
                select.value;
            if(!value){
                selectedRoom = null;
                renderFloor();
                return;
            }
            const [
                floorId,
                roomId
            ] = value.split(":");
            currentFloor =
                floorId;
            selectedRoom =
                roomId;
            updateFloorTabs();
            renderFloor();
        }
    );
    showAllButton.addEventListener(
        "click",
        () => {
            selectedRoom = null;
            select.value = "";
            renderFloor();
        }
    );
}
/* ==========================================
   Update Tabs
========================================== */
function updateFloorTabs(){
    document
        .querySelectorAll(
            ".floor-tab"
        )
        .forEach(tab => {
            tab.classList.toggle(
                "active",
                tab.dataset.floor ===
                    currentFloor
            );
        });
}
/* ==========================================
   Render Floor
========================================== */
function renderFloor(){
    const map =
        document.getElementById(
            "floor-map"
        );
    const floor =
        floors[currentFloor];
    map.innerHTML = "";
    /*
        Observatory is one single image.
    */
    if(floor.single){
        addMapLayer(
            floor.single,
            "floor-layer floor-single"
        );
    }
    else{
        /*
            Base/background
        */
        addMapLayer(
            floor.base,
            "floor-layer floor-base"
        );
        /*
            Room color layers
        */
        floor.rooms.forEach(room => {
            if(
                selectedRoom &&
                selectedRoom !== room.id
            ){
                return;
            }
            addMapLayer(
                room.image,
                "floor-layer floor-room-layer"
            );
        });
        /*
            Labels always stay on top.
        */
        addMapLayer(
            floor.labels,
            "floor-layer floor-labels"
        );
    }
    updateFloorInfo();
}
/* ==========================================
   Add Image Layer
========================================== */
function addMapLayer(
    file,
    className
){
    const map =
        document.getElementById(
            "floor-map"
        );
    const image =
        document.createElement("img");
    image.src =
        mapBasePath + file;
    image.alt = "";
    image.className =
        className;
    map.appendChild(image);
}
/* ==========================================
   Floor Information
========================================== */
function updateFloorInfo(){
    const floor =
        floors[currentFloor];
    const title =
        document.getElementById(
            "floor-title"
        );
    const description =
        document.getElementById(
            "floor-description"
        );
    if(selectedRoom){
        const room =
            floor.rooms.find(
                room =>
                    room.id ===
                    selectedRoom
            );
        if(room){
            title.textContent =
                room.name;
            description.textContent =
                `${room.name} is located on the ${floor.title}.`;
            return;
        }
    }
    title.textContent =
        floor.title;
    description.textContent =
        floor.description;
}
