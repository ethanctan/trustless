// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TRUSTStakingHelper {
    ERC20 public trustToken;
    uint256 public minStake = 50000;
    address public mainStakingContract;
    address public owner;
    bool public canStake = true;

    // Mapping to track user's staked amounts
    mapping(uint256 => mapping(address => uint256)) public stakedAmounts;

    constructor(address _trustToken, address _mainStakingContract) {
        trustToken = ERC20(_trustToken);
        mainStakingContract = _mainStakingContract;
        owner = msg.sender;
    }

    function stake(uint256 amount) external {
        require(canStake == true, "Wait for next epoch");
        require(
            trustToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        stakedAmounts[minStake][msg.sender] += amount;

        if (trustToken.balanceOf(address(this)) >= minStake) {
            require(
                trustToken.transfer(
                    mainStakingContract,
                    trustToken.balanceOf(address(this))
                ),
                "Transfer failed"
            );
            minStake += 50000;
            canStake = false;
            //reset stakedAmounts
        }
    }

    function openStaking() external {
        require(msg.sender == owner, "Not Owner");
        require(
            canStake == false && trustToken.balanceOf(address(this)) == 0,
            "Invalid"
        );
        canStake = true;
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
}
