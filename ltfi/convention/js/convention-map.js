console.log("convention-map.js loaded");
/* ==========================================
   Map Data
========================================== */
const castleMapData = {
    lower: {
        name:
            "Lower Floor",
        rooms: [
            {
                name: "Cannibal Cottage",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-cannibal.png",
                url: "/ltfi/convention/rooms/cannibal-cottage.html",
                photo: "/ltfi/convention/rooms/cannibal-4.html"
            },
            {
                name: "Hermit Hideout",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-cannibal.png",
                url: "/ltfi/convention/rooms/cannibal-cottage.html",
                photo: "/ltfi/convention/rooms/cannibal-1.html"
            },
            {
                name: "Gambler's Game Room",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-gambler.png",
                url: "/ltfi/convention/rooms/gamblers-game-room.html",
                photo: "/ltfi/convention/rooms/gambler-1.html"
            },
            {
                name: "Typhon Theater",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-typhon.png",
                url: "/ltfi/convention/rooms/typhon-theater.html",
                photo: "/ltfi/convention/rooms/typhon-1.html"
            }
        ]
    },
    main: {
        name:
            "Main Floor",
        rooms: [
            {
                name: "Doomsayer Diner",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-doomsayer2.png",
                url: "/ltfi/convention/rooms/doomsayer-diner.html",
                photo: "/ltfi/convention/rooms/doomsayer-1.html"
            },
            {
                name: "Chef's Kitchen",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-chef2.png",
                url: "/ltfi/convention/rooms/chefs-kitchen.html",
                photo: "/ltfi/convention/rooms/chef-1.html"
            },
            {
                name: "General's Quarters",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-general2.png",
                url: "/ltfi/convention/rooms/generals-quarters.html",
                photo: "/ltfi/convention/rooms/general-1.html"
            },
            {
                name: "Huntsman's Hideout",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-huntsman2.png",
                url: "/ltfi/convention/rooms/huntsmans-hideout.html",
                photo: "/ltfi/convention/rooms/huntsman-1.html"
            },
            {
                name: "Innkeeper's Tavern",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-innkeeper2.png",
                url: "/ltfi/convention/rooms/innkeepers-tavern.html",
                photo: "/ltfi/convention/rooms/innkeeper-1.html"
            },
            {
                name: "Clockmaker's Workshop",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-clockmaker2.png",
                url: "/ltfi/convention/rooms/clockmakers-workshop.html",
                photo: "/ltfi/convention/rooms/clockmaker-1.html"
            }
        ]
    },
    upper: {
        name: "Upper Floor",
        rooms: [
            {
                name: "Goblin's Grotto",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-goblin.png",
                url: "/ltfi/convention/rooms/goblins-grotto.html",
                photo: "/ltfi/convention/rooms/goblin-1.html"
            },
            {
                name: "Witches Den",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-witch.png",
                url: "/ltfi/convention/rooms/witches-den.html",
                photo: "/ltfi/convention/rooms/witch-1.html"
            },
            {
                name: "Politician Office",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-politician.png",
                url: "/ltfi/convention/rooms/politician-office.html",
                photo: "/ltfi/convention/rooms/politician-1.html"
            },
            {
                name: "Cult Leader Compound",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-cult-leader.png",
                url: "/ltfi/convention/rooms/cult-leader-compound.html",
                photo: "/ltfi/convention/rooms/cult-1.html"
            },
            {
                name: "Kazali Campground",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-kazali.png",
                url: "/ltfi/convention/rooms/kazali-campground.html",
                photo: "/ltfi/convention/rooms/kazali-1.html"
            },
            {
                name: "Marionette Motel",
                type: "Bedroom",
                image: "/ltfi/convention/images/rooms/room-kazali.png",
                url: "/ltfi/convention/rooms/kazali-campground.html",
                photo: "/ltfi/convention/rooms/kazali-3.html"
            },
            {
                name: "No Dashii Springs",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-no-dashii.png",
                url: "/ltfi/convention/rooms/no-dashii-springs.html",
                photo: "/ltfi/convention/rooms/no-dashii-1.html"
            },
            {
                name: "Puzzlemaster Paradise",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-puzzlemaster.png",
                url: "/ltfi/convention/rooms/puzzlemaster-paradise.html",
                photo: "/ltfi/convention/rooms/puzzlemaster-1.html"
            },
            {
                name: "Golem's Chamber",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-golem.png",
                url: "/ltfi/convention/rooms/golems-chamber.html",
                photo: "/ltfi/convention/rooms/golem-1.html"
            }
        ]
    },
    observatory: {
        name: "Observatory",
        rooms: [
            {
                name: "Ojo Observatory",
                type: "Shared Space",
                image: "/ltfi/convention/images/rooms/room-ojo.png",
                url: "/ltfi/convention/rooms/ojo-observatory.html",
                photo: "/ltfi/convention/rooms/ojo-1.html"
            }
        ]
    }
};
/* ==========================================
   Current State
========================================== */
let currentFloor =
    "main";
let currentRoom =
    null;
/* ==========================================
   Initialize
========================================== */
document.addEventListener(
    "DOMContentLoaded",
    () => {
        preloadMapImages();
        setupFloorTabs();
        renderFloor(
            currentFloor
        );
    }
);
/* ==========================================
   Floor Tabs
========================================== */
function setupFloorTabs(){
    const tabs =
        document.querySelectorAll(
            ".castle-floor-tab"
        );
    tabs.forEach(tab => {
        tab.addEventListener(
            "click",
            () => {
                const floor =
                    tab.dataset.floor;
                if(
                    !castleMapData[floor]
                ){
                    return;
                }
                currentFloor =
                    floor;
                currentRoom =
                    null;
                tabs.forEach(otherTab => {
                    otherTab.classList.toggle(
                        "active",
                        otherTab === tab
                    );
                });
                renderFloor(
                    floor
                );
            }
        );
    });
}
/* ==========================================
   Render Floor
========================================== */
function renderFloor(
    floorKey
){
    const floor =
        castleMapData[
            floorKey
        ];
    if(!floor){
        return;
    }
    updateFloorHeading(
        floor
    );
    renderDirectory(
        floor
    );
    showFloorPlaceholder(
        floor
    );
    hideSelectedRoom();
}
/* ==========================================
   Floor Heading
========================================== */
function updateFloorHeading(
    floor
){
    const directoryFloor =
        document.querySelector(
            "#castle-directory-floor"
        );
    const mapFloor =
        document.querySelector(
            "#castle-map-floor-name"
        );
    if(directoryFloor){
        directoryFloor.textContent =
            floor.name;
    }
    if(mapFloor){
        mapFloor.textContent =
            floor.name;
    }
}
/* ==========================================
   Directory
========================================== */
function renderDirectory(
    floor
){
    const directory =
        document.querySelector(
            "#castle-directory-list"
        );
    if(!directory){
        return;
    }
    directory.innerHTML =
        "";
    const bedroomRooms =
        floor.rooms.filter(
            room =>
                room.type ===
                "Bedroom"
        );
    const sharedRooms =
        floor.rooms.filter(
            room =>
                room.type ===
                "Shared Space"
        );
    if(
        bedroomRooms.length
    ){
        directory.appendChild(
            buildDirectoryGroup(
                "Bedrooms",
                bedroomRooms
            )
        );
    }
    if(
        sharedRooms.length
    ){
        directory.appendChild(
            buildDirectoryGroup(
                "Shared Spaces",
                sharedRooms
            )
        );
    }
}
/* ==========================================
   Directory Group
========================================== */
function buildDirectoryGroup(
    title,
    rooms
){
    const group =
        document.createElement(
            "div"
        );
    group.className =
        "castle-directory-group";
    const heading =
        document.createElement(
            "span"
        );
    heading.className =
        "castle-directory-group-title";
    heading.textContent =
        title;
    group.appendChild(
        heading
    );
    rooms.forEach(room => {
        const button =
            document.createElement(
                "button"
            );
        button.type =
            "button";
        button.className =
            "castle-directory-room";
        button.textContent =
            room.name;
        button.addEventListener(
            "click",
            () => {
                selectRoom(
                    room,
                    button
                );
            }
        );
        group.appendChild(
            button
        );
    });
    return group;
}
/* ==========================================
   Select Room
========================================== */
function selectRoom(
    room,
    button
){
    currentRoom =
        room;
    document
        .querySelectorAll(
            ".castle-directory-room"
        )
        .forEach(otherButton => {
            otherButton.classList.remove(
                "active"
            );
        });
    button.classList.add(
        "active"
    );
    showRoomMap(
        room
    );
    showSelectedRoom(
        room
    );
}
/* ==========================================
   Show Room Map
========================================== */
function showRoomMap(
    room
){
    const floorPlan =
        document.querySelector(
            "#castle-floor-plan"
        );
    if(!floorPlan){
        return;
    }
    floorPlan.innerHTML =
        "";
    const image =
        document.createElement(
            "img"
        );
    image.src =
        room.image;
    image.alt =
        room.name +
        " location";
    floorPlan.appendChild(
        image
    );
}
/* ==========================================
   Floor Placeholder
========================================== */
function showFloorPlaceholder(
    floor
){
    const floorPlan =
        document.querySelector(
            "#castle-floor-plan"
        );
    if(!floorPlan){
        return;
    }
    floorPlan.innerHTML =
        "";
    const placeholder =
        document.createElement(
            "div"
        );
    placeholder.className =
        "castle-map-placeholder";
    placeholder.innerHTML = `
        <span>
            ${floor.name}
        </span>
        <strong>
            Select a room
        </strong>
        <p>
            Choose a room from the directory
            to see its location on the floor plan.
        </p>
    `;
    floorPlan.appendChild(
        placeholder
    );
}
/* ==========================================
   Selected Room
========================================== */
function showSelectedRoom(
    room
){
    const panel =
        document.querySelector(
            "#castle-selected-room"
        );
    const image =
        document.querySelector(
            "#castle-selected-image"
        );
    const type =
        document.querySelector(
            "#castle-selected-type"
        );
    const name =
        document.querySelector(
            "#castle-selected-name"
        );
    const description =
        document.querySelector(
            "#castle-selected-description"
        );
   const button =
    document.querySelector(
        "#castle-selected-button"
    );
    if(!panel){
        return;
    }
    panel.hidden =
        false;
if(image){
    image.src =
        room.photo ||
        room.image;
    image.alt =
        room.name;
}
    if(type){
        type.textContent =
            room.type;
    }
    if(name){
        name.textContent =
            room.name;
    }
    if(description){
        description.textContent =
            castleMapData[
                currentFloor
            ].name;
    }
if(button){
    if(room.url){
        button.href =
            room.url;
        button.hidden =
            false;
    }
    else{
        button.hidden =
            true;
    }
}
}
/* ==========================================
   Hide Selected Room
========================================== */
function hideSelectedRoom(){
    const panel =
        document.querySelector(
            "#castle-selected-room"
        );
    if(panel){
        panel.hidden =
            true;
    }
}
/* ==========================================
   Preload Map Images
========================================== */
function preloadMapImages(){
    Object
        .values(castleMapData)
        .forEach(floor => {
            floor.rooms.forEach(room => {
                const image =
                    new Image();
                image.src =
                    room.image;
            });
        });
}
