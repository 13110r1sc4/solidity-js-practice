// imports
const { ethers, run, network } = require("hardhat"); // we do it from hh, see package.json, hh knows stuff more

// async fun

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.waitForDeployment();

  // whats the private key?
  // url? is by default the hardhat network
  console.log(`Deploying contract to: ${await simpleStorage.getAddress()}`);

  // what happens when we deploy to our hardhat network (local)? we cannot use verify. see config.js to see the default network
  // if we wan tto verify, we can you sepolia, not hardhat which runs locally
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block txes...");
    await simpleStorage.deploymentTransaction().wait(6);
    const contractAddress = await simpleStorage.getAddress();
    await verify(contractAddress, []); // dont use getAddress(), it is a promis, need string isntead
  }
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is: ${currentValue}`);

  //update the current value
  const transactionRepsonse = await simpleStorage.store(7);
  await transactionRepsonse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
}

async function verify(contractAddress, args) {
  // to verify with etherscan. need etherscan api token (put in .env)
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("Already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  } // we do this bcs maybe the contract has been already verified so we wont
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
