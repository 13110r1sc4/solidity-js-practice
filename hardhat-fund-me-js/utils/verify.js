// imports
const { run } = require("hardhat") // we do it from hh, see package.json, hh knows stuff more

// async fun
const verify = async (contractAddress, args) => {
    // to verify with etherscan. need etherscan api token (put in .env)
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("Already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    } // we do this bcs maybe the contract has been already verified so we wont
}

module.exports = { verify }
