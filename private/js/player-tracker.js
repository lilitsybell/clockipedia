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
buildCharts();

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
/* ==========================================
   Charts
========================================== */

function buildCharts(){

    buildResultsChart();
    buildDemonChart();
    buildDeadVoteChart();
    buildBlockVoteChart();

}


/* ==========================================
   Game Results
========================================== */

function buildResultsChart(){

    const wins =
        trackerGames.filter(
            game =>
                game.result === "Win"
        ).length;

    const losses =
        trackerGames.filter(
            game =>
                game.result === "Loss"
        ).length;


    createPieChart(
        "resultsChart",

        [
            "Wins",
            "Losses"
        ],

        [
            wins,
            losses
        ],

        [
            "#8EA742",
            "#b52323"
        ]
    );

}


/* ==========================================
   Demon Candidate
========================================== */

function buildDemonChart(){

    const correct =
        trackerGames.filter(
            game =>
                game.demon === "Correct"
        ).length;

    const wrong =
        trackerGames.filter(
            game =>
                game.demon === "Wrong"
        ).length;

    const none =
        trackerGames.filter(
            game =>
                game.demon === "None"
        ).length;


    createPieChart(
        "demonChart",

        [
            "Correct",
            "Wrong",
            "No Candidate"
        ],

        [
            correct,
            wrong,
            none
        ],

        [
            "#8EA742",
            "#b52323",
            "#959799"
        ]
    );

}


/* ==========================================
   Dead Vote
========================================== */

function buildDeadVoteChart(){

    const evil =
        trackerGames.filter(
            game =>
                game.deadVote === "Evil"
        ).length;

    const good =
        trackerGames.filter(
            game =>
                game.deadVote === "Good"
        ).length;

    const unused =
        trackerGames.filter(
            game =>
                game.deadVote === "Unused"
        ).length;


    createPieChart(
        "deadVoteChart",

        [
            "Evil",
            "Good",
            "Unused"
        ],

        [
            evil,
            good,
            unused
        ],

        [
            "#b52323",
            "#2f6fc4",
            "#959799"
        ]
    );

}


/* ==========================================
   Block Votes
========================================== */

function buildBlockVoteChart(){

    const goodVotes =
        trackerGames.reduce(
            (total, game) =>
                total +
                Number(
                    game.goodBlockVotes || 0
                ),
            0
        );

    const evilVotes =
        trackerGames.reduce(
            (total, game) =>
                total +
                Number(
                    game.evilBlockVotes || 0
                ),
            0
        );


    createPieChart(
        "blockVoteChart",

        [
            "Evil",
            "Good"
        ],

        [
            evilVotes,
            goodVotes
        ],

        [
            "#b52323",
            "#2f6fc4"
        ]
    );

}


/* ==========================================
   Create Pie Chart
========================================== */

function createPieChart(
    canvasID,
    labels,
    data,
    colors
){

    const canvas =
        document.getElementById(
            canvasID
        );

    if(!canvas){
        return;
    }


    new Chart(
        canvas,
        {

            type:"doughnut",

            data:{

                labels:labels,

                datasets:[
                    {

                        data:data,

                        backgroundColor:colors,

                        borderWidth:0,

                        hoverOffset:5

                    }
                ]

            },


            options:{

                responsive:true,

                maintainAspectRatio:false,

                cutout:"68%",

                plugins:{

                    legend:{

                        position:"bottom",

                        labels:{

                            usePointStyle:true,

                            pointStyle:"circle",

                            boxWidth:8,

                            boxHeight:8,

                            padding:18,

                            font:{
                                size:12
                            }

                        }

                    },

                    tooltip:{

                        callbacks:{

                            label:function(context){

                                const values =
                                    context.dataset.data;

                                const total =
                                    values.reduce(
                                        (sum, value) =>
                                            sum + value,
                                        0
                                    );

                                const value =
                                    context.raw;

                                const percentage =
                                    total
                                        ? (
                                            value /
                                            total *
                                            100
                                        ).toFixed(1)
                                        : 0;

                                return (
                                    context.label +
                                    ": " +
                                    value +
                                    " (" +
                                    percentage +
                                    "%)"
                                );

                            }

                        }

                    }

                }

            }

        }
    );

}
