// in front end cannot use require
// better use import

async function connect() {
    // can write here js
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        document.getElementById("connectButton").innerHTML = "Connected!"
    } else {
        console.log("No metamask")
        document.getElementById("connectButton").innerHTML =
            "Please install meatmask"
    }
}

// fund
async function fund(ethAmount) {
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
    }
}

// withdraw
