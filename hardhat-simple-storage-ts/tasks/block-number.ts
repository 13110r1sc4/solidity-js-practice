import { task } from "hardhat/config"

export default task("block-number", "Prints the currenet clock number").setAction(
    async (taskArgs, hre) => {
        // no need to say function in js
        // hre can access packages from hardhat
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number: ${blockNumber}`)
    },
)
