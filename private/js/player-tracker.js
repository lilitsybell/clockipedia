console.log("player-tracker.js loaded");


/* ==========================================
   Google Sheet Data
========================================== */

const PLAYER_TRACKER_URL =
    "https://script.google.com/macros/s/AKfycbwX_AkorFBwswE-liivQCX7Cxya9OfJVho6uttZHsO1Ou-yu6jqKmvmyk1Dj4dV4tY/exec";


let trackerGames = [];


/* ==========================================
   Initialize
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializePlayerTracker
);


async function initializePlayerTracker(){

    try{

        await loadTrackerGames();

        updateSummaryCards();

    }
    catch(error){

        console.error(
            "Player Tracker failed:",
            error
        );

    }

}


/* ==========================================
   Load Games
========================================== */

async function loadTrackerGames(){

    const response =
        await fetch(PLAYER_TRACKER_URL);

    if(!response.ok){

        throw new Error(
            "Failed to load player tracker data"
        );

    }

    trackerGames =
        await response.json();

    console.log(
        "Player tracker games:",
        trackerGames
    );

}


/* ==========================================
   Summary Cards
========================================== */

function updateSummaryCards(){

    const totalGames =
        trackerGames.length;


    /* ------------------------------------------
       Games Tracked
    ------------------------------------------ */

    document
        .querySelector("#gamesTracked")
        .textContent =
        totalGames;


    /* ------------------------------------------
       Win Rate
    ------------------------------------------ */

    const wins =
        trackerGames.filter(
            game =>
                game.result === "Win"
        ).length;

    const winRate =
        getPercentage(
            wins,
            totalGames
        );

    document
        .querySelector("#winRate")
        .textContent =
        winRate;


    /* ------------------------------------------
       Correct Demon Rate
    ------------------------------------------ */

    const statedDemonGames =
        trackerGames.filter(
            game =>
                game.demon === "Correct" ||
                game.demon === "Wrong"
        );

    const correctDemonGames =
        statedDemonGames.filter(
            game =>
                game.demon === "Correct"
        ).length;

    const demonRate =
        getPercentage(
            correctDemonGames,
            statedDemonGames.length
        );

    document
        .querySelector("#demonRate")
        .textContent =
        demonRate;


    /* ------------------------------------------
       Evil Block Vote Rate
    ------------------------------------------ */

    const goodVotes =
        trackerGames.reduce(
            (total, game) =>
                total +
                Number(game.goodBlockVotes || 0),
            0
        );

    const evilVotes =
        trackerGames.reduce(
            (total, game) =>
                total +
                Number(game.evilBlockVotes || 0),
            0
        );

    const totalVotes =
        goodVotes + evilVotes;

    const evilVoteRate =
        getPercentage(
            evilVotes,
            totalVotes
        );

    document
        .querySelector("#evilVoteRate")
        .textContent =
        evilVoteRate;

}


/* ==========================================
   Helpers
========================================== */

function getPercentage(
    amount,
    total
){

    if(total === 0){
        return "—";
    }

    const percentage =
        (amount / total) * 100;

    return (
        percentage.toFixed(1) +
        "%"
    );

}
