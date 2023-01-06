import { expect } from "chai";
import { ethers } from "hardhat";

const { utils, BigNumber } = ethers;

describe("Token", () => {
  it("Solves the challenge", async () => {
    const [deployer, receiver] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("Token")
    const contract = await contractFactory.connect(deployer).deploy(20)
    await contract.deployed()

    const tx = await contract.connect(deployer).transfer(receiver.address, 21)
    await tx.wait()
    
    expect(await contract.balanceOf(deployer.address)).to.be.greaterThan(20)
  });
});