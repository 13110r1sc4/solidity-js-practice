const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    log("Deploying FunWithStorage and waiting for confirmations...")
    const funWithStorage = await deploy("FunWithStorage", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(funWithStorage.address, [])
    }

    log("Logging storage...")
    for (let i = 0; i < 10; i++) {
        log(
            `Location ${i}: ${await ethers.provider.getStorage(
                funWithStorage.address,
                i,
            )}`,
        )
    }

    // Use this to trace
    // const trace = await network.provider.send("debug_traceTransaction", [
    //     funWithStorage.transactionHash,
    // ])
    // for (let structLog of trace.structLogs) {
    //     if (structLog.op === "SSTORE") {
    //         console.log(structLog);
    //     }
    // }

    // const firstElementLocation = ethers.keccak256(
    //     "0x0000000000000000000000000000000000000000000000000000000000000002"
    // );
    // const arrayElement = await ethers.provider.getStorage(
    //     funWithStorage.address,
    //     firstElementLocation
    // );
    // log(`Location ${firstElementLocation}: ${arrayElement}`);

    // Can you write a function that finds the storage slot of the arrays and mappings?
    // And then find the data in those slots?
}

module.exports.tags = ["storage"]
