import  { useState } from 'react';


function Instructions(){
  const [expanded, setExpanded] = useState(true); //for about window

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  return (
    
    <div className="flex flex-col items-center">
    
        <div className="relative my-5 py-1 poppins flex flex-col items-center justify-center w-${expanded ? 'full' : '24'} bg-gray-900 rounded-lg backdrop-filter backdrop-blur-md bg-opacity-50 transition-width duration-300 max-w-lg">
          <button
            className={`poppins flex items-center justify-center w-${expanded ? 'full' : '24'} rounded-lg bg-gray-900 bg-opacity-0 transition-width duration-300 hover:outline-none hover:underline hover:border-transparent hover:ring-0 focus:outline-none border-transparent focus:border-transparent focus:ring-0 max-w-lg`}
            onClick={toggleDropdown}
          >
            <span className="mr-2">How to Earn $TRUST</span>
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
              <p className="mb-2">It’s as simple as submitting the rating form below. </p>
              <p className="mb-2">
                Within 36 hours, you can earn $TRUST tokens by submitting protocol ratings, with larger airdrops awarded for ratings that align with the consensus. 
              </p>
              <p className="mb-2">
                You can rate once for every protocol, for up to over 3000 deFi protocols.
                </p>
              <p className="mb-2">
                The consensus rating - or the average rating - will be released after the 36-hour period. 
              </p>
              <p className="mb-2">
                Start by connecting your wallet. The clock is ticking.
              </p>
            </div>
          )}
        </div>
    </div>

  )
}

export default Instructions;