const { getNamedAccounts, network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

// we want to run our describe only if we are on a TEST NET

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.parseEther("0.05")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              const FundMeFactory = await ethers.getContractFactory("FundMe")
              const fundMeDeployment = await deployments.get("FundMe")
              fundMe = FundMeFactory.attach(fundMeDeployment.address)
          })

          it("Allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.target,
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
