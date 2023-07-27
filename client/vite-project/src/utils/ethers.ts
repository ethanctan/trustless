import { ethers } from "ethers";
import Trust from '../../../../out/TRUST.sol/TRUST.json';
import TrustStaking from '../../../../out/TrustStaking.sol/TrustStaking.json';

//Replace these addresses with those deployed on goerli testnet
const tokenAddress = "0x904c14757639B3dbB5FBA10725C43c5ff68cc35e";
const stakingAddress = "0xEE47416acec662BB90762c38699607e6f4cC18d7";

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
  return { trust: trustContract, trustStaking: trustStakingContract };
}
