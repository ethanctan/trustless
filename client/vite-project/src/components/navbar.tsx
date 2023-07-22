// import Button from "./button";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip } from '@mui/material';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

//@ts-ignore
export default function Navbar({ passAccount }) {
  const [connected, setConnected] = useState(false);
  // const [correctNetwork, setCorrectNetwork] = useState(false);
  // const [address, setAddress] = useState<string>('');
  var thirdwebAddress = useAddress();

  useEffect(() => {
    if (thirdwebAddress) {
      passAccount(thirdwebAddress);
      setConnected(true);
    }
  }, [thirdwebAddress]);

  // Deprecated: We're using thirdweb now, so just use the useAddress hook

  // var provider = new ethers.providers.Web3Provider(window.ethereum);
  // var chainId: any;

  // // listen to on networkchange
  // window.ethereum.on('chainChanged', async (chainId: any) => {
  //   console.log('chainChanged', chainId);
  //   window.location.reload();
  //   chainId = await provider.getNetwork();
  //   if(chainId.chainId == 1) setCorrectNetwork(true);
  //   else setCorrectNetwork(false);
  // });

  // // use useEffect to maintain an updated record of the user's network id
  // useEffect(() => {
  //   async function getNetwork() {
  //     chainId = await provider.getNetwork();
  //     if(chainId.chainId == 1) setCorrectNetwork(true);
  //     else setCorrectNetwork(false);
  //   }
  //   getNetwork()
  //     .catch(console.error);
  //   console.log(chainId);
  // }, [chainId]);

  // async function connectMetamask() {
  //   if (typeof window.ethereum === 'undefined') {
  //     throw new Error('No Ethereum interface injected into the browser. Read-only access');
  //   }

  //   if (!correctNetwork) {
  //     await changeNetwork();
  //     return;
  //   }

  //   if (connected) {
  //     return;
  //   }

  //   await window.ethereum.enable();

  //   const signer = provider.getSigner();
  //   const account = await signer.getAddress();

  //   if (!account) {
  //     console.log('Address is null');
  //     return;
  //   }

  //   setConnected(true);
  //   setAddress(account);
  //   passAccount(account);
  // }

  // async function changeNetwork() {
  //   if (typeof window.ethereum === 'undefined') {
  //     throw new Error('No Ethereum interface injected into the browser. Read-only access');
  //   }

  //   await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
  // }

  const location = useLocation();

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
          <Tooltip title={"Available after the rating phase is complete."} placement="top" arrow>
            <span
              className={`${
                location.pathname === "/airdrop" ? "text-purple-400 text-glow " : "text-gray-400 "
              }`}
            >
              Claim Airdrop
            </span>
          </Tooltip>
        </li>
        <li>
          <Tooltip title={"Available after the rating phase is complete."} placement="top" arrow>
            <span
              className={`${
                location.pathname === "/stake" ? "text-purple-400 text-glow " : "text-gray-400 "
              }`}
            >
              Stake
            </span>
          </Tooltip>
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
      <ConnectWallet
        className="connect-wallet"
      />
        {/* <Button
          text={
            correctNetwork ? 
              connected ? `Connected: 0x${address.substr(2, 4)}...` : "Connect Wallet"
              : "Wrong network"
          }
          clickFunction={connectMetamask}
          correctNetwork={correctNetwork}
        /> */}
      </div>
    </nav>
  );
}


