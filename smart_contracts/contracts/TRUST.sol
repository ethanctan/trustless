// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TRUST is ERC20 {
    address public admin;

    constructor() ERC20("TRUST Token", "TRUST") {
        admin = msg.sender;
        uint256 initialSupply = 1000000000;
        _mint(msg.sender, initialSupply);
    }

    // could consider storing staking address as state var
    function setStakingAddress(address stakingAddress) public {
        require(msg.sender == admin, "Only admin can set staking address");
        _transfer(msg.sender, stakingAddress, (1000000000 * 775) / 1000);
    }
}
