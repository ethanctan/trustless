const {ethers} = require('ethers');

// might need to edit based on functions - need to standardize viewStakeByAddress across all relevant contracts
async function calculateStakedPercentage(userWallets, trustContract, trustStakingHelperContract, helperAddress, totalRewardAllocation) {
    let stakingRewards = {};

    for (const userWallet of userWallets) {

        console.log("User:", userWallet);

        let totalStaked = Number(ethers.utils.formatUnits(await trustContract.balanceOf(helperAddress), 18));

        let userStaked = Number(ethers.utils.formatUnits(await trustStakingHelperContract.viewStakeByAddress(userWallet),18)); 

        let percentageStaked = userStaked / totalStaked;
        console.log("percentageStaked:", percentageStaked);

        stakingRewards[userWallet] = totalRewardAllocation * percentageStaked;
    }

    return stakingRewards;
}

module.exports = {
    calculateStakedPercentage
}


