
const hre = require("hardhat");
//hre == hardhat eth

async function main() {





    const proxy_address = "xxxxxxxx";

    const Valut = await hre.ethers.getContractFactory("NFTVaultETH");
    const valut = await Valut.attach("xxxxxxxxxx");

    await hre.run("verify:verify",{
        address: valut.address,
        constructorArguments: [
            proxy_address,
            ethers.utils.parseEther("0.15"),
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
