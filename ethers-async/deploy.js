import { ethers } from "ethers";
import fs from "fs-extra";
import "dotenv/config";

async function main() {
  // Initialize the provider
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Read and decrypt the encrypted wallet JSON
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  const wallet = await ethers.Wallet.fromEncryptedJson(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD,
  );

  // Connect the wallet to the provider
  const connectedWallet = wallet.connect(provider);

  // Read the contract's ABI and binary
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8",
  );

  // Create a contract factory
  const contractFactory = new ethers.ContractFactory(
    abi,
    binary,
    connectedWallet,
  );

  // Deploy the contract
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();
  console.log(`Contract deployed to ${contract.target}`);

  // Interact with the contract
  console.log("Retrieving current favorite number...");
  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavoriteNumber}`);

  console.log("Updating favorite number...");
  const transactionResponse = await contract.store(7);
  await transactionResponse.wait();
  const newFavoriteNumber = await contract.retrieve();
  console.log(`New Favorite Number: ${newFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
