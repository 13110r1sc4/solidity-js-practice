const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

// ONLY RUNS ON DEVELOPMENT CHAINS
// describe("FundMe", function () {
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
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
                  const response = await fundMe.s_priceFeed()
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
                  const response =
                      await fundMe.getAddressToAmountFunded(deployer)
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
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  // const { gasUsed, effectiveGasPrice } = transactionReceipt
                  // const gasCost = BigInt(gasUsed) * BigInt(effectiveGasPrice)
                  const gasCost =
                      transactionReceipt.gasUsed * transactionReceipt.gasPrice

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance + startingDeployerBalance,
                      endingDeployerBalance + gasCost,
                  )
              })
              it("Allows us to withdraw with multiple funders", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const gasCost =
                      transactionReceipt.gasUsed * transactionReceipt.gasPrice
                  // assert and make dure the funders are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
              it("Only allows the owner to withdrawn", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract =
                      await fundMe.connect(attacker)
                  await expect(
                      attackerConnectedContract.withdraw(),
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
              it("Cheaper withdraw test", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const gasCost =
                      transactionReceipt.gasUsed * transactionReceipt.gasPrice
                  // assert and make dure the funders are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
          })
      })
