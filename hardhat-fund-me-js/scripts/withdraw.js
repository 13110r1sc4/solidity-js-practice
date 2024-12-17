const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    deployer = (await getNamedAccounts()).deployer
    const FundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMeDeployment = await deployments.get("FundMe")
    fundMe = FundMeFactory.attach(fundMeDeployment.address)
    console.log("Funding...")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Got it back")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
