const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3AggregatorAddress
    const sendValue = ethers.utils.parseEther("1") // 1 ETH

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
    // OUTDATED VERSION
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

    describe("fund", async function () {
        it("Fails if you do not send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!",
            )
        })
        // it("Updated the amount funded data structure", async function () {
        //     await fundMe.fund({ value: sendValue })
        //     const response = await fundMe.addressToAmountFunded(deployer)
        //     assert.equal(response.toString(), sendValue.toString())
        // })
    })
})
