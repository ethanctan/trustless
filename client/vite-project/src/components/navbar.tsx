// import Button from "./button";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip } from '@mui/material';
import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';
// import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import {getProvider, getWallet, getContract} from '../utils/ethers';
// import {ITRUST} from '../../../../smart_contracts/interfaces/TRUST';
// import {ITRUSTStaking} from '../../../../smart_contracts/interfaces/TRUSTStaking';

//@ts-ignore
export default function Navbar({ passAccount, passContracts }) {
  
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<{signer: ethers.Signer, account: string} | null>(null);
  const [setup, setSetup] = useState(false);
  
  const setupContracts = useCallback(async () => {
    // useEffect(() => {
    //   async function setupContracts() {
      // Get provider
      const providerTemp = await getProvider();
      setProvider(providerTemp);
      console.log("Getting Provider Successful", providerTemp)

      // Get wallet and signer
      const signerTemp = await getWallet(providerTemp);
      setSigner(signerTemp);
      console.log("Getting Signer Successful", signerTemp);

      // Get contracts
      const contractsTemp = await getContract(signerTemp.signer);
      passAccount(signerTemp.account);

      console.log("Getting Contracts Successful", contractsTemp);
      passContracts(contractsTemp);
      setSetup(true);
      try {
        console.log("Getting admin TRUST account balance:", (await contractsTemp.trust.balanceOf(signerTemp.account)).toString());
      } catch (error) {
        console.log(error);
      }
      
  //   }
  //   setupContracts();
    }, []); 
  
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
        <li>
          <NavLink
            to="/"
            className={`${
              location.pathname === "/" ? "text-purple-400 text-glow" : "text-gray-400 hover:text-gray-100"
            }`}
          >
            About
          </NavLink>
        </li>
        <li>
        {setup ? (<NavLink
            to="/airdrop"
            className={`${
              location.pathname === "/airdrop" ? "text-purple-400 text-glow" : "text-gray-400 hover:text-gray-100"
            }`}
          >
            Claim Airdrop
          </NavLink>) :
          (<Tooltip title={"Available after the rating phase is complete and connect your account."} placement="top" arrow>
            <span
              className={`${
                location.pathname === "/airdrop" ? "text-purple-400 text-glow " : "text-gray-400 "
              }`}
            >
              Claim Airdrop
            </span>
          </Tooltip> )} 
        </li>
        <li>
          {setup ? 
          (<NavLink
            to="/stake"
            className={`${
              location.pathname === "/stake" ? "text-purple-400 text-glow" : "text-gray-400 hover:text-gray-100"
            }`}
          >
            Stake
          </NavLink>) :
          (<Tooltip title={"Available after the rating phase is complete and connect your account."} placement="top" arrow>
            <span
              className={`${
                location.pathname === "/stake" ? "text-purple-400 text-glow " : "text-gray-400 "
              }`}
            >
              Stake
            </span>
          </Tooltip>)}
        </li>
        <li>
          <NavLink
            to="/mechanics"
            className={`${
              location.pathname === "/mechanics" ? "text-purple-400 text-glow " : "text-gray-400 hover:text-gray-100"
            }`}
          >
            Mechanics
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/submitRatings"
            className={`${
              location.pathname === "/submitRatings" ? "text-purple-400 text-glow " : "text-gray-400 hover:text-gray-100"
            }`}
          >
            Submit Ratings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/viewRatings"
            className={`${
              location.pathname === "/viewRatings" ? "text-purple-400 text-glow " : "text-gray-400 hover:text-gray-100"
            }`}
          >
            View Ratings
          </NavLink>
        </li>
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


