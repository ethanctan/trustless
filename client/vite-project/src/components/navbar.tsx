import { ethers } from 'ethers';
import { useEffect, useState} from 'react';
import { ConnectWallet, useAddress, useSigner } from "@thirdweb-dev/react";
import { getProvider, getContract } from '../utils/ethers';
import { INavbar } from '../utils/components';
import NavlinkComponent from "./navlink";
import TooltipComponent from "./tooltip";


export default function Navbar({ passAccount, passContracts, passProvider, pendingState} : INavbar) {
  
  const [setup, setSetup] = useState(false);
  const [walletReject, setWalletReject] = useState("");

  let thirdwebAddress = useAddress();
  let thirdwebSigner = useSigner(); 

  useEffect(() => {
    async function fetchData() {
      if (thirdwebAddress && thirdwebSigner) {
        
        // Set provider
        const provider = await getProvider();
        // Get contracts
        const contractsTemp = await getContract(thirdwebSigner);
  
        // Checks
        const transactionCount = await provider.getTransactionCount(thirdwebAddress);
        console.log("Transaction Count: ", transactionCount)
        const ethBalance = (await provider.getBalance(thirdwebAddress)).toString();
        console.log("Eth Balance: ", ethBalance)

        // Setup
        if (transactionCount >= 10 && Number(ethBalance) >= 10) {
          passAccount(thirdwebAddress);
          passContracts(contractsTemp);
          passProvider(provider);
          setSetup(true);
        }
        else {
          setWalletReject("Wallet does not meet requirements");
        }
      }
    }
  
    fetchData();
  }, [thirdwebAddress, thirdwebSigner]);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full py-2 z-50 bg-slate-800/60 backdrop-blur-lg poppins flex flex-row ">
      <ul className="flex items-center justify-start space-x-8 px-8 py-2">
          <NavlinkComponent to="/" classNamePath={"/"} title={"About"} />
          {setup ? 
            <NavlinkComponent to="/airdrop" classNamePath={"/airdrop"} title={"Claim Airdrop"}/> :     
            <TooltipComponent toolTipTitle={"Available after the rating phase is complete and connect your account."} classNamePath={"/airdrop"} title={"Claim Airdrop"}/> 
          }
          {setup ? 
            <NavlinkComponent to="/stake" classNamePath={"/stake"} title={"Stake"}/> :     
            <TooltipComponent toolTipTitle={"Available after the rating phase is complete and connect your account."} classNamePath={"/stake"} title={"Stake"}/> 
          }
          <NavlinkComponent to="/mechanics" classNamePath={"/mechanics"} title={"Mechanics"} />
          <NavlinkComponent to="/submitRatings" classNamePath={"/submitRatings"} title={"Submit Ratings"} />
          <NavlinkComponent to="/viewRatings" classNamePath={"/viewRatings"} title={"View Ratings"} />
      </ul>

      <div className="ml-auto flex items-center justify-end px-8 py-2">
        {pendingState ? 
          <div><text>pending</text></div> :
          <>
          <ConnectWallet
            className="connect-wallet"
          />
          {walletReject && <div className="text-red-500 text-sm">{walletReject}</div>} 
          </> 
        }
      </div>

    </nav>
  );
}


