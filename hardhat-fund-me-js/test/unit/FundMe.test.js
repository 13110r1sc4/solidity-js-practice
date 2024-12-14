const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", function () {
    let fundMe
    let deployer
    let mockV3AggregatorAddress
    const sendValue = ethers.parseEther("1") // 1 ETH

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
        it("Updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async function () {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.getFunder(0)
            assert.equal(funder, deployer)
        })
    })
    describe("withdraw", async function () {
        // DOES NOT PASS!
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })
        it("withdraw ETH from a single founder", async function () {
            // arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address,
            )
            const startingDeployerBalance =
                await fundMe.provider.getBalance(deployer)
            // act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address,
            )
            const endingDeployerBalance =
                await fundMe.provider.getBalance(deployer)
            // assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance),
                endingDeployerBalance.add(gasCost).toString(),
            )
        })
    })
})
