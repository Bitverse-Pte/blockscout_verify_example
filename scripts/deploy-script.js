// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { web3 } = require("hardhat");
//hre == hardhat eth


async function main() {



  //
  // const NFT = await hre.ethers.getContractFactory("NFT");
  // const nft = await NFT.deploy();
  //
  // await nft.deployed();
  //
  // const Token = await hre.ethers.getContractFactory("Token");
  // const token = await Token.deploy();
  // await token.deployed();
  // const signer = await hre.ethers.getSigner()
  // console.log(signer)
  // await signer.sendTransaction({
  //   to: "0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0",
  //   value: ethers.utils.parseEther("0.01"),
  // });
  console.log(await web3.eth.getChainId())
  const proxy_address = "0xcb0eccd1d9c9250855175d849f3efe122c12c0bd";
  const Valut = await hre.ethers.getContractFactory("NFTVaultETH");

  // const valut = await Valut.deploy(proxy_address,hre.ethers.utils.parseEther("0.15"),proxy_address);
  // await valut.deployed(proxy_address,hre.ethers.utils.parseEther("0.15"),proxy_address);

  const valut = await Valut.attach("0x25EcaE97b704F9F25a2d3fa6da465cB9b4e06170");


  // console.log("nft address:",nft.address);
  // console.log("token address:",token.address);
  console.log("valut address:",valut.address);

  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))




  await hre.run("verify:verify",{
    address: valut.address,
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
