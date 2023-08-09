import { ethers } from "ethers";
import Trust from '../../../../smart_contracts/artifacts/contracts/TRUST.sol/TRUST.json';
import TrustStaking from '../../../../smart_contracts/artifacts/contracts/TRUSTStaking.sol/TRUSTStaking.json';
import TrustStakingHelper from '../../../../smart_contracts/artifacts/contracts/TRUSTStakingHelper.sol/TRUSTStakingHelper.json'
import { ConnectWallet } from "@thirdweb-dev/react";

//Replace these addresses with those deployed on mainnet
const tokenAddress = "0x79C9609dEfd4b238292dA1Bd4Dd9b25A998Fda8e";
const stakingAddress = "0x3EC0549914d56e8b97859cb6FDBABc667809841A";
const helperAddress = '0xf7670f2ba1aD7c86E4A073222BBb60890a663D79';

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
