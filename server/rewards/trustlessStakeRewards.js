const Trust = require('../../smart_contracts/artifacts/contracts/TRUST.sol/TRUST.json');
const TrustStaking = require('../../smart_contracts/artifacts/contracts/TRUSTStaking.sol/TRUSTStaking.json');
const TrustStakingHelper = require('../../smart_contracts/artifacts/contracts/TRUSTStakingHelper.sol/TRUSTSTakingHelper.json');
const { ethers } = require('ethers');
const axios = require('axios');
const { main } = require("./ratingMultiplier")

// Instantiate the smart contracts with the admin address and sepolia instances
const adminAddress = '0x8066221588691155A7594291273F417fa4de3CAe'
const adminSecretKey = '1f505417c00af3fb18d5d48afd892d8d318262e232d0fcba395a84ee7f71ee80'
const tokenAddress = "0x18260909b0ddc83326434bC303560aEaBf21A906";
const stakingAddress = "0xd166F4001981984332EC0EE46E9a56421B1BaeA0";
const helperAddress = '0x3f85109658b538112B224082612C33a52BC581aF';
const INFURA_API_KEY = "634d5ea6a2e84ad18e28bd2119b17f93";
const totalRewardAllocation = 10000000 //10 mil initial allocation

//Instantiate the smart contracts with the admin address and sepolia instances
async function setupContracts() {
    const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`)
    await provider.ready
    // console.log("Provider:", provider)
    const signer = new ethers.Wallet(adminSecretKey, provider)
    let trustContract = new ethers.Contract(tokenAddress, Trust.abi, signer);
    let trustStakingContract = new ethers.Contract(stakingAddress, TrustStaking.abi, signer);
    let trustStakingHelperContract = new ethers.Contract(helperAddress, TrustStakingHelper.abi, signer);
    await Promise.all([
        trustContract.ready,
        trustStakingContract.ready,
        trustStakingHelperContract.ready  
      ])
    // console.log("TrustStakingContract:", trustStakingContract)
    return [trustContract, trustStakingContract, trustStakingHelperContract]
}

//Calculate %staked for a given user
let stakingRewards = {};
async function calculateStakedPercentage(userWallets, trustContract, trustStakingHelperContract) {
    for (const userWallet of userWallets) {

        console.log("User:", userWallet);

        let totalStaked = Number(ethers.utils.formatUnits(await trustContract.balanceOf(helperAddress), 18));

        let userStaked = Number(ethers.utils.formatUnits(await trustStakingHelperContract.viewStakeByAddress(userWallet),18)); 

        let percentageStaked = userStaked / totalStaked;
        console.log("percentageStaked:", percentageStaked);

        stakingRewards[userWallet] = totalRewardAllocation * percentageStaked;
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

// adding rating multipliers for normal rating rewards
async function rewards(){
    let [trustContract, trustStakingContract, trustStakingHelperContract] = await setupContracts()
    output = await fetchAllWalletIds()
    await calculateStakedPercentage(output, trustContract, trustStakingHelperContract);
    console.log("calculating rating multiplier")
    for (const userWallet in stakingRewards) {
        stakingRewards[userWallet] = Math.ceil(stakingRewards[userWallet] * await main(userWallet))
        console.log("staking reward for ", userWallet, ":", stakingRewards[userWallet])
    }
}

rewards()


