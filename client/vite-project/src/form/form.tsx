import React, {useState, useEffect, useMemo} from 'react';
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';
import Axios from 'axios';

import { TextField } from '@mui/material';
import {User} from '../interfaces.ts'
import * as utils from '../utils.ts'

import {Question} from './question.tsx'
import SearchBar from './searchBar.tsx';
import { textFieldDesc } from './formConsts.ts';

//@ts-ignore
function Form({setListofDisputes, setProtocolData , setProtocolDataTop, defiData, ipAddress }){

    const [q1Score, setQ1Score] = useState<number>(1);
    const [q2Score, setQ2Score] = useState<number>(1);
    const [q3Score, setQ3Score] = useState<number>(1);
    const [q4Score, setQ4Score] = useState<number>(1);
    const [q5Score, setQ5Score] = useState<number>(1);
    const [submitted, setSubmitted] = useState<string>("");

    const [address, setAddress] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [protocol, setProtocol] = useState<string>("");
    const [text1, setText1] = useState<string>(""); // tooltips
    const [text2, setText2] = useState<string>("");
    const [text3, setText3] = useState<string>("");
    const [text4, setText4] = useState<string>("");
    const [text5, setText5] = useState<string>("");
    
    // for generating form content
  const handleSetProtocol = (protocol: string) => {
    setProtocol(protocol);
    setText1("How secure do you believe " + protocol + "'s smart contracts are? Have they been audited and open-sourced? Or have they been exploited before?");
    setText2("How robust, transparent, and community-oriented is " + protocol + "'s treasury? Does it mostly comprise of the protocol's native token, creating concentrated risk? Or does it have a diverse range of assets? Is value regularly distributed to the community?");
    setText3("How confident are you in " + protocol + "'s ability to deliver on their roadmap? Have they delivered in the past? Do their goals seem feasible, or are they overpromising?");
    setText4("How robust is " + protocol + "'s governance system? If decentralized, is there strong voter participation, or is voting controlled by a few whales? If centralized, is there a clear and transparent decision-making process?");
    setText5("How strong is the track record of " + protocol + "'s team? If they're doxxed, do they have strong credentials and experience? If undoxxed, do they have a good reputation and history?");
  }

  const addUser = async () => { // TODO: Add ENS validation
    if (!address || !(utils.validHex(address))){
      setSubmitted("Invalid address")
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
      
      let scores = [q1Score, q2Score, q3Score, q4Score, q5Score]

      if (!utils.checkScoresCorrect(scores)){
        setErrorMessage("Invalid score, re-enter a valid score")
        return
      }

      let alreadyRated = await utils.checkIp(ipAddress, protocol)
      if (alreadyRated) {
        setErrorMessage("You have already rated this protocol. Try rating another!");
        return
      }

      let [disputeResponse, ascendingResponse, descendingResponse] = 
        await utils.addDispute(protocol, scores)

      setListofDisputes(disputeResponse.data);
      setProtocolData(ascendingResponse.data);
      setProtocolDataTop(descendingResponse.data); 
      setErrorMessage("Thanks for submitting!");
        
    }catch(err){
      setErrorMessage("Oops! Something went wrong with your submission")
    }
    
  }


    return (
        
        <div className="flex flex-col justify-items-stretch poppins mx-auto max-w-lg">
            <div>
            <p className="mb-2"> Rate protocols you've used according to our trust framework. </p>
            <p className="mb-2"> Every submission is quick, anonymous, and noticed 👀. </p>
            <p className=""> To begin, search for a protocol you'd like to rate. </p>
            </div>

            <SearchBar protocol={protocol} defiData={defiData} handleSetProtocol={handleSetProtocol} />

            { protocol && (
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
                Optional: Drop your (Ethereum) address. 👀
            </div>
            <div className="md:col-span-4 pr-5">
                <TextField 
                className="poppins"
                id="outlined-basic" 
                sx={textFieldDesc}
                placeholder="0x... or ENS" 
                label="Wallet Address..." 
                variant="outlined" 
                onChange={(event) => setAddress(event.target.value)}
                color="primary"
                />
            </div>
            </div>
            <button className='mb-3 mt-3 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none' onClick={handleUserSubmission}>Submit</button>
            <h5 style={ errorMessage == 'Rating submitted!' ? { color: 'white' } : {color: 'red' }}>{errorMessage}</h5>
            </div>
        )}
        </div>
        
    )
}

export default Form;