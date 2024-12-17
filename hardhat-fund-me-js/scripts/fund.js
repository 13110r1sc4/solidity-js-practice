const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    // const { deployer } = await getNamedAccounts()
    deployer = (await getNamedAccounts()).deployer
    // const fundMe = await ethers.getContract("FundMe", deployer)
    const FundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMeDeployment = await deployments.get("FundMe")
    fundMe = FundMeFactory.attach(fundMeDeployment.address)
    console.log("Funding contract...")
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("0.1"),
    })
    await transactionResponse.wait(1)
    console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
