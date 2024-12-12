const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3AggregatorAddress

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])

        // Get deployed contract addresses
        const mockV3AggregatorDeployment =
            await deployments.get("MockV3Aggregator")
        mockV3AggregatorAddress = mockV3AggregatorDeployment.address

        // Get contract factories and attach to deployed contracts
        const FundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = FundMeFactory.attach(fundMeDeployment.address)
    })

    describe("constructor", function () {
        it("sets the aggregator addresses directly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3AggregatorAddress)
        })
    })
    // let mockV3Aggregator
    // beforeEach(async function () {
    //     deployer = (await getNamedAccounts()).deployer
    //     await deployments.fixture(["all"])
    //     fundMe = await ethers.getContract("FundMe", deployer)
    //     mockV3Aggregator = await ethers.getContract(
    //         "MockV3Aggregator",
    //         deployer,
    //     )
    // })

    // describe("constructor", async function () {
    //     it("sets the aggregator addresses directly", async function () {
    //         const response = await fundMe.priceFeed()
    //         assert.equal(response, mockV3Aggregator.address)
    //     })
    // })
})
