require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("./tasks/donations-tasks.js");

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
