import { useState } from 'react';
import IMAGES from '../../assets/images';
import CountdownDisplay from '../../components/timer.tsx';

function Introduction(){
  
  const targetDate = new Date("2023-09-21");

  return (
    
    <div className="flex flex-col items-center mt-10">
        <h1 className="unbounded lg:text-7xl md:text-5xl">
          <span className="text-zinc-300">$TRUST</span>
          <span className="gradient-stroke">LESS</span>
        </h1>
        <h2 className="unbounded text-zinc-300 text-3xl text-white mt-5 mb-10 font-light flex flex-col md:flex-row">
          <p>Rate protocols,</p> <p className="hidden md:block">&nbsp;</p> <p>earn $TRUST. </p>
        </h2>

        <CountdownDisplay targetDate={targetDate}/>

        <div className="flex flex-col mt-12 lg:w-3/4 w-full">

          <div className="relative flex md:flex-row flex-col items-center">
            <div className="relative lg:w-1/2 md:w-full w-2/3">
              <img className="w-full" src={IMAGES.Planets} alt="Image 1" />
              <h3 className="text-zinc-300 absolute unbounded inset-0 flex items-center justify-center text-white text-3xl font-light z-0 pl-2 pb-2">
                What is this?
              </h3>
            </div>
            <div className="bg-gradient-to-br from-slate-500/30 to-gray-700/30 flex flex-col lg:w-1/2 text-lg rounded-3xl backdrop-filter backdrop-blur-md p-7 md:ml-5 mb-5">
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


          <div className="relative flex md:flex-row flex-col items-center lg:-mt-5 mt-5">
            <div className="order-2 md:order-1 bg-gradient-to-br from-slate-500/30 to-gray-700/30 flex flex-col lg:w-1/2 text-lg rounded-3xl backdrop-filter backdrop-blur-md p-7 md:mr-5 mb-5">
              <p className="text-right text-zinc-300 poppins p-2">
                Crypto lacks a standard of trust. With conflicting information from influencers, markets, devs and degens, it's hard to separate signals from noise.
              </p>
              <p className="text-right text-zinc-300 poppins p-2">
                TRUSTLESS aims to cut through the crap with a transparent and decentralized method to determine the reliability of DeFi protocols. So you can trust less.
              </p>
            </div>
            <div className="order-1 md:order-2 relative lg:w-1/2 md:w-full w-2/3">
              <img className="w-full" src={IMAGES.Triangle} alt="Image 1" />
              <h3 className="text-zinc-300 absolute unbounded inset-0 flex items-center justify-center text-white text-3xl font-light z-0 ml-3">
                The origin story:
              </h3>
            </div>
          </div>

          
        </div>
    </div>

  


  )
}

export default Introduction;