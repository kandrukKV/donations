require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const abi = require("./artifacts/contracts/Donations.sol/Donations.json").abi;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

//npx hardhat contract-balance --network rinkeby
task("contract-balance", "Prints an contract's balance").setAction(
  async (_, hre) => {
    const balance = await hre.ethers.provider.getBalance(
      process.env.CONTRACT_ADDRESS
    );
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
  }
);

//npx hardhat account-balance --address 0x57CE70B81439E21Bf80FC4691807bcBb3288aBb1 --network rinkeby
task("account-balance", "Prints an accounts's balance")
  .addParam("address", "The transaction's address")
  .setAction(async ({ address }, hre) => {
    const balance = await hre.ethers.provider.getBalance(address);
    console.log("Account balance:", hre.ethers.utils.formatEther(balance));
  });

//npx hardhat get-transaction-count --network rinkeby
task("get-transaction-count", "Prints the number of transactions").setAction(
  async (_, hre) => {
    const [account] = await hre.ethers.getSigners();
    const contractInstance = new hre.ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      abi,
      account
    );
    const res = await contractInstance.getTransfersCount();
    console.log("TransferCount:", res);
  }
);

//npx hardhat get-transaction --id 0 --network rinkeby
task("get-transaction", "Prints the transaction by number")
  .addParam("id", "The transaction's id")
  .setAction(async ({ id }, hre) => {
    const [account] = await hre.ethers.getSigners();
    const contractInstance = new hre.ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      abi,
      account
    );

    const res = await contractInstance.getTransfer(id);
    console.log(res);
  });

//npx hardhat get-transactions --network rinkeby
task(
  "get-transactions",
  "Prints all incoming transactions in contract"
).setAction(async (_, hre) => {
  const [account] = await hre.ethers.getSigners();
  const contractInstance = new hre.ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    abi,
    account
  );
  const res = await contractInstance.getTransfers();
  console.log(res);
});

// npx hardhat send-transaction --amount 0.1 --network rinkeby
task("send-transaction")
  .addParam("amount", "Amount value")
  .setAction(async ({ amount }, hre) => {
    const [account] = await hre.ethers.getSigners();
    const tx = {
      to: process.env.CONTRACT_ADDRESS,
      value: hre.ethers.utils.parseEther(amount),
    };
    const transaction = await account.sendTransaction(tx);
    await transaction.wait();
  });

task("withdraw", "Withdraw all money")
  .addParam("address", "Wallets's address")
  .setAction(async ({ address }, hre) => {
    const [account] = await hre.ethers.getSigners();
    const contractInstance = new hre.ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      abi,
      account
    );
    const transaction = await contractInstance.withdrawAll(address);
    await transaction.wait();
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.PRIVATE_ACC_KEY],
    },
    hardhat: {
      chainId: 31337,
    },
  },
};
