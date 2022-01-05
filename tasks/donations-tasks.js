// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

//npx hardhat contract-balance --network rinkeby
task("contract-balance", "Prints an contract's balance").setAction(async () => {
  const balance = await ethers.provider.getBalance(
    process.env.CONTRACT_ADDRESS
  );
  console.log("Contract balance:", ethers.utils.formatEther(balance));
});

//npx hardhat account-balance --address 0x57CE70B81439E21Bf80FC4691807bcBb3288aBb1 --network rinkeby
task("account-balance", "Prints an accounts's balance")
  .addParam("address", "The transaction's address")
  .setAction(async ({ address }) => {
    const balance = await ethers.provider.getBalance(address);
    console.log("Account balance:", ethers.utils.formatEther(balance));
  });

//npx hardhat get-transaction-count --network rinkeby
task("get-transaction-count", "Prints the number of transactions").setAction(
  async () => {
    const Donations = await ethers.getContractFactory("Donations");
    const [account] = await ethers.getSigners();
    const contractInstance = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      Donations.interface,
      account
    );
    const res = await contractInstance.getTransfersCount();
    console.log("TransferCount:", res);
  }
);

//npx hardhat get-transaction --id 0 --network rinkeby
task("get-transaction", "Prints the transaction by number")
  .addParam("id", "The transaction's id")
  .setAction(async ({ id }) => {
    const Donations = await ethers.getContractFactory("Donations");
    const [account] = await ethers.getSigners();
    const contractInstance = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      Donations.interface,
      account
    );

    const res = await contractInstance.getTransfer(id);
    console.log(res);
  });

//npx hardhat get-transactions --network rinkeby
task(
  "get-transactions",
  "Prints all incoming transactions in contract"
).setAction(async () => {
  const Donations = await ethers.getContractFactory("Donations");
  const [account] = await ethers.getSigners();
  const contractInstance = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    Donations.interface,
    account
  );
  const res = await contractInstance.getTransfers();
  console.log(res);
});

// npx hardhat send-transaction --amount 0.1 --network rinkeby
task("send-transaction")
  .addParam("amount", "Amount value")
  .setAction(async ({ amount }) => {
    const [account] = await ethers.getSigners();
    const tx = {
      to: process.env.CONTRACT_ADDRESS,
      value: ethers.utils.parseEther(amount),
    };
    const transaction = await account.sendTransaction(tx);
    await transaction.wait();
  });

// npx hardhat withdraw --address 0x57CE70B81439E21Bf80FC4691807bcBb3288aBb1 --network rinkeby
task("withdraw", "Withdraw all money")
  .addParam("address", "Wallets's address")
  .setAction(async ({ address }) => {
    const Donations = await ethers.getContractFactory("Donations");
    const [account] = await ethers.getSigners();
    const contractInstance = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      Donations.interface,
      account
    );
    const transaction = await contractInstance.withdrawAll(address);
    await transaction.wait();
  });

module.exports = {};
