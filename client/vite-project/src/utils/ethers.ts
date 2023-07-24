import { ethers } from "ethers";
import Trust from '../../../../smart_contracts/artifacts/contracts/TRUST.sol/TRUST.json';
import TrustStaking from '../../../../smart_contracts/artifacts/contracts/TRUSTStaking.sol/TRUSTStaking.json';

//Replace these addresses with those deployed on goerli testnet
const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const stakingAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

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
