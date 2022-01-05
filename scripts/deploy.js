const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [signer] = await ethers.getSigners(); //получаем первый аккаунт из hardhat блокчейна

  const Donations = await ethers.getContractFactory("Donations", signer);
  const donations = await Donations.deploy(); //в deploy можно передавать аргументы, которые попадут в конструктор
  await donations.deployed();
  //у donations можно вызывать функции смарт-контракта;
  console.log(donations.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
