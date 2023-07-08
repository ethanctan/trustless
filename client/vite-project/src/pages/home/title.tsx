import Axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';


function Introduction(){
  const [expanded, setExpanded] = useState(true); //for about window

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  return (
    
    <div className="flex flex-col items-center">
        <h1 className="unbounded">
          <span className="text-white">TRUST</span>
          <span className="gradient-stroke">LESS.</span>
        </h1>

        <div className="relative mt-5  py-1 poppins flex flex-col items-center justify-center w-${expanded ? 'full' : '24'} bg-gray-900 rounded-lg backdrop-filter backdrop-blur-md bg-opacity-50 transition-width duration-300 max-w-lg">
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
        </div>
    </div>

  


  )
}

export default Introduction;