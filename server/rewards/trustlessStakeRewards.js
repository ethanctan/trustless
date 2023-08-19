const Trust = require('../../smart_contracts/artifacts/contracts/TRUST.sol/TRUST.json');
const TrustStaking = require('../../smart_contracts/artifacts/contracts/TRUSTStaking.sol/TRUSTStaking.json');
const TrustStakingHelper = require('../../smart_contracts/artifacts/contracts/TRUSTStakingHelper.sol/TRUSTSTakingHelper.json');
const { ethers } = require('ethers');
const axios = require('axios');

// Instantiate the smart contracts with the admin address and sepolia instances
const adminAddress = '0x8066221588691155A7594291273F417fa4de3CAe'
const adminSecretKey = '1f505417c00af3fb18d5d48afd892d8d318262e232d0fcba395a84ee7f71ee80'
const tokenAddress = "0x18260909b0ddc83326434bC303560aEaBf21A906";
const stakingAddress = "0xd166F4001981984332EC0EE46E9a56421B1BaeA0";
const helperAddress = '0x3f85109658b538112B224082612C33a52BC581aF';

//Instantiate the smart contracts with the admin address and sepolia instances
const provider = new ethers.providers.JsonRpcProvider('https://rpc.sepolia.dev')
const signer = new ethers.Wallet(adminSecretKey, provider)
let trustContract = new ethers.Contract(tokenAddress, Trust.abi, signer);
let trustStakingContract = new ethers.Contract(stakingAddress, TrustStaking.abi, signer);
let trustStakingHelperContract = new ethers.Contract(helperAddress, TrustStakingHelper.abi, signer);

//Calculate %staked for a given user
async function calculateStakedPercentage(userAddress) {
    let totalStaked = await trustContract.balanceOf(helperAddress);
    let userStaked = await trustStakingHelperContract.viewStakeByAddress(userAddress);
    let percentageStaked = userStaked / totalStaked;
    return percentageStaked;
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

async function main(){
    output = await fetchAllWalletIds()
    console.log("output:", output)
}

main()


