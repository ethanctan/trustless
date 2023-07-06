import React, {useState, useEffect, useMemo} from 'react';
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';
import Axios from 'axios';

import { TextField } from '@mui/material';
import {User} from '../utils/interfaces.ts'
import * as utils from '../utils/utils.ts'

import {Question} from '../components/question.tsx'
import SearchBar from '../components/searchBar.tsx';
import { textFieldDesc } from './formConsts.ts';
import { ethers } from 'ethers';
import Cookies from 'js-cookie';
import { v4 as generateUuidv4 } from 'uuid';
import { generateReferralCode } from '../utils/utils.ts';
import { create } from '@mui/material/styles/createTransitions';


//@ts-ignore
function Form({setListofDisputes, setProtocolData , setProtocolDataTop, defiData, ipAddress }){
    
    const [q1Score, setQ1Score] = useState<number>(1);
    const [q2Score, setQ2Score] = useState<number>(1);
    const [q3Score, setQ3Score] = useState<number>(1);
    const [q4Score, setQ4Score] = useState<number>(1);
    const [q5Score, setQ5Score] = useState<number>(1);
    const [influencer, setInfluencer] = useState<string>("");
    const [submitted, setSubmitted] = useState<string>("");

    const [address, setAddress] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [protocol, setProtocol] = useState<string>("");
    const [text1, setText1] = useState<string>(""); // tooltips
    const [text2, setText2] = useState<string>("");
    const [text3, setText3] = useState<string>("");
    const [text4, setText4] = useState<string>("");
    const [text5, setText5] = useState<string>("");
    const [user_id, set_uid] = useState<string>("");
    
    const [connectWallet, setConnectWallet] = useState<boolean>(false);
    
    // for generating form content
  const handleSetProtocol = (protocol: string) => {
    setProtocol(protocol);
    setText1("How secure do you believe " + protocol + "'s smart contracts are? Have they been audited and open-sourced? Or have they been exploited before?");
    setText2("How robust, transparent, and community-oriented is " + protocol + "'s treasury? Does it mostly comprise of the protocol's native token, creating concentrated risk? Or does it have a diverse range of assets? Is value regularly distributed to the community?");
    setText3("How confident are you in " + protocol + "'s ability to deliver on their roadmap? Have they delivered in the past? Do their goals seem feasible, or are they overpromising?");
    setText4("How robust is " + protocol + "'s governance system? If decentralized, is there strong voter participation, or is voting controlled by a few whales? If centralized, is there a clear and transparent decision-making process?");
    setText5("How strong is the track record of " + protocol + "'s team? If they're doxxed, do they have strong credentials and experience? If undoxxed, do they have a good reputation and history?");
  }

  useEffect(() =>{
    try{
      let cookieAddr = Cookies.get("user_id")
      if (cookieAddr === undefined){
        cookieAddr = generateUuidv4()
        Cookies.set('user_id', cookieAddr)
      }
      set_uid(cookieAddr)
      
    }catch(error){
      console.log("Bruh")
    }
  }, [])


  const addUser = async () => { 
    if (!address || !(utils.validAddr(address))){
      setSubmitted("Invalid address")
      return
    }
    try{
      await Axios.post<User[]>('http://localhost:3001/users', {
        address: address,
      })
      setSubmitted("Thank you for submitting your address")
    }catch (err){ // catch 409 address
      setSubmitted("You already submitted this address!");
    }
  };
    

  const handleUserSubmission = async () =>{ 
    try{
      if (address) {
        addUser();
      }
      let alreadyRated = await utils.checkIp(ipAddress, protocol)
      if (alreadyRated) {
        setErrorMessage("You have already rated this protocol. Try rating another!");
        return
      }
      
      let scores = [q1Score, q2Score, q3Score, q4Score, q5Score]
      if (!utils.checkScoresCorrect(scores)){
        setErrorMessage("Invalid score, re-enter a valid score")
        return
      }
      let [disputeResponse, ascendingResponse, descendingResponse] = 
        await utils.addDispute(protocol, influencer, scores)

      setListofDisputes(disputeResponse.data);
      setProtocolData(ascendingResponse.data);
      setProtocolDataTop(descendingResponse.data); 
      setErrorMessage("Thanks for submitting!");

    }catch(err){
      setErrorMessage("Oops! Something went wrong with your submission")
    }
    
  }
  
  // function to connect to metamask
  async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        // Ethereum user detected. You can now use the provider.
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            await window.ethereum.enable(); // This will request the user to grant access to their MetaMask
            const signer = provider.getSigner();
            const account = await signer.getAddress();
            //add post request to send account to backend under address collection
            console.log("Account:", account);
            setConnectWallet(true);
            setAddress(account);
        } catch (err) {
            // User denied access
            console.error("User denied access:", err);
        }
    } else {
        console.log('No Ethereum interface injected into browser. Read-only access');
    }
  }

  function createCode(){
    let code = utils.generateReferralCode()
    
    return "1"
  }

  //might want to move this to a separate component for cleaner code
  useEffect(() => {
    // Reset the errorMessage each time the protocol changes
    setErrorMessage(null);
  }, [protocol]);


    return (
        
        <div className="flex flex-col justify-items-stretch poppins mx-auto max-w-lg">
              {/* edit this ugly ass button */}
              <button style={{
                padding: "10px",
                width:'80%',
                alignSelf:'center',
                backgroundColor: "#1a202c",
            }}
                onClick={connect}
            >
                {connectWallet ? "Success!" : "Connect your wallet to submit a rating 👀"}
            </button>
            {connectWallet ? <SearchBar protocol={protocol} defiData={defiData} handleSetProtocol={handleSetProtocol} /> : null}
            {protocol && (
            <div className="mb-4"> 
                <p className="mb-2"> Our framework for trust consists of 5 factors, rated on a scale of 1-10, with 1 being the least trustworthy and 10 being the most. </p>
                <p className="mb-2"> Rate {protocol}'s trustworthiness in these 5 areas. </p>
            </div>
            )}

            { protocol && (

            <div className="bg-gray-900 backdrop-blur-md bg-opacity-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 py-4">
                <Question questionScore={q1Score} setScore={setQ1Score} 
                text={text1} title="Contracts"/>
                <Question questionScore={q2Score} setScore={setQ2Score} 
                text={text2} title="Treasury"/>
                <Question questionScore={q3Score} setScore={setQ3Score} 
                text={text3} title="Roadmap"/>
                <Question questionScore={q4Score} setScore={setQ4Score} 
                text={text4} title="Governance"/>
                <Question questionScore={q5Score} setScore={setQ5Score} 
                text={text5} title="Team"/>
                
                <div className="md:col-span-4 flex items-start justify-start text-left pl-6">
                    Enter a twitter influencer code. 🐦
                </div>
                <div className="md:col-span-4 pr-5">
                    <TextField 
                    className="poppins"
                    id="outlined-basic" 
                    sx={textFieldDesc}
                    placeholder="@twitterhandle" 
                    label="Twitter Code..." 
                    variant="outlined" 
                    onChange={(event) => setInfluencer(event.target.value)}
                    color="primary"
                    />
                </div>


               
                <div className="md:col-span-10 pr-5">
                    <button 
                  className='mb-3 mt-3 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none' 
                  onClick={createCode}
                > Generate your own code here</button>
                </div>
            </div>
          {connectWallet ? 
            <button 
              className='mb-3 mt-3 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none' 
              onClick={handleUserSubmission}
            >
              Submit
            </button> 
          : null}
          {/* to be updated */}
          {errorMessage == 'Thanks for submitting!' ? 
            <div 
              className='mb-3 mt-3 bg-blue-500 hover:bg-blue-400 hover:border-white focus:outline-none cursor-pointer'
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=I%20just%20rated%20${protocol}%20with%20scores%20of%20${[q1Score, q2Score, q3Score, q4Score, q5Score].join(', ')}%20on%20TRUST%20and%20earned%20a%20$TRUST%20airdrop.%20Check%20it%20out%20at%20http://localhost:5173&via=YourTwitterHandle`);
              }}
            >
              Share on Twitter
            </div>
          : null}

            <h5 style={ errorMessage == 'Thanks for submitting!' ? { color: 'white' } : {color: 'red' }}>{errorMessage}</h5>
            </div>
        )}
        </div>
        
    )
}

export default Form;