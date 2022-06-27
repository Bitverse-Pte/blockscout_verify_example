require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("@nomiclabs/hardhat-web3");


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
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
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    teleport: {
      // url: "https://teleport-localvalidator.qa.davionlabs.com",
      url:"http://47.242.41.175:8545",
      accounts: [
        "6395A7C842A08515961888D21D72F409B61FBCE96AF1E520384E375F301A8297",
      ],
    },
    xdai: {
      url: "https://rpc.gnosischain.com",
      accounts: [
        "6395A7C842A08515961888D21D72F409B61FBCE96AF1E520384E375F301A8297",
      ],
    },
    sokol: {
      url: "https://sokol.poa.network",
      accounts: [
        "6395A7C842A08515961888D21D72F409B61FBCE96AF1E520384E375F301A8297",
      ],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      teleport: "dasd",
      sokol:"asd"
    },
    customChains: [
      {
        network: "teleport",
        chainId: 7001,
        urls: {
          // apiURL: "https://blockscout.qa.davionlabs.com/api",
          apiURL: "http://47.242.41.175:4000/api",
          browserURL: "https://blockscout.qa.davionlabs.com/"
        }
      },
      {
       network: "xdai",
          chainId: 100,
          urls: {
            apiURL: "https://blockscout.com/xdai/mainnet/api",
            browserURL: "https://blockscout.com/xdai/mainnet",
          },
        },
      {
        network: "sokol",
        chainId: 77,
        urls: {
          apiURL: "https://blockscout.com/poa/sokol/api",
          browserURL: "https://blockscout.com/poa/sokol",
        },
      }


    ]
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};
