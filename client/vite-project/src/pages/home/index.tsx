import '../../App.css';
import Axios from 'axios';

// ADDITIONAL IMPORTS
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';
import React, { useState, useEffect, useMemo } from 'react';
import { GetProtocolResponse, DefiData} from '../../utils/interfaces.ts'

import Introduction from '../../components/title.tsx'
import Instructions from '../../components/instructions.tsx';
import Form from '../submitRatings/form.tsx'
import {SubmissionTable} from '../../components/submissionTable.tsx';
import Navbar from '../../components/navbar.tsx';

enum ActiveButton {
  LiveResponses,
  MostTrusted,
  LeastTrusted,
}

function App() {

  //hooks for user address
  const [address, setAddress] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string>("");
  //hooks for protocol list
  const [protocolData, setProtocolData] = useState<GetProtocolResponse[]>([]);
  const [protocolDataTop, setProtocolDataTop] = useState<GetProtocolResponse[]>([]);

  const [ipAddress, setIpAddress] = useState<string>("");
  const [defiData, setDefiData] = useState<DefiData[]>([]);
  const [activeButton, setActiveButton] = useState<ActiveButton | null>(null);
  //hook for website down
  const [websiteDown, setWebsiteDown] = useState<string>("")

  const protocolTableHeadings = ["PROTOCOL",	"NUMBER OF RATINGS",	"AVERAGE SCORE"]
  const disputeTableHeadings = ["PROTOCOL NAME",	"CONTRACTS",	"SECURITY",	"ROADMAP",	"GOVERNANCE",	"TEAM"]

  // What is this hook for?
  useEffect(() => {
    setSubmitted("");
  }, [address]);

  useEffect(() => {
    try{
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
  const [searchTerm, setSearchTerm] = useState(''); // for searching submissions

  // for searching protocolData
  const filteredProtocolData = protocolData.filter((protocol) =>
  protocol.protocolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // for searching protocolDataTop
  const filteredProtocolDataTop = protocolDataTop.filter((protocol) =>
  protocol.protocolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //@ts-ignore
  function listProtocols({protocol, rowIndex}){
    console.log("Protocol: ",protocol)
    return (
      
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
    )
}
  //@ts-ignore
  function listDisputes({protocol, rowIndex}){
    return(
      <tr
      key={protocol._id}
      className={`${
        rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-600'
      } bg-opacity-50 backdrop-filter backdrop-blur-md`}
      style={{ marginBottom: '10px', height: '50px' }}
    >
      <td className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">
        {protocol.protocol}
      </td>
      {protocol.qVals.map((val : number, colIndex : number) => (
        <td
          key={colIndex}
          className="p-6 py-4 whitespace-nowrap text-sm text-white poppins"
        >
          {val}
        </td>
      ))}
    </tr>
    )
    
  }
  
  return (
    <div className="App">

      {/* BACKGROUND IMAGE */}

      <Introduction />

      <Instructions />

      <Form 
      setProtocolData={setProtocolData}
      setProtocolDataTop={setProtocolDataTop}
      defiData={defiData}
      ipAddress={ipAddress}/>


      {/* SELECTORS */}
      <h4 className="mt-4 mb-4 poppins"> View the community's trust ratings below. </h4>
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

      <div className="flex flex-col -m-1.5 overflow-x-auto p-1.5 min-w-full inline-block align-middle">

          {activeButton === ActiveButton.LiveResponses && (
            <SubmissionTable headings={protocolTableHeadings} 
            submissions={filteredProtocolData}
            RowGenerator={listProtocols}/>
          )}
          {activeButton === ActiveButton.LeastTrusted && (
            <SubmissionTable headings={protocolTableHeadings} 
            submissions={filteredProtocolDataTop}
            RowGenerator={listProtocols}/>
          )}
        </div>

    </div>
  );
}


export default App;
