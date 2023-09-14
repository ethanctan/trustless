const { calculateStakedPercentage } = require("./stakingPercentage")
const { calculateRatingMultiplier } = require("./ratingMultiplier")
const { fetchAllWalletReferralCounts, referralCountMultiplier } = require("./referralCountsMultiplier")
const { setupContracts, helperAddress, insertRewards } = require("../utils/setupContracts")
const { fetchAllWalletIds } = require("../utils/apis")

// Total reward allocation for trustless staking
const totalRewardAllocation = 1000000;

// adding rating multipliers for normal rating rewards
async function rewards(){

    // setup contracts and epoch
    let [trustContract, trustStakingContract, trustStakingHelperContract] = await setupContracts()
    let epoch = 0;

    // fetch all user walletIds
    output = await fetchAllWalletIds()

    // calculate staked percentage
    let stakingRewards = await calculateStakedPercentage(output, trustContract, trustStakingHelperContract, helperAddress, totalRewardAllocation);

    // calculate and apply rating multiplier
    for (const userWallet in stakingRewards) {
        stakingRewards[userWallet] = Math.ceil(stakingRewards[userWallet] * await calculateRatingMultiplier(userWallet))
        console.log("staking reward for ", userWallet, ":", stakingRewards[userWallet])
    }

    // calculate and apply referral count multiplier
    let referralCounts = await fetchAllWalletReferralCounts()
    for (const userWallet in stakingRewards) {
        stakingRewards[userWallet] = Math.ceil(stakingRewards[userWallet] * await referralCountMultiplier(await referralCounts[userWallet]))
        console.log("staking reward for ", userWallet, ":", stakingRewards[userWallet])
    }

    // insert rewards
    for (const userWallet in stakingRewards) {
        await insertRewards(trustStakingContract, userWallet, stakingRewards[userWallet], epoch)
    }
}

rewards()


