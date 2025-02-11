// in front end cannot use require
// better use import
// NB: if we restart the local node, we have to reset the MM account in the advanced settings,
// because MM does not know the node is starting from zero -> so that they are in sync about the nonce

import { ethers } from "./ethers-6.7.0.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

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
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount} ETH ...`)
    if (typeof window.ethereum !== "undefined") {
        // provider for conenction to bc
        // singer / wallet / someone with some gas
        //
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.parseEther(ethAmount),
            })
            // hey, wait for this TX to finish
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }

        // console.log(signer) // signer is the account connected (public address)
    }
}
// create function to listen for the transaction to be mined: (the first works as well)

// function listenForTransactionMine(transactionResponse, provider) {
//     // is not async because
//     console.log(`Mining ${transactionResponse.hash}...`)
//     provider.once(transactionResponse.hash, (transactionReceipt) => {
//         console.log(
//             `Completed with ${transactionReceipt.confirmations} confirmations`,
//         )
//     }) // the second argument is an anonymous function
//     // create a listener for the blockchain
// }

// async function listenForTransactionMine(transactionResponse, provider) {
//     console.log(`Mining ${transactionResponse.hash}...`)
//     return new Promise((resolve, reject) => {
//         const transactionReceipt = await provider.waitForTransaction(
//             transactionResponse.hash,
//         )
//         console.log(
//             `Completed with ${transactionReceipt.confirmations} confirmations`,
//         )
//     })
// }

// async function listenForTransactionMine(transactionResponse, provider) {
//     console.log(`Mining ${transactionResponse.hash}...`)
//     return new Promise((resolve, reject) => {
//         provider.once(transactionResponse.hash, (transactionReceipt) => {
//             console.log(
//                 `Completed with ${transactionReceipt.confirmations} confirmations`,
//             )
//             resolve(transactionReceipt)
//         })
//     })
// }

// NB: You're seeing that message because transactionReceipt.confirmations
// is likely a function instead of a numeric value. This is a change in ethers.js v6,
// where confirmations is now an async function rather than a direct number.

async function listenForTransactionMine(transactionResponse) {
    console.log(`Mining ${transactionResponse.hash}...`)
    const transactionReceipt = await transactionResponse.wait()

    // Fix: Await the confirmations method
    const confirmations = await transactionReceipt.confirmations()

    console.log(`Completed with ${confirmations} confirmations`)
    return transactionReceipt
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("withdrawing...")
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

// TRANSACTION REVERTS, FIND SOLUTION
// withdraw
