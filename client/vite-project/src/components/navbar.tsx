import { useEffect, useState} from 'react';
import { ConnectWallet, useAddress, useSigner } from "@thirdweb-dev/react";
import { INavbar } from '../utils/components';
import NavlinkComponent from "./navlink";
import TooltipComponent from "./tooltip";
import ThirdWebAuth from './thirdwebAuth';


export default function Navbar({ passAccount, passContracts, passProvider, pendingState} : INavbar) {
  
  const [setup, setSetup] = useState(false);
  const [walletReject, setWalletReject] = useState("");

  let thirdwebAddress = useAddress();
  let thirdwebSigner = useSigner(); 
  
  useEffect(() => {
    async function fetchData() {
      if (thirdwebAddress && thirdwebSigner) {
        const provider = await ThirdWebAuth.getProvider()
        //@ts-ignore
        let thirdWebAuth = new ThirdWebAuth(thirdwebAddress, thirdwebSigner, provider)
        let response = await thirdWebAuth.authorizeTransaction(0, 0)
        if ((response).status == false){
          setWalletReject(response.message);
          setSetup(false)
          return 
        }
        passAccount(thirdwebAddress);
        passContracts(response.contracts);
        passProvider(thirdWebAuth.provider);
        setSetup(true);
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
  

//   return (
//     <>

// <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
//   <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//   <a href="https://flowbite.com/" className="flex items-center">
//       <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
//       <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
//   </a>
//   <div className="flex md:order-2">
//       <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button>
//       <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
//         <span className="sr-only">Open main menu</span>
//         <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
//             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
//         </svg>
//     </button>
//   </div>
//   <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
//     <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//       <li>
//         <a href="#" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
//       </li>
//       <li>
//         <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
//       </li>
//       <li>
//         <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
//       </li>
//       <li>
//         <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
//       </li>
//     </ul>
//   </div>
//   </div>
// </nav>

//     <nav className="w-full py-2 z-50 bg-slate-800/60 backdrop-blur-lg poppins flex flex-row ">
//     <div className="flex md:order-2">
//       <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button>
//       <button data-collapse-toggle="navbar" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar" aria-expanded="false">
//         <span className="sr-only">Open main menu</span>
//         <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
//             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
//         </svg>
//     </button>
//   </div>
//     {/* <nav className="fixed top-0 left-0 right-0 w-full py-2 z-50 bg-slate-800/60 backdrop-blur-lg poppins flex flex-row "> */}
//       <ul className="flex items-center justify-start space-x-8 px-8 py-2" id="navbar">
//           <NavlinkComponent to="/" classNamePath={"/"} title={"About"} />
//           {setup ? 
//             <NavlinkComponent to="/airdrop" classNamePath={"/airdrop"} title={"Claim Airdrop"}/> :     
//             <TooltipComponent toolTipTitle={"Available after the rating phase is complete and connect your account."} classNamePath={"/airdrop"} title={"Claim Airdrop"}/> 
//           }
//           {setup ? 
//             <NavlinkComponent to="/stake" classNamePath={"/stake"} title={"Stake"}/> :     
//             <TooltipComponent toolTipTitle={"Available after the rating phase is complete and connect your account."} classNamePath={"/stake"} title={"Stake"}/> 
//           }
//           <NavlinkComponent to="/mechanics" classNamePath={"/mechanics"} title={"Mechanics"} />
//           <NavlinkComponent to="/submitRatings" classNamePath={"/submitRatings"} title={"Submit Ratings"} />
//           <NavlinkComponent to="/viewRatings" classNamePath={"/viewRatings"} title={"View Ratings"} />
//       </ul>

//       <div className="ml-auto flex items-center justify-end px-8 py-2">
//         {/* <ConnectWallet
//           className="connect-wallet"
//         /> */}
//         <button
//           className={`relative inline-flex items-center justify-center p-0.5 my-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-lg 
//           group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-2 focus:outline-none shadow-lg shadow-purple-800/40
//           `}
//           onClick={setupContracts}
//         >
//           <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0">
//             {signer == null ? 'Connect Wallet' : `Connected: 0x${signer.account.substr(2, 4)}...`}
//           </span>
//         </button>
//       </div>

//     </nav>
//     </>
//   );
}


