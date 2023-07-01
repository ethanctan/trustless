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

      <div className="flex flex-col items-center">
        <h1 className="unbounded">
          <span className="text-white">TRUST</span>
          <span className="gradient-stroke">LESS.</span>
        </h1>

        <div className="relative my-5 py-1 poppins flex flex-col items-center justify-center w-${expanded ? 'full' : '24'} bg-gray-900 rounded-lg backdrop-filter backdrop-blur-md bg-opacity-50 transition-width duration-300 max-w-lg">
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


      {/* FORM */}

      <div className="flex flex-col justify-items-stretch poppins mx-auto max-w-lg">
        <div>
          <p className="mb-2"> Rate protocols you've used according to our trust framework. </p>
          <p className="mb-2"> Every submission is quick, anonymous, and noticed 👀. </p>
          <p className=""> To begin, search for a protocol you'd like to rate. </p>
        </div>

        <Select
          className="mt-4 mb-4 poppins mx-5"
          options={defiData.map((protocol) => ({
            value: protocol.name,
            label: protocol.name,
          }))}
          onInputChange={(input) => {
            if (input) {
              setMenuIsOpen(true);
            } else {
              setMenuIsOpen(false);
            }
          }}
          menuIsOpen={menuIsOpen}
          onChange={(selectedOption) => handleSetProtocol(selectedOption?.value || '')}
          placeholder="Search for a protocol..."
          isSearchable
          styles={{
            control: (provided, state) => ({
              ...provided,
              borderRadius: '4px',
              backgroundColor: 'rgba(25, 35, 65, 0.5)',
              backdropFilter: 'blur(8px)',
              borderColor: 'rgba(25, 35, 65, 0.3)',
            }),
            option: (provided, state) => ({
              ...provided,
              color: 'white',
              backgroundColor: 'rgba(25, 35, 65, 0.3)',
              borderColor: 'rgba(33, 33, 33, 0.3)',
              cursor: 'pointer',
              '&:active': {
                backgroundColor: '#5c64d3',
              },
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'white',
            }),
            input: (provided) => ({
              ...provided,
              color: 'white',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: 'rgba(25, 35, 65, 0.3)',
              backdropFilter: 'blur(8px)',
            }),
            menuList: (provided) => ({
              ...provided,
              backgroundColor: 'rgba(25, 35, 65, 0.3)',
              backdropFilter: 'blur(8px)',
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),
          }}
        />

        { protocol && (
          <div className="mb-4"> 
            <p className="mb-2"> Our framework for trust consists of 5 factors, rated on a scale of 1-10, with 1 being the least trustworthy and 10 being the most. </p>
            <p className="mb-2"> Rate {protocol}'s trustworthiness in these 5 areas. </p>
          </div>
        )}

        { protocol && (

        <div className="bg-gray-900 backdrop-blur-md bg-opacity-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 py-4">

            {/* question 1 component */}
            <div className="md:col-span-3 flex items-center  justify-left pl-6">
                <p className="text-white text-center">
                  <span className="mr-2">Contracts</span>
                </p>
              <Tooltip title={text1} placement="top" arrow>
                  <svg fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 416.979 416.979" width="14" height="14">
                  <g>
                    <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                      c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                      c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                      c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                      c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
                  </g>
                  </svg>
              </Tooltip>
          </div>
          <div className="md:col-span-4 flex items-center">
            <Slider
              
              min={1}
              max={10}
              step={1}
              defaultValue={q1Score}
              value={q1Score}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value;
                setQ1Score(selectedValue);
              }}
              marks
              valueLabelDisplay="off"
            />
          </div>
          <div className="md:col-span-1 flex items-center">
            <p className="text-white ml-2">{q1Score}</p>
          </div>
          {/* end question component */}

          {/* question 2 component */}
          <div className="md:col-span-3 flex items-center justify-left pl-6">
              <p className="text-white text-left">
                <span className="mr-2">Treasury</span>
              </p>
              <Tooltip title={text2} placement="top" arrow>
                  <svg fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 416.979 416.979" width="14" height="14">
                  <g>
                    <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                      c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                      c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                      c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                      c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
                  </g>
                  </svg>
              </Tooltip>
            </div>
          <div className="md:col-span-4 flex items-center">
            <Slider
              min={1}
              max={10}
              step={1}
              defaultValue={q2Score}
              value={q2Score}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value;
                setQ2Score(selectedValue);
              }}
              marks
              valueLabelDisplay="off"
            />
          </div>
          <div className="md:col-span-1 flex items-center">
            <p className="text-white ml-2">{q2Score}</p>
          </div>
          {/* end question component */}

          {/* question 3 component */}
          <div className="md:col-span-3 flex items-center  justify-left pl-6">
                <p className="text-white text-center">
                  <span className="mr-2">Roadmap</span>
                </p>
              <Tooltip title={text3} placement="top" arrow>
                  <svg fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 416.979 416.979" width="14" height="14">
                  <g>
                    <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                      c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                      c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                      c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                      c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
                  </g>
                  </svg>
              </Tooltip>
          </div>
          <div className="md:col-span-4 flex items-center">
            <Slider
              
              min={1}
              max={10}
              step={1}
              defaultValue={q3Score}
              value={q3Score}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value;
                setQ3Score(selectedValue);
              }}
              marks
              valueLabelDisplay="off"
            />
          </div>
          <div className="md:col-span-1 flex items-center">
            <p className="text-white ml-2">{q3Score}</p>
          </div>
          {/* end question component */}

          {/* question 4 component */}
          <div className="md:col-span-3 flex items-center  justify-left pl-6">
                <p className="text-white text-center">
                  <span className="mr-2">Governance</span>
                </p>
              <Tooltip title={text4} placement="top" arrow>
                  <svg fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 416.979 416.979" width="14" height="14">
                  <g>
                    <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                      c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                      c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                      c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                      c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
                  </g>
                  </svg>
              </Tooltip>
          </div>
          <div className="md:col-span-4 flex items-center">
            <Slider
              
              min={1}
              max={10}
              step={1}
              defaultValue={q4Score}
              value={q4Score}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value;
                setQ4Score(selectedValue);
              }}
              marks
              valueLabelDisplay="off"
            />
          </div>
          <div className="md:col-span-1 flex items-center">
            <p className="text-white ml-2">{q4Score}</p>
          </div>
          {/* end question component */}

          

          {/* question 5 component */}
          <div className="md:col-span-3 flex items-center justify-left pl-6 ">
                <p className="text-white text-center">
                  <span className="mr-2">Team</span>
                </p>
              <Tooltip title={text5} placement="top" arrow>
                  <svg fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 416.979 416.979" width="14" height="14">
                  <g>
                    <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                      c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                      c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                      c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                      c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
                  </g>
                  </svg>
              </Tooltip>
          </div>
          <div className="md:col-span-4 flex items-center">
            <Slider
              min={1}
              max={10}
              step={1}
              defaultValue={q5Score}
              value={q5Score}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value;
                setQ5Score(selectedValue);
              }}
              marks
              valueLabelDisplay="off"
            />
          </div>
          <div className="md:col-span-1 flex items-center">
            <p className="text-white ml-2">{q5Score}</p>
          </div>
          {/* end question component */}
          <div className="md:col-span-4 flex items-start justify-start text-left pl-6">
              Optional: Drop your (Ethereum) address. 👀
          </div>
          <div className="md:col-span-4 pr-5">
            <TextField 
            className="poppins"
            id="outlined-basic" 
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: 'white',
                fontFamily: 'Poppins',
              },
              '& .MuiInputLabel-root': {
                color: 'white',
                fontFamily: 'Poppins',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '&::placeholder': {
                color: 'white',
                opacity: 0.5,
                fontFamily: 'Poppins',
              },
              '& input': {
                height: '16px', // Adjust the height as per your requirement
                fontFamily: 'Poppins',
              },
              '& .MuiInputLabel-outlined': {
                transform: 'translate(14px, 14px) scale(1)', // Adjust the label position if needed
              },
              '& .MuiInputLabel-shrink': {
                transform: 'translate(14px, -6px) scale(0.7)', // Adjust the label position if needed
              },
            }}
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
