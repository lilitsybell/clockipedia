console.log(
    "Convention pricing calculator loaded"
);
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
            shared: 0
        },
        kitchens: {
            full: 4,
            kitchenette: 3,
            none: 0
        },
        sharing: {
            1: 8,
            2: 5,
            3: 2,
            4: 0,
            5: -2,
            6: -4
        }
    },
    rooms: [
        {
            id: "salzburg",
            name: "Salzburg",
            bathroom: "private",
            kitchen: "kitchenette",
            people: 1,
            beds: [
                {
                    id: "salzburg-queen",
                    type: "queen"
                }
            ]
        },
        {
            id: "bergen",
            name: "Bergen",
            bathroom: "private",
            kitchen: "kitchenette",
            people: 2,
            beds: [
                {
                    id: "bergen-queen",
                    type: "queen"
                },
                {
                    id: "bergen-rollaway",
                    type: "twinRollaway"
                }
            ]
        },
        {
            id: "trondheim",
            name: "Trondheim",
            bathroom: "private",
            kitchen: "kitchenette",
            people: 3,
            beds: [
                {
                    id: "trondheim-twin-1",
                    type: "twin"
                },
                {
                    id: "trondheim-twin-2",
                    type: "twin"
                },
                {
                    id: "trondheim-rollaway",
                    type: "twinRollaway"
                }
            ]
        },
        {
            id: "stockholm",
            name: "Stockholm",
            bathroom: "private",
            kitchen: "kitchenette",
            people: 3,
            beds: [
                {
                    id: "stockholm-king",
                    type: "king"
                },
                {
                    id: "stockholm-full",
                    type: "full"
                },
                {
                    id: "stockholm-twin",
                    type: "twin"
                }
            ]
        },
        {
            id: "oslo",
            name: "Oslo",
            bathroom: "private",
            kitchen: "kitchenette",
            people: 2,
            beds: [
                {
                    id: "oslo-king",
                    type: "king"
                },
                {
                    id: "oslo-rollaway",
                    type: "twinRollaway"
                }
            ]
        },
        {
            id: "gothenburg",
            name: "Gothenburg",
            bathroom: "shared",
            kitchen: "none",
            people: 2,
            beds: [
                {
                    id: "gothenburg-queen-1",
                    type: "queen"
                },
                {
                    id: "gothenburg-queen-2",
                    type: "queen"
                }
            ]
        },
        {
            id: "innsbruck",
            name: "Innsbruck",
            bathroom: "private",
            kitchen: "full",
            people: 2,
            beds: [
                {
                    id: "innsbruck-queen",
                    type: "queen"
                },
                {
                    id: "innsbruck-sofa",
                    type: "fullSofa"
                }
            ]
        },
        {
            id: "tv-room",
            name: "TV Room",
            bathroom: "shared",
            kitchen: "none",
            people: 1,
            beds: [
                {
                    id: "tv-room-sofa",
                    type: "queenSofa"
                }
            ]
        },
        {
            id: "lillestrom",
            name: "Lillestrom",
            bathroom: "shared",
            kitchen: "none",
            people: 1,
            beds: [
                {
                    id: "lillestrom-sofa",
                    type: "queenSofa"
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
    shared: "Shared Bathroom"
};
const kitchenLabels = {
    full: "Full Kitchen",
    kitchenette: "Kitchenette",
    none: "None"
};
const sharingLabels = {
    1: "Private Room",
    2: "2 People",
    3: "3 People",
    4: "4 People",
    5: "5 People",
    6: "6+ People"
};
/* ==========================================
   State
========================================== */
let pricingConfig =
    structuredClone(
        defaultPricingConfig
    );
let hasUnsavedChanges = false;
/* ==========================================
   Initialization
========================================== */
function initializePricing(){
    renderPointSettings();
    renderRooms();
    updatePricing();
    setupGlobalControls();
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
        createPeopleInput(
            room
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
function createPeopleInput(
    room
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
        "People in Room";
    const input =
        document.createElement(
            "input"
        );
    input.type = "number";
    input.min = "1";
    input.step = "1";
    input.value =
        room.people;
    input.addEventListener(
        "input",
        () => {
            room.people =
                Math.max(
                    1,
                    Math.round(
                        Number(
                            input.value
                        ) || 1
                    )
                );
            roomChanged();
        }
    );
    wrapper.append(
        label,
        input
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
    people
){
    if(people >= 6){
        return "6";
    }
    return String(
        Math.max(
            1,
            people
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
            room.people
        );
    const sharingPoints =
        pricingConfig.points
            .sharing[
                sharingKey
            ] || 0;
    return (
        bedPoints +
        bathroomPoints +
        kitchenPoints +
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
    result.rows.forEach(
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
}
/*
   For now this only changes the UI.
   In the next step we will replace this
   function with the Google Apps Script
   shared save request.
*/
function savePricing(){
    hasUnsavedChanges =
        false;
    const status =
        document.getElementById(
            "save-status"
        );
    status.textContent =
        "✓ Saved";
    status.className =
        "save-status saved";
    console.log(
        "Pricing config:",
        pricingConfig
    );
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
