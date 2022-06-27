// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { web3 } = require("hardhat");
//hre == hardhat eth
async function  mint_nft_to_account(contract,owner,account,amount){
  for (i=0;i<amount;i++){
    await contract.connect(owner).mint(account.address,i,"test");
  }

}

async function mint_token_to_account(contract,owner,account,amount){
    await contract.connect(owner).mint(account.address,amount);

}

async function buy_one_nft(valut_contract,token_contract,account1){
  await token_contract.connect(account1).approve(valut_contract.address,1000000000);
  await valut_contract.connect(account1).buyOne(account1.address);

}


async function set_valut_alive(valut_contract,owner){
  await valut_contract.connect(owner).setWhiteListStatus(true);

}


async function depositeNFT(nft,valut,nft_owner,amount){
  var list = []
  for (i=0;i<amount;i++){
    list.push(i);
  }
  var rst = await nft.connect(nft_owner).batchApprove(valut.address,list);
  // console.log("nft approve rst = ",rst);

  
  rst = await valut.connect(nft_owner).batchDepositeNFT( nft.address, list);
  // console.log("nft deposite rst = ",rst);
}

async function registerWhiteList(contract,account){

  await contract.connect(account).registerWhiteList();
}
async function checkWhiteList(contract,account){

  const data = await contract.connect(account).checkWhiteList( account.address);
  // await console.log("check_white_list:",data)
}

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

  const repeatedGreetings = async () => {
    await sleep(100000)
    console.log(1)
    await sleep(100000)
    console.log(2)
    await sleep(100000)
    console.log(3)
  }
  repeatedGreetings()



  await hre.run("verify:verify",{
    address: valut.address,
    constructorArguments: [
      proxy_address,
      hre.ethers.utils.parseEther("0.15"),
      proxy_address,
    ],
  });
  //
  // await hre.run("verify:verify",{
  //   address: nft.address,
  //
  // });
  // await hre.run("verify:verify",{
  //   address: token.address,
  //
  // });
  //
  
  
  // 将nft铸造到目标账户
  // await mint_nft_to_account(nft,owner,owner,100);
  // // mint_token_to_account(token,owner,owner,10000000);
  // //获取nft合约的approve，并存入nft
  // await depositeNFT(nft,valut,owner,100);
  // //将购买用的token铸造到目标账户中
  // await mint_token_to_account(token,owner,account1,1000000*10**18);
  // //设置白名单状态
  // await set_white_list_alive(valut,owner);
  // //登记白名单
  // await registerWhiteList(valut,account1);
  // //检查白名单是否登记成功
  // await checkWhiteList(valut,account1);
  // //购买一个nft
  // await buy_one_nft(valut,token,account1);

  // const data = await nft.connect(account1).balanceOf(account1.address);
  // console.log("buy rst : ",data);

  


  
  


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
