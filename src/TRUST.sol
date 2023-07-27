// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TRUST is ERC20 {
    address public admin;
    uint256 public airdropReserve;
    address public stakingAddress;

    constructor() ERC20("TRUST Token", "TRUST") {
        admin = msg.sender;
        uint256 initialSupply = 100000000;
        _mint(msg.sender, initialSupply);

        // Reserve tokens for future airdrops in staking contract
        airdropReserve = (initialSupply * 775) / 1000;
    }

    function setStakingAddress(address _stakingAddress) public {
        require(msg.sender == admin, "Only admin can set staking address");
        stakingAddress = _stakingAddress;
        _transfer(admin, stakingAddress, airdropReserve);
    }

    // for testing purposes
    function getStakingAddress() public view returns (address) {
        return stakingAddress;
    }
}
