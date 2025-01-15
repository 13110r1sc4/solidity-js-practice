// in front end cannot use require
// better use import
import { ethers } from "./ethers-6.7.0.esm.min.js"
import { abi } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
connectButton.onclick = connect
fundButton.onclick = fund

// console.log(ethers)

async function connect() {
    // can write here js
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!"
    } else {
        console.log("No metamask")
        connectButton.innerHTML = "Please install meatmask"
    }
}

// fund
async function fund(ethAmount) {
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // provider for conenction to bc
        // singer / wallet / someone with some gas
        //
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = provider.getSigner()
        const contract = "" // ?
        console.log(signer) // signer is the account connected (public address)
    }
}

// withdraw
