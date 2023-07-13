import { useState } from 'react';
import IMAGES from '../../assets/images';
import CountdownDisplay from '../../components/timer.tsx';

function Introduction(){
  // const [expanded, setExpanded] = useState(true); //for about window

  // const toggleDropdown = () => {
  //   setExpanded(!expanded);
  // };

  return (
    
    <div className="flex flex-col items-center mt-10">
        <h1 className="unbounded text-7xl">
          <span className="text-zinc-300">$TRUST</span>
          <span className="gradient-stroke">LESS</span>
        </h1>
        <h2 className="unbounded text-zinc-300 text-3xl text-white mt-5 mb-10 font-light">
          Rate protocols, earn $TRUST.
        </h2>

        <CountdownDisplay targetDate={"2023-07-17"}/>


        <div className="flex flex-col mt-5 w-3/4">

          <div className="relative flex flex-row items-center">
            <div className="relative w-1/2">
              <img className="w-full" src={IMAGES.Planets} alt="Image 1" />
              <h3 className="text-zinc-300 absolute unbounded inset-0 flex items-center justify-center text-white text-3xl font-light z-0 pl-2 pb-2">
                What is this?
              </h3>
            </div>
            <div className="flex flex-col w-1/2 text-lg bg-slate-700/20 rounded-3xl backdrop-filter backdrop-blur-md p-7 ml-5 mb-5">
              <p className="text-left text-zinc-300 poppins pl-2">
              This is TRUSTLESS, where community decides credibility.
              </p>
              <p className="text-left text-zinc-300 poppins py-4 pl-2">
              TRUSTLESS is an experiment in establishing consensus on the trustworthiness of top DeFi protocols. 
              </p>
              <p className="text-left text-zinc-300 poppins pl-2">
              Submit ratings of protocols to be airdropped $TRUST. The closer your ratings are with the majority, the larger the airdrop.
              </p>
            </div>
          </div>


          <div className="relative flex flex-row items-center -mt-5">
            <div className="flex flex-col w-1/2 text-lg bg-slate-700/20 rounded-3xl backdrop-filter backdrop-blur-md p-7 mr-5 mb-5">
              <p className="text-right text-zinc-300 poppins p-2">
                Crypto lacks a standard of trust. With conflicting information from influencers, markets, devs and degens, it's hard to separate signals from noise.
              </p>
              <p className="text-right text-zinc-300 poppins p-2">
                TRUSTLESS aims to cut through the crap with a transparent and decentralized method to help you decide which protocols are worth your trust.
              </p>
            </div>
            <div className="relative w-1/2">
              <img className="w-full" src={IMAGES.Triangle} alt="Image 1" />
              <h3 className="text-zinc-300 absolute unbounded inset-0 flex items-center justify-center text-white text-3xl font-light z-0 ml-3">
                The origin story:
              </h3>
            </div>
          </div>

          
        </div>

        {/* <div className="relative mt-5  py-1 poppins flex flex-col items-center justify-center w-${expanded ? 'full' : '24'} bg-gray-900 rounded-lg backdrop-filter backdrop-blur-md bg-opacity-50 transition-width duration-300 max-w-lg">
          <button
            className={`poppins flex items-center justify-center w-${expanded ? 'full' : '24'} rounded-lg bg-gray-900 bg-opacity-0 transition-width duration-300 hover:outline-none hover:underline hover:border-transparent hover:ring-0 focus:outline-none border-transparent focus:border-transparent focus:ring-0 max-w-lg`}
            onClick={toggleDropdown}
          >
            <span className="mr-2">About</span>
            <svg
              className={`transition-transform duration-300 transform ${
                expanded ? 'rotate-180' : ''
              } w-5 h-5`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.293 8.293a1 1 0 0 1 1.414 0L10 10.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {expanded && (
            <div className="poppins pb-1 bg-opacity-0 rounded-b-lg backdrop-filter overflow-hidden transition-height duration-300 px-10 max-w-lg">
              <div className="flex items-center justify-center">
              </div>
              <p className="mb-2">Technically, blockchain is trustless.</p>
              <p className="mb-2">
                But in reality, <a className="hover:underline" href="https://www.cnbc.com/2022/01/06/crypto-scammers-took-a-record-14-billion-in-2021-chainalysis.html">over $14 Billion</a> was lost to scams, fraud, and hacks in crypto in 2021 alone.
              </p>
              <p className="mb-2">
                We're aggregating user-submitted ratings of on-chain protocols to identify projects with the most trustworthy reputations, and the least.
              </p>
              <p className="mb-2">
                So you can trust less.
              </p>
            </div>
          )}
        </div> */}
    </div>

  


  )
}

export default Introduction;