console.log(
    "Convention pricing calculator loaded"
);
const PRICING_API =
    "https://script.google.com/macros/s/AKfycbxsN8ESL2dW6EDROGQqv2-Z_glDrnZ6UUAtya9cdXui0RsNPTCr8vCVpJSmhKon9xCqhg/exec";
/* ==========================================
   Defaults
========================================== */
const defaultPricingConfig = {
    amountToAllocate: 7500,
    points: {
        beds: {
            king: 10,
            queen: 9,
            full: 8,
            twin: 7,
            queenSofa: 6.5,
            fullSofa: 6,
            twinRollaway: 6,
            twinAirMattress: 6
        },
bathrooms: {
    private: 8,
    none: 0
},

kitchens: {
    full: 4,
    kitchenette: 3,
    none: 0
},

decks: {
    private: 2,
    none: 0
},

sharing: {
    1: 8,
    2: 4,
    3: 2,
    4: 0,
}
    },
rooms: [

    {
        id: "cannibal-cottage",
        name: "Cannibal Cottage",
        bathroom: "private",
        kitchen: "full",
        deck: "none",
        conjoined: "Hermit Hideout",
        beds: [
            {
                id: "cannibal-cottage-sofa",
                type: "queenSofa"
            }
        ]
    },

    {
        id: "hermit-hideout",
        name: "Hermit Hideout",
        bathroom: "private",
        kitchen: "full",
        deck: "none",
        conjoined: "Cannibal Cottage",
        beds: [
            {
                id: "hermit-hideout-queen",
                type: "queen"
            }
        ]
    },

    {
        id: "generals-quarters",
        name: "General's Quarters",
        bathroom: "private",
        kitchen: "kitchenette",
        deck: "private",
        beds: [
            {
                id: "generals-quarters-queen",
                type: "queen"
            }
        ]
    },

    {
        id: "huntsmans-hideout",
        name: "Huntsman's Hideout",
        bathroom: "none",
        kitchen: "none",
        deck: "none",
        beds: [
            {
                id: "huntsmans-hideout-sofa",
                type: "queenSofa"
            }
        ]
    },

    {
        id: "clockmakers-workshop",
        name: "Clockmaker's Workshop",
        bathroom: "none",
        kitchen: "none",
        deck: "none",
        beds: [
            {
                id: "clockmakers-workshop-queen",
                type: "queen"
            }
        ]
    },

    {
        id: "kazali-campground",
        name: "Kazali Campground",
        bathroom: "private",
        kitchen: "kitchenette",
        deck: "none",
        conjoined: "Marionette Motel",
        beds: [
            {
                id: "kazali-campground-king",
                type: "king"
            }
        ]
    },

    {
        id: "marionette-motel",
        name: "Marionette Motel",
        bathroom: "private",
        kitchen: "kitchenette",
        deck: "none",
        conjoined: "Kazali Campground",
        beds: [
            {
                id: "marionette-motel-twin",
                type: "twin"
            },
            {
                id: "marionette-motel-full",
                type: "full"
            }
        ]
    },

    {
        id: "politician-office",
        name: "Politician Office",
        bathroom: "private",
        kitchen: "kitchenette",
        deck: "private",
        beds: [
            {
                id: "politician-office-king",
                type: "king"
            }
        ]
    },

    {
        id: "witches-den",
        name: "Witches Den",
        bathroom: "private",
        kitchen: "kitchenette",
        deck: "private",
        beds: [
            {
                id: "witches-den-queen",
                type: "queen"
            }
        ]
    },

    {
        id: "cult-leader-compound",
        name: "Cult Leader Compound",
        bathroom: "private",
        kitchen: "kitchenette",
        deck: "private",
        beds: [
            {
                id: "cult-leader-compound-twin-1",
                type: "twin"
            },
            {
                id: "cult-leader-compound-twin-2",
                type: "twin"
            }
        ]
    },

    {
        id: "goblins-grotto",
        name: "Goblin's Grotto",
        bathroom: "none",
        kitchen: "none",
        deck: "private",
        beds: [
            {
                id: "goblins-grotto-queen-1",
                type: "queen"
            },
            {
                id: "goblins-grotto-queen-2",
                type: "queen"
            }
        ]
    }

]
};
/* ==========================================
   Labels
========================================== */
const bedLabels = {
    king: "King",
    queen: "Queen",
    full: "Full",
    twin: "Twin",
    queenSofa: "Queen Sofa Bed",
    fullSofa: "Full Sofa Bed",
    twinRollaway: "Twin Rollaway",
    twinAirMattress: "Twin Air Mattress"
};
const bathroomLabels = {
    private: "Private Bathroom",
    none: "No Bathroom"
};
const kitchenLabels = {
    full: "Full Kitchen",
    kitchenette: "Kitchenette",
    none: "None"
};
const deckLabels = {
    private: "Private Deck",
    none: "No Private Deck"
};
const sharingLabels = {
    1: "1 Bed",
    2: "2 Beds",
    3: "3 Beds",
    4: "4 Beds",
};
/* ==========================================
   State
========================================== */
let pricingConfig =
    structuredClone(
        defaultPricingConfig
    );
let hasUnsavedChanges = false;
let pricingRevision = 0;
let pricingLastUpdated = null;
let pricingSyncTimer = null;
let pricingAutoSaveTimer = null;
/* ==========================================
   Initialization
========================================== */
async function initializePricing(){
    setupGlobalControls();
    await loadPricing();
    startPricingSync();
}
function setupGlobalControls(){
    const amountInput =
        document.getElementById(
            "amount-to-allocate"
        );
    amountInput.value =
        pricingConfig.amountToAllocate;
    amountInput.addEventListener(
        "input",
        () => {
            pricingConfig.amountToAllocate =
                Math.max(
                    0,
                    Number(
                        amountInput.value
                    ) || 0
                );
            markUnsaved();
            updatePricing();
        }
    );
    document
        .getElementById(
            "reset-pricing-button"
        )
        .addEventListener(
            "click",
            resetPricing
        );
    document
        .getElementById(
            "save-pricing-button"
        )
        .addEventListener(
            "click",
            savePricing
        );
}
/* ==========================================
   Point Settings
========================================== */
function renderPointSettings(){
    renderPointGroup(
        "bed-point-settings",
        pricingConfig.points.beds,
        bedLabels,
        "beds"
    );
    renderPointGroup(
        "bathroom-point-settings",
        pricingConfig.points.bathrooms,
        bathroomLabels,
        "bathrooms"
    );
    renderPointGroup(
        "kitchen-point-settings",
        pricingConfig.points.kitchens,
        kitchenLabels,
        "kitchens"
    );
    renderPointGroup(
    "deck-point-settings",
    pricingConfig.points.decks,
    deckLabels,
    "decks"
);
    renderPointGroup(
        "sharing-point-settings",
        pricingConfig.points.sharing,
        sharingLabels,
        "sharing"
    );
}
function renderPointGroup(
    containerId,
    values,
    labels,
    groupName
){
    const container =
        document.getElementById(
            containerId
        );
    container.innerHTML = "";
    Object.entries(
        values
    ).forEach(
        ([key, value]) => {
            const row =
                document.createElement(
                    "label"
                );
            row.className =
                "point-setting-row";
            const name =
                document.createElement(
                    "span"
                );
            name.textContent =
                labels[key] || key;
            const input =
                document.createElement(
                    "input"
                );
            input.type = "number";
            input.step = ".5";
            input.value = value;
            input.addEventListener(
                "input",
                () => {
                    pricingConfig
                        .points[groupName][key] =
                        Number(
                            input.value
                        ) || 0;
                    markUnsaved();
                    updatePricing();
                }
            );
            row.append(
                name,
                input
            );
            container.appendChild(
                row
            );
        }
    );
}
/* ==========================================
   Room Editor
========================================== */
function renderRooms(){
    const container =
        document.getElementById(
            "room-editor"
        );
    container.innerHTML = "";
    pricingConfig.rooms.forEach(
        room => {
            container.appendChild(
                createRoomCard(
                    room
                )
            );
        }
    );
}
function createRoomCard(
    room
){
    const card =
        document.createElement(
            "article"
        );
    card.className =
        "room-pricing-card";
    const heading =
        document.createElement(
            "div"
        );
    heading.className =
        "room-pricing-heading";
    const title =
        document.createElement(
            "h3"
        );
    title.textContent =
        room.name;
    heading.appendChild(
        title
    );
    const settings =
        document.createElement(
            "div"
        );
    settings.className =
        "room-setting-grid";
settings.append(
    createRoomSelect(
        "Bathroom",
        bathroomLabels,
        room.bathroom,
        value => {
            room.bathroom =
                value;
            roomChanged();
        }
    ),

    createRoomSelect(
        "Kitchen",
        kitchenLabels,
        room.kitchen,
        value => {
            room.kitchen =
                value;
            roomChanged();
        }
    ),

    createRoomSelect(
        "Private Deck",
        deckLabels,
        room.deck,
        value => {
            room.deck =
                value;
            roomChanged();
        }
    )
);
    const bedSection =
        document.createElement(
            "div"
        );
    bedSection.className =
        "room-bed-section";
    const bedHeading =
        document.createElement(
            "div"
        );
    bedHeading.className =
        "room-bed-heading";
    bedHeading.textContent =
        "Beds";
    const bedList =
        document.createElement(
            "div"
        );
    bedList.className =
        "room-bed-list";
    room.beds.forEach(
        bed => {
            bedList.appendChild(
                createBedRow(
                    room,
                    bed
                )
            );
        }
    );
    const addBedArea =
        createAddBedControl(
            room
        );
    bedSection.append(
        bedHeading,
        bedList,
        addBedArea
    );
    card.append(
        heading,
        settings,
        bedSection
    );
    return card;
}
function createRoomSelect(
    labelText,
    options,
    currentValue,
    changeCallback
){
    const wrapper =
        document.createElement(
            "label"
        );
    wrapper.className =
        "room-setting";
    const label =
        document.createElement(
            "span"
        );
    label.textContent =
        labelText;
    const select =
        document.createElement(
            "select"
        );
    Object.entries(
        options
    ).forEach(
        ([value, text]) => {
            const option =
                document.createElement(
                    "option"
                );
            option.value =
                value;
            option.textContent =
                text;
            option.selected =
                value === currentValue;
            select.appendChild(
                option
            );
        }
    );
    select.addEventListener(
        "change",
        () => {
            changeCallback(
                select.value
            );
        }
    );
    wrapper.append(
        label,
        select
    );
    return wrapper;
}
function createBedRow(
    room,
    bed
){
    const row =
        document.createElement(
            "div"
        );
    row.className =
        "room-bed-row";
    const select =
        document.createElement(
            "select"
        );
    Object.entries(
        bedLabels
    ).forEach(
        ([value, label]) => {
            const option =
                document.createElement(
                    "option"
                );
            option.value =
                value;
            option.textContent =
                label;
            option.selected =
                value === bed.type;
            select.appendChild(
                option
            );
        }
    );
    select.addEventListener(
        "change",
        () => {
            bed.type =
                select.value;
            roomChanged();
        }
    );
    const removeButton =
        document.createElement(
            "button"
        );
    removeButton.type =
        "button";
    removeButton.className =
        "remove-bed-button";
    removeButton.textContent =
        "Remove";
    removeButton.addEventListener(
        "click",
        () => {
            room.beds =
                room.beds.filter(
                    currentBed =>
                        currentBed.id !==
                        bed.id
                );
            roomChanged(
                true
            );
        }
    );
    row.append(
        select,
        removeButton
    );
    return row;
}
function createAddBedControl(
    room
){
    const wrapper =
        document.createElement(
            "div"
        );
    wrapper.className =
        "add-bed-control";
    const select =
        document.createElement(
            "select"
        );
    Object.entries(
        bedLabels
    ).forEach(
        ([value, label]) => {
            const option =
                document.createElement(
                    "option"
                );
            option.value =
                value;
            option.textContent =
                label;
            if(
                value ===
                "twinAirMattress"
            ){
                option.selected =
                    true;
            }
            select.appendChild(
                option
            );
        }
    );
    const button =
        document.createElement(
            "button"
        );
    button.type =
        "button";
    button.className =
        "add-bed-button";
    button.textContent =
        "+ Add Bed";
    button.addEventListener(
        "click",
        () => {
            room.beds.push(
                {
                    id:
                        createUniqueBedId(
                            room.id
                        ),
                    type:
                        select.value
                }
            );
            roomChanged(
                true
            );
        }
    );
    wrapper.append(
        select,
        button
    );
    return wrapper;
}
function createUniqueBedId(
    roomId
){
    return (
        roomId +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 7)
    );
}
function roomChanged(
    rerender = false
){
    markUnsaved();
    if(rerender){
        renderRooms();
    }
    updatePricing();
}
/* ==========================================
   Pricing Math
========================================== */
function getSharingKey(
    bedCount
){
    if(bedCount >= 6){
        return "6";
    }
    return String(
        Math.max(
            1,
            bedCount
        )
    );
}
function getBedPoints(
    room,
    bed
){
    const bedPoints =
        pricingConfig.points
            .beds[bed.type] || 0;
    const bathroomPoints =
        pricingConfig.points
            .bathrooms[
                room.bathroom
            ] || 0;
    const kitchenPoints =
        pricingConfig.points
            .kitchens[
                room.kitchen
            ] || 0;
const sharingKey =
    getSharingKey(
        room.beds.length
    );
    const sharingPoints =
        pricingConfig.points
            .sharing[
                sharingKey
            ] || 0;
    const deckPoints =
    pricingConfig.points
        .decks[
            room.deck
        ] || 0;
return (
    bedPoints +
    bathroomPoints +
    kitchenPoints +
    deckPoints +
    sharingPoints
);
}
function calculatePricing(){
    const rows = [];
    pricingConfig.rooms.forEach(
        room => {
            room.beds.forEach(
                bed => {
                    rows.push(
                        {
                            room,
                            bed,
                            points:
                                getBedPoints(
                                    room,
                                    bed
                                )
                        }
                    );
                }
            );
        }
    );
    const totalPoints =
        rows.reduce(
            (
                total,
                row
            ) =>
                total +
                row.points,
            0
        );
    rows.forEach(
        row => {
            if(totalPoints <= 0){
                row.price = 0;
                return;
            }
            row.price =
                (
                    row.points /
                    totalPoints
                ) *
                pricingConfig
                    .amountToAllocate;
        }
    );
    return {
        rows,
        totalPoints
    };
}
/* ==========================================
   Results
========================================== */
function updatePricing(){
    const result =
        calculatePricing();
    renderResults(
        result
    );
    document
        .getElementById(
            "summary-total-points"
        )
        .textContent =
        formatPoints(
            result.totalPoints
        );
    document
        .getElementById(
            "summary-bed-count"
        )
        .textContent =
        result.rows.length;
    document
        .getElementById(
            "summary-price-total"
        )
        .textContent =
        formatMoney(
            pricingConfig
                .amountToAllocate
        );
}
function renderResults(
    result
){
    const body =
        document.getElementById(
            "pricing-results-body"
        );

    body.innerHTML = "";
    const sortedRows =
        [...result.rows].sort(
            (a, b) =>
                b.price - a.price
        );
    sortedRows.forEach(
        row => {
            const tr =
                document.createElement(
                    "tr"
                );
            tr.innerHTML = `
                <td>
                    ${escapeHtml(
                        row.room.name
                    )}
                </td>
                <td>
                    ${escapeHtml(
                        bedLabels[
                            row.bed.type
                        ]
                    )}
                </td>
                <td>
                    ${formatPoints(
                        row.points
                    )}
                </td>
                <td>
                    ${formatMoney(
                        row.price
                    )}
                </td>
            `;
            body.appendChild(
                tr
            );
        }
    );
    document
        .getElementById(
            "results-total-points"
        )
        .textContent =
        formatPoints(
            result.totalPoints
        );
    document
        .getElementById(
            "results-total-price"
        )
        .textContent =
        formatMoney(
            pricingConfig
                .amountToAllocate
        );
}
/* ==========================================
   Save / Reset
========================================== */
function markUnsaved(){
    hasUnsavedChanges =
        true;
    const status =
        document.getElementById(
            "save-status"
        );
    status.textContent =
        "● Unsaved changes";
    status.className =
        "save-status unsaved";
    clearTimeout(
        pricingAutoSaveTimer
    );
    pricingAutoSaveTimer =
        setTimeout(
            savePricing,
            500
        );
}
async function savePricing(){
    const button =
        document.getElementById(
            "save-pricing-button"
        );
    button.disabled = true;
    button.textContent = "Saving...";
    try{
        const response =
            await fetch(
                PRICING_API,
                {
                    method: "POST",
                    body: JSON.stringify({
                        type: "pricing",
                        config: pricingConfig,
                        revision: pricingRevision
                    })
                }
            );
        if(!response.ok){
            throw new Error(
                "Failed to save pricing"
            );
        }
        const data =
            await response.json();
        if(!data.success){
            throw new Error(
                data.error ||
                "Failed to save pricing"
            );
        }
        pricingRevision =
    Number(
        data.revision
    ) || pricingRevision;
        hasUnsavedChanges = false;
        const status =
            document.getElementById(
                "save-status"
            );
        status.textContent =
            "✓ Saved";
        status.className =
            "save-status saved";
        console.log(
            "Pricing saved:",
            data
        );
    }
    catch(error){
        console.error(
            "Could not save pricing:",
            error
        );
        const status =
            document.getElementById(
                "save-status"
            );
        status.textContent =
            "⚠ Save failed";
        status.className =
            "save-status error";
    }
    finally{
        button.disabled = false;
        button.textContent =
            "Save Changes";
    }
}
function resetPricing(){
    const confirmed =
        window.confirm(
            "Reset all pricing settings and rooms to the defaults?"
        );
    if(!confirmed){
        return;
    }
    pricingConfig =
        structuredClone(
            defaultPricingConfig
        );
    document
        .getElementById(
            "amount-to-allocate"
        )
        .value =
        pricingConfig
            .amountToAllocate;
    renderPointSettings();
    renderRooms();
    markUnsaved();
    updatePricing();
}
function startPricingSync(){
    if(pricingSyncTimer){
        clearInterval(
            pricingSyncTimer
        );
    }
    pricingSyncTimer =
        setInterval(
            checkForPricingUpdates,
            2000
        );
}
function checkForPricingUpdates(){
    const callbackName =
        "pricingSyncCallback_" +
        Date.now();
    const script =
        document.createElement(
            "script"
        );
    window[callbackName] =
        function(data){
            try{
                if(
                    !data.success
                ){
                    return;
                }
                const serverRevision =
                    Number(
                        data.revision
                    ) || 0;
                /*
                    Nothing has changed.
                */
                if(
                    serverRevision <=
                    pricingRevision
                ){
                    return;
                }
                /*
                    Someone else saved
                    a newer version.
                */
                pricingRevision =
                    serverRevision;
                if(data.config){
                    pricingConfig =
                        data.config;
                }
                hasUnsavedChanges =
                    false;
                document
                    .getElementById(
                        "amount-to-allocate"
                    )
                    .value =
                    pricingConfig
                        .amountToAllocate;
                renderPointSettings();
                renderRooms();
                updatePricing();
                const status =
                    document.getElementById(
                        "save-status"
                    );
                status.textContent =
                    "✓ Updated from another moderator";
                status.className =
                    "save-status saved";
                console.log(
                    "Loaded newer pricing revision:",
                    pricingRevision
                );
            }
            finally{
                delete window[
                    callbackName
                ];
                script.remove();
            }
        };
    script.src =
        PRICING_API +
        "?type=pricing" +
        "&callback=" +
        callbackName +
        "&t=" +
        Date.now();
    document.body.appendChild(
        script
    );
}
/* ==========================================
   Formatting
========================================== */
function formatMoney(
    value
){
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(
        value
    );
}
function formatPoints(
    value
){
    if(
        Number.isInteger(
            value
        )
    ){
        return String(
            value
        );
    }
    return value.toFixed(
        1
    );
}
function escapeHtml(
    value
){
    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}
function loadPricing(){
    return new Promise(
        (resolve, reject) => {
            const callbackName =
                "pricingCallback_" +
                Date.now();
            const script =
                document.createElement(
                    "script"
                );
            window[callbackName] =
                function(data){
                    try{
if(
    data.success &&
    data.config
){
    pricingConfig =
        data.config;
}

if(data.success){

    pricingRevision =
        Number(
            data.revision
        ) || 0;

}
                        document
                            .getElementById(
                                "amount-to-allocate"
                            )
                            .value =
                            pricingConfig
                                .amountToAllocate;
                        renderPointSettings();
                        renderRooms();
                        updatePricing();
                        resolve();
                    }
                    finally{
                        delete window[
                            callbackName
                        ];
                        script.remove();
                    }
                };
            script.onerror =
                function(){
                    console.error(
                        "Could not load pricing."
                    );
                    delete window[
                        callbackName
                    ];
                    script.remove();
                    /*
                        Still display the defaults.
                    */
                    renderPointSettings();
                    renderRooms();
                    updatePricing();
                    reject(
                        new Error(
                            "Could not load pricing"
                        )
                    );
                };
            script.src =
                PRICING_API +
                "?type=pricing" +
                "&callback=" +
                callbackName +
                "&t=" +
                Date.now();
            document.body.appendChild(
                script
            );
        }
    );
}
/* ==========================================
   Start
========================================== */
if(
    document.readyState ===
    "loading"
){
    document.addEventListener(
        "DOMContentLoaded",
        initializePricing
    );
} else {
    initializePricing();
}
