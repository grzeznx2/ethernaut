import { expect } from "chai";
import { ethers } from "hardhat";

const {BigNumber} = ethers

describe("NaughtCoin", () => {
  it("Solves the challenge", async () => {
    const [deployer, receiver] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("NaughtCoin")
    const contract = await contractFactory.connect(deployer).deploy(deployer.address)
    await contract.deployed()

    const deployerBalance = await contract.balanceOf(deployer.address)

    const approveTx = await contract.connect(deployer).approve(deployer.address, deployerBalance)
    await approveTx.wait()


    const tx = await contract.connect(deployer).transferFrom(deployer.address, receiver.address, deployerBalance)
    await tx.wait()

    expect(await contract.balanceOf(deployer.address)).to.eq(BigNumber.from('0'))

  });
});