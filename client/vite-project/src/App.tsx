import './App.css';
import Axios from 'axios';

// ADDITIONAL IMPORTS
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';
import React, { useState, useEffect, useMemo } from 'react';
import {Dispute,  GetProtocolResponse, DefiData} from './interfaces.ts'

import Introduction from './title.tsx'
import Form from './form/form.tsx'
import {SubmissionTable, TableHeading} from './submissionTable.tsx';

enum ActiveButton {
  LiveResponses,
  MostTrusted,
  LeastTrusted,
}

function App() {
  const [listofDisputes, setListofDisputes] = useState<Dispute[]>([]);
  // TODO: Merge questionX and qXScore

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

  // What is this hook for?
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
                 <TableHeading headings={["PROTOCOL", "NAME",	"CONTRACTS",	"SECURITY",	"ROADMAP",	"GOVERNANCE",	"TEAM"]}/>
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
              <SubmissionTable submissions={filteredProtocolData}/>
            )}
            {activeButton === ActiveButton.LeastTrusted && (
              <SubmissionTable submissions={filteredProtocolDataTop}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
