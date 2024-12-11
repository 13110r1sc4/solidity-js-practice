// function deployFunc(hre) {
//     console.log("Hi!")
// }
// module.exports.defauls = deployFunc() // this is the same as the line below

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if cahinId is X use adderss Y, else use A

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    // what if i want to deploy locally and not to sepolia for instance? or polygon? -> hardhat, how? mocking

    // when going for locallhost or hardhat network we want to use a mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    })
    log("--------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
