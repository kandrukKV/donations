const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donations testing", function () {
  const TEST_AMOUNT = 50;

  it("Should return balance = 0", async function () {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.deploy();
    expect(await donations.getBalance()).to.equal(0);
  });

  it("Should return balance = 50 after transaction", async function () {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.deploy();
    const [account] = await ethers.getSigners();
    const tx = {
      to: donations.address,
      value: TEST_AMOUNT,
    };
    await account.sendTransaction(tx);
    expect(await donations.getBalance()).to.equal(TEST_AMOUNT);
  });

  it("Non-owner can't make transfer", async function () {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.deploy();
    const [owner, acc2, acc3] = await ethers.getSigners();
    const tx = {
      to: donations.address,
      value: TEST_AMOUNT,
    };
    await owner.sendTransaction(tx);

    await expect(
      donations.connect(acc2).withdrawAll(acc3.address)
    ).to.be.revertedWith("You aren't owner");
  });

  it("Owner can make transfer", async function () {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.deploy();
    const [owner, acc2, acc3] = await ethers.getSigners();
    const tx = {
      to: donations.address,
      value: TEST_AMOUNT,
    };
    await owner.sendTransaction(tx);
    await donations.withdrawAll(acc3.address);
    expect(await donations.getBalance()).to.equal(0);
  });

  it("Incoming transaction was saving", async function () {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.deploy();
    const [owner, acc2] = await ethers.getSigners();

    expect(await donations.getTransfersCount()).to.equal(0);

    const tx = {
      to: donations.address,
      value: TEST_AMOUNT,
    };
    await acc2.sendTransaction(tx);
    expect(await donations.getTransfersCount()).to.equal(1);
  });

  it("Can't find this transfer", async function () {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.deploy();
    await expect(donations.getTransfer(0)).to.be.revertedWith(
      "Can't find this transfer"
    );
  });
});
