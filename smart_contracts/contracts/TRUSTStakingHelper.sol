// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TRUSTStakingHelper {
    ERC20 public trustToken;
    uint256 public minStake = 50000;
    address public mainStakingContract;
    address public owner;

    // Mapping to track user's staked amounts
    mapping(uint256 => mapping(address => uint256)) public stakedAmounts;

    constructor(address _trustToken, address _mainStakingContract) {
        trustToken = ERC20(_trustToken);
        mainStakingContract = _mainStakingContract;
        owner = msg.sender;
    }

    function stake(uint256 amount) external {
        require(
            trustToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        stakedAmounts[minStake][msg.sender] += amount;
    }

    // to be called when we start a new epoch
    function transferStake() external {
        require(msg.sender == owner, "Not Owner");
        require(
            trustToken.balanceOf(address(this)) >= minStake,
            "Insufficient Stake"
        );
        require(
            trustToken.transfer(
                mainStakingContract,
                trustToken.balanceOf(address(this))
            ),
            "Transfer failed"
        );
        minStake += 50000;
    }

    function withdraw() external {
        require(stakedAmounts[minStake][msg.sender] != 0, "No Stake");
        require(
            trustToken.transfer(
                msg.sender,
                stakedAmounts[minStake][msg.sender]
            ),
            "Transfer failed"
        );
        stakedAmounts[minStake][msg.sender] = 0;
    }

    function viewStake() external view returns (uint) {
        return stakedAmounts[minStake][msg.sender];
    }
}
