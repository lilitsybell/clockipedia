console.log(
    "Lock the Fuck In Seattle map loaded"
);


/* ==========================================
   Map Configuration
========================================== */

const mapBasePath =
    "/ltfi/convention/images/maps/";


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
   Current State
========================================== */

let currentFloor = "lower";

let selectedRoom = null;


/* ==========================================
   Initialize
========================================== */

function initializeMap(){

    const map =
        document.getElementById(
            "floor-map"
        );


    if(!map){

        console.error(
            "Could not find #floor-map"
        );

        return;

    }


    setupCastleNavigation();

    renderFloor();

}


/* ==========================================
   Castle Navigation
========================================== */

function setupCastleNavigation(){

    const floorButtons =
        document.querySelectorAll(
            ".castle-floor-button"
        );


    const roomButtons =
        document.querySelectorAll(
            ".castle-room-button"
        );


    /*
        Floor buttons
    */

    floorButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentFloor =
                    button.dataset.floor;

                selectedRoom = null;


                renderFloor();

            }
        );

    });


    /*
        Room buttons
    */

    roomButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentFloor =
                    button.dataset.floor;

                selectedRoom =
                    button.dataset.room;


                renderFloor();

            }
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


    if(!map || !floor){

        console.error(
            "Could not render floor:",
            currentFloor
        );

        return;

    }


    /*
        Clear previous floor
    */

    map.innerHTML = "";


    /*
        Observatory
    */

    if(floor.single){

        addMapLayer(
            floor.single,
            "floor-layer floor-single"
        );

    }


    /*
        Normal floors
    */

    else{

        /*
            Background
        */

        addMapLayer(
            floor.base,
            "floor-layer floor-base"
        );


        /*
            Room colors
        */

        floor.rooms.forEach(room => {

            /*
                If one room is selected,
                only show that room.
            */

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
            Labels always stay on top
        */

        addMapLayer(
            floor.labels,
            "floor-layer floor-labels"
        );

    }


    updateFloorInfo();

    updateCastleNavigation();

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
        document.createElement(
            "img"
        );


    image.src =
        mapBasePath + file;


    image.className =
        className;


    image.alt = "";


    image.addEventListener(
        "error",
        () => {

            console.error(
                "Could not load map image:",
                image.src
            );

        }
    );


    map.appendChild(
        image
    );

}


/* ==========================================
   Update Navigation State
========================================== */

function updateCastleNavigation(){

    /*
        Floor buttons
    */

    document
        .querySelectorAll(
            ".castle-floor-button"
        )
        .forEach(button => {

            const isActive =
                button.dataset.floor ===
                    currentFloor &&
                selectedRoom === null;


            button.classList.toggle(
                "active",
                isActive
            );

        });


    /*
        Room buttons
    */

    document
        .querySelectorAll(
            ".castle-room-button"
        )
        .forEach(button => {

            const isActive =
                button.dataset.floor ===
                    currentFloor &&
                button.dataset.room ===
                    selectedRoom;


            button.classList.toggle(
                "active",
                isActive
            );

        });

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


    if(!title || !description){

        return;

    }


    /*
        Room selected
    */

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


    /*
        Whole floor
    */

    title.textContent =
        floor.title;


    description.textContent =
        floor.description;

}


/* ==========================================
   Start
========================================== */

if(document.readyState === "loading"){

    document.addEventListener(
        "DOMContentLoaded",
        initializeMap
    );

}
else{

    initializeMap();

}
