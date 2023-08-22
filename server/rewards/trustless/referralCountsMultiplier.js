const { fetchAllWalletReferralCounts } = require('../utils/apis');

async function referralCountMultiplier(count) {
    console.log("count:", count)
    if (count <= 100) {
        return 1;
    } else if (count <= 1000) {
        return 1.5;
    } else if (count <= 10000) {
        return 2;
    } else {
        return 2.5;
    }
}

module.exports = {
    fetchAllWalletReferralCounts,
    referralCountMultiplier
}