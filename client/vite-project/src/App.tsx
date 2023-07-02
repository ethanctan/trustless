import './App.css';
import Axios from 'axios';

// ADDITIONAL IMPORTS
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';
import Slider from '@mui/material/Slider';
import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Tooltip, Button, TextField } from '@mui/material';
import {Dispute, User,  GetProtocolResponse, DefiData} from './interfaces.ts'
import * as utils from './utils.ts'

import Introduction from './title.tsx'
import {Question, QuestionPrompt, ModifiedSlider} from './form/question.tsx'
import SearchBar from './form/searchBar.tsx';
import Form from './form/form.tsx'

enum ActiveButton {
  LiveResponses,
  MostTrusted,
  LeastTrusted,
}

function App() {
  const [listofDisputes, setListofDisputes] = useState<Dispute[]>([]);
  const [protocol, setProtocol] = useState<string>("");
  // TODO: Merge questionX and qXScore

  //hooks for user address
  const [address, setAddress] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string>("");
  //hooks for protocol list
  const [protocolData, setProtocolData] = useState<GetProtocolResponse[]>([]);
  const [protocolDataTop, setProtocolDataTop] = useState<GetProtocolResponse[]>([]);
  const [q1Score, setQ1Score] = useState<number>(1);
  const [q2Score, setQ2Score] = useState<number>(1);
  const [q3Score, setQ3Score] = useState<number>(1);
  const [q4Score, setQ4Score] = useState<number>(1);
  const [q5Score, setQ5Score] = useState<number>(1);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [defiData, setDefiData] = useState<DefiData[]>([]);
  const [activeButton, setActiveButton] = useState<ActiveButton | null>(null);
  //hook for website down
  const [websiteDown, setWebsiteDown] = useState<string>("")

  useEffect(() => {
    setSubmitted("");
  }, [address]);

  useEffect(() => {
    try{
      Axios.get<Dispute[]>('http://localhost:3001/disputes').then((response) => {
      setListofDisputes(response.data);
    });
    Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=ascending').then((response) => {
      setProtocolData(response.data);
    });
    Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=descending').then((response) => {
      setProtocolDataTop(response.data);
    });
    Axios.get<string>('http://localhost:3001/ip/getClientIp').then((response) => {
      setIpAddress(response.data);
    });
    Axios.get<DefiData[]>('http://localhost:3001/defiData').then((response) => {
      setDefiData(response.data);
    });
    setWebsiteDown("")
    }catch (error){
      setWebsiteDown("Something went wrong with the website!")
    }
  }, []);

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
    

  useEffect(() => {
    Axios.get<DefiData[]>('http://localhost:3001/defiData').then((response) => {
      setDefiData(response.data);
      console.log(response.data);
    });
  }, []);

  const handleButtonClick = (button: ActiveButton) => {
    setActiveButton(button);
  };

  // ADDITIONAL VARIABLES/FUNCTIONS (ADD IN WHEN MERGING)

  const [expanded, setExpanded] = useState(false); //for about window
  const [menuIsOpen, setMenuIsOpen] = React.useState(false); //for search dropdown
  const [text1, setText1] = useState<string>(""); // tooltips
  const [text2, setText2] = useState<string>("");
  const [text3, setText3] = useState<string>("");
  const [text4, setText4] = useState<string>("");
  const [text5, setText5] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState(''); // for searching submissions

  const toggleDropdown = () => {
    setExpanded(!expanded);
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
    }catch(err){
      setErrorMessage("Oops! Something went wrong with your submission")
    }
    
  }

  // for generating form content
  const handleSetProtocol = (protocol: string) => {
    setProtocol(protocol);
    setText1("How secure do you believe " + protocol + "'s smart contracts are? Have they been audited and open-sourced? Or have they been exploited before?");
    setText2("How robust, transparent, and community-oriented is " + protocol + "'s treasury? Does it mostly comprise of the protocol's native token, creating concentrated risk? Or does it have a diverse range of assets? Is value regularly distributed to the community?");
    setText3("How confident are you in " + protocol + "'s ability to deliver on their roadmap? Have they delivered in the past? Do their goals seem feasible, or are they overpromising?");
    setText4("How robust is " + protocol + "'s governance system? If decentralized, is there strong voter participation, or is voting controlled by a few whales? If centralized, is there a clear and transparent decision-making process?");
    setText5("How strong is the track record of " + protocol + "'s team? If they're doxxed, do they have strong credentials and experience? If undoxxed, do they have a good reputation and history?");
  }

  // for searching submissions
  const filteredDisputes = listofDisputes.filter((dispute) =>
    dispute.protocol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // for searching protocolData
  const filteredProtocolData = protocolData.filter((protocol) =>
  protocol.protocolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // for searching protocolDataTop
  const filteredProtocolDataTop = protocolDataTop.filter((protocol) =>
  protocol.protocolName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="App">

      {/* BACKGROUND IMAGE */}

      {/* TITLE AND EXPLANATION */}

      <Introduction />


      <Form setListofDisputes={setListofDisputes}
      setProtocolData={setProtocolData}
      setProtocolDataTop={setProtocolDataTop}
      defiData={defiData}
      ipAddress={ipAddress}/>



      {/* SELECTORS */}
      <h4 className="mb-4 poppins"> View the community's trust ratings below. </h4>

      <div className="poppins space-x-2 flex max-w-lg mx-auto items-center">
        <button className={`toggle-button flex-1 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none ${activeButton === ActiveButton.LiveResponses ? 'active' : ''}`} onClick={() => handleButtonClick(ActiveButton.LiveResponses)}>
          Most Recent
        </button>
        <button className={`toggle-button flex-1 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none ${activeButton === ActiveButton.MostTrusted ? 'active' : ''}`} onClick={() => handleButtonClick(ActiveButton.MostTrusted)}>
          Most Trusted
        </button>
        <button className={`toggle-button flex-1 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none ${activeButton === ActiveButton.LeastTrusted ? 'active' : ''}`} onClick={() => handleButtonClick(ActiveButton.LeastTrusted)}>
          Least Trusted
        </button>
      </div>


      {/* TABLES */}

    {/* Search bar */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search protocol..."
          className="poppins w-50 rounded-lg p-2 border bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-800 hover:border-white focus:outline-none transition-all duration-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            {activeButton === ActiveButton.LiveResponses && (
              <div className="border rounded-lg overflow-hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Protocol Name
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Contracts
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Security
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Roadmap
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Governance
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Team
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 divide-gray-700">
                    {filteredDisputes.slice(0, 10).map((dispute, rowIndex) => (
                      <tr
                        key={dispute._id}
                        className={`${
                          rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-600'
                        } bg-opacity-50 backdrop-filter backdrop-blur-md`}
                        style={{ marginBottom: '10px', height: '50px' }}
                      >
                        <td className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">
                          {dispute.protocol}
                        </td>
                        {dispute.qVals.map((val, colIndex) => (
                          <td
                            key={colIndex}
                            className="p-6 py-4 whitespace-nowrap text-sm text-white poppins"
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDisputes.length === 0 && (
                  <p className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">No protocols found.</p>
                )}
              </div>
            )}
            {activeButton === ActiveButton.MostTrusted && (
              <div className="border rounded-lg overflow-hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Protocol
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Number of Ratings
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Average Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 divide-gray-700">
                    {filteredProtocolData.slice(0, 10).map((protocol, rowIndex) => (
                      <tr
                        key={protocol._id}
                        className={`${
                          rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-600'
                        } bg-opacity-50 backdrop-filter backdrop-blur-md`}
                        style={{ marginBottom: '10px', height: '50px' }}
                      >
                        <td className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">
                          {protocol.protocolName}
                        </td>
                        <td className="p-6 py-4 whitespace-nowrap text-sm text-white poppins">
                          {protocol.disputeCount}
                        </td>
                        <td className="p-6 py-4 whitespace-nowrap text-sm text-white poppins">
                          {protocol.averageScore.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {protocolData.length === 0 && (
                  <p className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">No protocols found.</p>
                )}
              </div>
            )}
            {activeButton === ActiveButton.LeastTrusted && (
              <div className="border rounded-lg overflow-hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Protocol
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Number of Ratings
                      </th>
                      <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                        Average Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 divide-gray-700">
                    {filteredProtocolDataTop.slice(0, 10).map((protocol, rowIndex) => (
                      <tr
                        key={protocol._id}
                        className={`${
                          rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-600'
                        } bg-opacity-50 backdrop-filter backdrop-blur-md`}
                        style={{ marginBottom: '10px', height: '50px' }}
                      >
                        <td className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">
                          {protocol.protocolName}
                        </td>
                        <td className="p-6 py-4 whitespace-nowrap text-sm text-white poppins">
                          {protocol.disputeCount}
                        </td>
                        <td className="p-6 py-4 whitespace-nowrap text-sm text-white poppins">
                          {protocol.averageScore.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {protocolDataTop.length === 0 && (
                  <p className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">No protocols found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
