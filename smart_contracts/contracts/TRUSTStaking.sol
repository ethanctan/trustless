// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TRUSTStaking {
    ERC20 public trustToken;
    address public immutable owner;

    mapping(uint => mapping(address => uint)) rewards;

    constructor(address _trustToken) {
        trustToken = ERC20(_trustToken);
        owner = msg.sender;
    }

    // manually called after in-house calculation of rewards - detect total staked from etherscan or sth
    function insertAirdrop(
        address recipient,
        uint amount,
        uint epoch
    ) external {
        require(msg.sender == owner, "Not Owner");
        require(rewards[epoch][recipient] == 0, "Already inserted");
        rewards[epoch][recipient] = amount;
    }

    function claimAirdrop(uint epoch) external {
        require(rewards[epoch][msg.sender] != 0, "No reward");
        trustToken.transfer(msg.sender, rewards[epoch][msg.sender]);
        rewards[epoch][msg.sender] = 0;
    }

    function viewAirdrop(uint epoch) external view returns (uint) {
        return rewards[epoch][msg.sender];
    }
}
