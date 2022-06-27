**Smart Contract on Hardhat Verify**

hardhat.config.js

```jsx
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
		// network config
    teleport: {
      // url: "https://teleport-localvalidator.qa.davionlabs.com",
			// teleport rpc url
      url:"http://47.242.41.175:8545",
			// signers list,including account's private key.
      accounts: [
        "xxxxxxxxxxxxxxxxxxxxx",
      ],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
	// etherscan config 
  etherscan: {
    apiKey: {
			// now blockscout dont support the apikey generation
			// so just use random string.
			// and it is requried!
      teleport: "dasd"
    },
			// blockscout also dont have the teleport support yet,
			// so we need to use the "customChains" config. 
    customChains: [
      {
				// network name,must equal to the "network" settings.
        network: "teleport",
        chainId: 7001,
        urls: {
          // apiURL: "https://blockscout.qa.davionlabs.com/api",
					// blockscout's api url.
          apiURL: "http://47.242.41.175:4000/api",
					
          browserURL: "https://blockscout.qa.davionlabs.com/"
        }
      }
    ]
  },

};
```

**Contract Deploy**

deploy-script.js

```jsx
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { web3 } = require("hardhat");

async function main() {

	// contract deploy
  const proxy_address = "0xcb0eccd1d9c9250855175d849f3efe122c12c0bd";
	// get the abi from the contractFactory
  const Valut = await hre.ethers.getContractFactory("NFT");
	// pre-deploy the contract with the constructor arguments.
  const valut = await Valut.deploy(proxy_address,
																	 hre.ethers.utils.parseEther("0.15"),
                                   proxy_address);
	// wait for the deploy request. 
  await valut.deployed(proxy_address,hre.ethers.utils.parseEther("0.15"),proxy_address);
  console.log("valut address:",valut.address);

	// verify process
	// "verify:verify" means the run action.
  await hre.run("verify:verify",
		{
		// deployed contract address
    address: valut.address,

		//constructorArguments

    constructorArguments: [
      proxy_address,
      hre.ethers.utils.parseEther("0.15"),
      proxy_address,
    ],
  });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**run the command to exec the deploy and verify process.**

```jsx
npx hardhat run scripts/deploy-script.js --network teleport
```