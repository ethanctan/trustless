import { ethers } from "ethers";
import Trust from '../../../../smart_contracts/artifacts/contracts/TRUST.sol/TRUST.json';
import TrustStaking from '../../../../smart_contracts/artifacts/contracts/TRUSTStaking.sol/TRUSTStaking.json';
import TrustStakingHelper from '../../../../smart_contracts/artifacts/contracts/TRUSTStakingHelper.sol/TRUSTStakingHelper.json'
import { ConnectWallet } from "@thirdweb-dev/react";

//Replace these addresses with those deployed on mainnet
const tokenAddress = "0x18260909b0ddc83326434bC303560aEaBf21A906";
const stakingAddress = "0xd166F4001981984332EC0EE46E9a56421B1BaeA0";
const helperAddress = '0x3f85109658b538112B224082612C33a52BC581aF';

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
