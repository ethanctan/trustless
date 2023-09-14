const axios = require('axios');

async function fetchProtocolData() {
    try {
      const response = await axios.get('http://localhost:3001/protocols');
      const protocolData = response.data;
      // console.log("protocol data:", protocolData);
      // Do something with protocolData here, or return it to use elsewhere
      return protocolData;
    } catch (error) {
      console.error('Error fetching protocols:', error);
    }
}

async function fetchAllWalletReferralCounts() {
    try{
        let response = await axios.get("http://localhost:3001/user/getAllReferralCounts");
        let userReferralCounts = response.data;
        return userReferralCounts;
    } catch (error) {
        console.log("Error fetching user referral counts:", error);
    }
}

//Get all walletIdss
//Adding API to get all user walletIds
async function fetchAllWalletIds() {
    try{
        let response = await axios.get("http://localhost:3001/user/getAllUserAddresses");
        let userWallets = response.data;
        return userWallets;
    }
    catch(error){
        console.log("Error fetching user wallets:", error);
    }
}

module.exports = {
    fetchProtocolData,
    fetchAllWalletReferralCounts,
    fetchAllWalletIds
}
