//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Donations {
    address public owner;
    address public donationsAddress;
    uint currentTransfer;

    struct Transfer {
        uint amount;
        uint timestamp;
        address sender;
    }

    Transfer[] public transfers;

    constructor() {
        owner = msg.sender;
        donationsAddress = address(this);
    }

    function getBalance() public view returns(uint) {
        return donationsAddress.balance;
    }

    modifier requireOwner() {
        require(owner == msg.sender, "You aren't owner");
        _;
    }

    function withdrawAll(address payable _to) public requireOwner{
        require(donationsAddress.balance > 0, "Zero balance");
        _to.transfer(donationsAddress.balance);
    }

    receive() external payable {
        Transfer memory newTransfer = Transfer(msg.value, block.timestamp, msg.sender);
        transfers.push(newTransfer);
        currentTransfer++;
    }
}