import { ethers } from 'ethers';
import { useState} from 'react';
// import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import {getProvider, getWallet, getContract} from '../utils/ethers';
import NavlinkComponent from "./navlink";
import TooltipComponent from "./tooltip";


//@ts-ignore
export default function Navbar({ passAccount, passContracts}) {
  
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<{signer: ethers.Signer, account: string} | null>(null);
  const [setup, setSetup] = useState(false);

  const setupContracts = async () => {
        const providerTemp = await getProvider();
        setProvider(providerTemp);

        // Get wallet and signer
        const signerTemp = await getWallet(providerTemp);
        setSigner(signerTemp);

        // Get contracts
        const contractsTemp = await getContract(signerTemp.signer);

        // Setup
        passAccount(signerTemp.account);
        passContracts(contractsTemp);
        setSetup(true);
    };
   
  // var thirdwebAddress = useAddress();

  // useEffect(() => {
  //   if (thirdwebAddress) {
  //     passAccount(thirdwebAddress);
  //   }
  // }, [thirdwebAddress]);

  // const location = useLocation();

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
        {/* <ConnectWallet
          className="connect-wallet"
        /> */}
        <button onClick={setupContracts}>
          {signer == null ? 'Connect to Metamask' : signer.account}
        </button>
      </div>

    </nav>
  );
}


