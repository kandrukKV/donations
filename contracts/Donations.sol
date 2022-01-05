//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Donations {
    address owner;
    uint currentTransfer;

    struct Transfer {
        uint amount;
        uint timestamp;
        address sender;
    }

    Transfer[] transfers;

    constructor() {
        owner = msg.sender;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    modifier requireOwner() {
        require(owner == msg.sender, "You aren't owner");
        _;
    }

    function withdrawAll(address payable _to) public requireOwner{
        require(address(this).balance > 0, "Zero balance");
        _to.transfer(address(this).balance);
    }

    function getTransfer(uint _idx) public view returns(Transfer memory) {
        require(_idx < transfers.length, "Can't find this transfer");
        return  transfers[_idx];
    }

    function getTransfers() public view returns(Transfer[] memory) {
        return transfers;
    }

    function getTransfersCount() public view returns(uint) {
        return transfers.length;
    }

    receive() external payable {
        Transfer memory newTransfer = Transfer(msg.value, block.timestamp, msg.sender);
        transfers.push(newTransfer);
        currentTransfer++;
    }
}