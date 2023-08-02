import { ethers } from "ethers";
import Trust from '../../../../smart_contracts/artifacts/contracts/TRUST.sol/TRUST.json';
import TrustStaking from '../../../../smart_contracts/artifacts/contracts/TRUSTStaking.sol/TRUSTStaking.json';
import TrustStakingHelper from '../../../../smart_contracts/artifacts/contracts/TRUSTStakingHelper.sol/TRUSTStakingHelper.json'

//Replace these addresses with those deployed on goerli testnet
const tokenAddress = "0x1A575d9E48804c5Db07d2F23dAD28DabfAFeEddd";
const stakingAddress = "0x3CE44692496B80ceE36965EEf8ce08bFB8834f7D";
const helperAddress = '0x3D62277e091Ec688F8Ba1E4bc2a84fD7EeE47139';

export const getProvider = async () => {
    // For hardhat testnet
    // return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    if (!window.ethereum) {
      throw new Error("Please install Metamask");
    }

    await window.ethereum.enable();  
    return new ethers.providers.Web3Provider(window.ethereum);
}


export const getWallet = async (provider: any) => {
  // For hardhat testnet
// const accounts = await provider.listAccounts();
// const signer = provider.getSigner(accounts[0]);

    const signer = await provider.getSigner();
    const account = await signer.getAddress();

    return { signer: signer, account: account };
}

export const getContract = (signer: any) => {
  let trustContract = new ethers.Contract(tokenAddress, Trust.abi, signer);
  let trustStakingContract = new ethers.Contract(stakingAddress, TrustStaking.abi, signer);
  let trustStakingHelperContract = new ethers.Contract(helperAddress, TrustStakingHelper.abi, signer);
  return { trust: trustContract, trustStaking: trustStakingContract, trustStakingHelper: trustStakingHelperContract };
}
