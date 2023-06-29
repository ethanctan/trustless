import { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import Select from 'react-select';

// ADDITIONAL IMPORTS
import '@fontsource-variable/unbounded';
import '@fontsource/poppins';
import Slider from '@mui/material/Slider';


interface Dispute {
  _id: string;
  protocol: string;
  qVals: [number];
}

interface User {
  address: string;
}

interface Protocol {
  _id: string;
  disputeCount: number;
  protocolName: string;
  averageScore: number;
  qScores: [number];
}

interface GetProtocolResponse {
  _id: string;
  protocolName: string;
  disputeCount: number;
  averageScore: number;
}

interface IpAddress {
  ipAddress: string;
  protocolName: string;
}

interface DefiData {
  _id: string;
  name: string;
  logo: string;
}

enum ActiveButton {
  LiveResponses,
  MostTrusted,
  LeastTrusted,
}

function App() {
  const [listofDisputes, setListofDisputes] = useState<Dispute[]>([]);
  const [protocol, setProtocol] = useState<string>("");
  const [question1, setQuestion1] = useState<number>(1);
  const [question2, setQuestion2] = useState<number>(1);
  const [question3, setQuestion3] = useState<number>(1);
  const [question4, setQuestion4] = useState<number>(1);
  const [question5, setQuestion5] = useState<number>(1);
  const [address, setAddress] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
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

  useEffect(() => {
    Axios.get<Dispute[]>('http://localhost:3001/getDisputes').then((response) => {
      setListofDisputes(response.data);
    });
  }, []);

  useEffect(() => {
    setSubmitted(false);
  }, [address]);

  useEffect(() => {
    Axios.get<GetProtocolResponse[]>('http://localhost:3001/getProtocols').then((response) => {
      setProtocolData(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get<string>('http://localhost:3001/get-ip').then((response) => {
      setIpAddress(response.data);
      console.log(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get<DefiData[]>('http://localhost:3001/getDefiData').then((response) => {
      setDefiData(response.data);
      console.log(response.data);
    });
  }, []);

  const addUser = () => {
    Axios.post<User[]>('http://localhost:3001/addUser', {
      address: address,
    }).then((response) => {
      console.log("User added!");
      setSubmitted(true);
    })
  };

  const addDispute = async () => {
    try {
      await Axios.post('http://localhost:3001/addIp', {
        ipAddress: ipAddress,
        protocolName: protocol,
      }).then(async (response) => {
        console.log(response.data);
        const response1 = await Axios.get<boolean>(`http://localhost:3001/getIpWithin?ip=${ipAddress}`);
        const iswithin = response1.data;
        console.log("iswithin", iswithin);

        if (iswithin) {
          console.log("You have already rated this protocol");
          setErrorMessage("You have already rated this protocol. Try rating another!");
        } else {
          try {
            await Axios.post('http://localhost:3001/addDispute', {
              protocol: protocol,
              qVals: [question1, question2, question3, question4, question5],
            });

            const response = await Axios.get<Dispute[]>('http://localhost:3001/getDisputes');
            setListofDisputes(response.data);
            setErrorMessage("Rating submitted!");
          } catch (error) {
            console.error('There was an error with the addDispute request:', error);
          }

          try {
            await Axios.post<Protocol>('http://localhost:3001/addProtocol', {
              disputeCount: 1,
              protocolName: protocol,
              averageScore: (q1Score + q2Score + q3Score + q4Score + q5Score) / 5,
              qScores: [q1Score, q2Score, q3Score, q4Score, q5Score],
            });

            const response = await Axios.get<GetProtocolResponse[]>('http://localhost:3001/getProtocols');
            setProtocolData(response.data);
            const response1 = await Axios.get<GetProtocolResponse[]>('http://localhost:3001/getProtocolsTop');
            setProtocolDataTop(response1.data);
            console.log(response1.data);
          } catch (error) {
            console.error('There was an error with the addProtocol request:', error);
          }
        }
      });
    } catch (error) {
      console.log('There was an error with the addIprequest:', error);
    }
  };

  const handleButtonClick = (button: ActiveButton) => {
    setActiveButton(button);
  };

  // ADDITIONAL FUNCTIONS (ADD IN WHEN MERGING)

  const [expanded, setExpanded] = useState(true); 

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = () => {
    if (address) {
      addUser();
    }
    addDispute();
  }

  return (
    <div className="App">

      {/* BACKGROUND IMAGE */}

      {/* TITLE AND EXPLANATION */}

      <div className="flex flex-col items-center">
        <h1 className="unbounded">
          <span className="text-white">TRUST</span>
          <span className="gradient-stroke">LESS.</span>
        </h1>

        <div className="relative my-5 py-1 poppins flex flex-col items-center justify-center w-${expanded ? 'full' : '24'} bg-gray-900 rounded-lg backdrop-filter backdrop-blur-md bg-opacity-70 transition-width duration-300 max-w-lg">
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

      <div>
        <div className="poppins">
          <p className="mb-2"> If you've ever used or heard of a protocol, we want you to rate it. </p>
          <p className="mb-2"> Every submission is quick, anonymous, and noticed 👀. </p>
          <p className="mb-2"> To begin, select a protocol to rate. </p>
        </div>


        <Select
          className="mt-4 mb-8"
          value={{ value: protocol, label: protocol }}
          onChange={(selectedOption) => setProtocol(selectedOption.value)}
          options={defiData.map((protocol) => ({
            value: protocol.name,
            label: protocol.name,
          }))}
        />

        { protocol && (
          <div> 
            <Slider
              min={1}
              max={10}
              step={1}
              defaultValue={question1}
              value={question1}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value; // Extract the selected value from the array if necessary
                setQ1Score(selectedValue);
                setQuestion1(selectedValue);
              }}
              marks
              valueLabelDisplay="auto"
            />


            <Slider
              min={1}
              max={10}
              step={1}
              defaultValue={question2}
              value={question2}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value; // Extract the selected value from the array if necessary
                setQ2Score(selectedValue);
                setQuestion2(selectedValue);
              }}
              marks
              valueLabelDisplay="auto"
            />

            <Slider
              min={1}
              max={10}
              step={1}
              defaultValue={question3}
              value={question3}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value; // Extract the selected value from the array if necessary
                setQ3Score(selectedValue);
                setQuestion3(selectedValue);
              }}
              marks
              valueLabelDisplay="auto"
            />

            <Slider
              min={1}
              max={10}
              step={1}
              defaultValue={question4}
              value={question4}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value; // Extract the selected value from the array if necessary
                setQ4Score(selectedValue);
                setQuestion4(selectedValue);
              }}
              marks
              valueLabelDisplay="auto"
            />

            <Slider
              min={1}
              max={10}
              step={1}
              defaultValue={question5}
              value={question5}
              onChange={(event, value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value; // Extract the selected value from the array if necessary
                setQ5Score(selectedValue);
                setQuestion5(selectedValue);
              }}
              marks
              valueLabelDisplay="auto"
            />

            <h5 style={{ color: 'red' }}>{errorMessage}</h5>

            <div>
              Drop your address here: <input type="text" placeholder="Enter your address" onChange={(event) => setAddress(event.target.value)} />
              <button onClick={handleSubmit}>Submit</button>
              <h5>{submitted ? "Thank you for submitting." : ""}</h5>
            </div>
        </div>
      )}
      </div>

      {/* SELECTORS */}

      <div>
        <button className={`toggle-button ${activeButton === ActiveButton.LiveResponses ? 'active' : ''}`} onClick={() => handleButtonClick(ActiveButton.LiveResponses)}>
          Live Responses
        </button>
        <button className={`toggle-button ${activeButton === ActiveButton.MostTrusted ? 'active' : ''}`} onClick={() => handleButtonClick(ActiveButton.MostTrusted)}>
          Most Trusted
        </button>
        <button className={`toggle-button ${activeButton === ActiveButton.LeastTrusted ? 'active' : ''}`} onClick={() => handleButtonClick(ActiveButton.LeastTrusted)}>
          Least Trusted
        </button>
      </div>

      {/* TABLES */}

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20%', paddingLeft: '20%' }}>
        <div>
          {activeButton === ActiveButton.LiveResponses && (
            <div className="table-container">
              <h4> 
                Live Responses
              </h4>
              <table className="rounded-lg">

                <tbody>
                  {listofDisputes.slice(-2).map((dispute) => (
                    <tr key={dispute._id}>
                      <td>{dispute.protocol}</td>
                      {dispute.qVals.map((val, index) => (
                        <td key={index}>Question {index + 1}: {val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          {activeButton === ActiveButton.MostTrusted && (
            <div className="table-container">
              <h4> 
                Most Trusted
              </h4>
              <table className="rounded-lg">
                <tbody>
                  {protocolData.map((protocol) => (
                    <tr key={protocol._id}>
                      <td>{protocol.protocolName}</td>
                      <td>number of ratings: {protocol.disputeCount}</td>
                      <td>averageScore: {protocol.averageScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          {activeButton === ActiveButton.LeastTrusted && (
            <div className="table-container">
              <h4> 
                Least Trusted
              </h4>
              <table className="rounded-lg">
                <tbody>
                  {protocolDataTop.map((protocol) => (
                    <tr key={protocol._id}>
                      <td>{protocol.protocolName}</td>
                      <td>number of ratings: {protocol.disputeCount}</td>
                      <td>averageScore: {protocol.averageScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
