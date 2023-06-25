import { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';

interface Dispute {
  _id: string; 
  protocol: string;
  qVals: [number]
}

interface User {
  address: string;
}

interface Protocol {
  _id: string;
  disputeCount: number;
  protocolName: string;
  averageScore: number;
  qScores: [number]
}

interface GetProtocolResponse {
  _id: string;
  protocolName: string;
  disputeCount: number;
  averageScore: number;
}

interface IpAdress {
  ipAddress: string;
  protocolName: string;
}

interface CryptoData {
  id: number;
  slug: string;
  logo: string;
}

function App() {
  //hooks for dispute list
  const [listofDisputes, setListofDisputes] = useState<Dispute[]>([]);
  //hooks for dispute input
  const [protocol, setProtocol] = useState<string>("");
  const [question1, setQuestion1] = useState<number>(0);
  const [question2, setQuestion2] = useState<number>(0);
  const [question3, setQuestion3] = useState<number>(0);
  const [question4, setQuestion4] = useState<number>(0);
  const [question5, setQuestion5] = useState<number>(0);
  //hooks for user address
  const [address, setAddress] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  //hooks for protocol list
  const [protocolData, setProtocolData] = useState<GetProtocolResponse[]>([]);
  //hooks for protocol input
  const [q1Score, setQ1Score] = useState<number>(0);
  const [q2Score, setQ2Score] = useState<number>(0);
  const [q3Score, setQ3Score] = useState<number>(0);
  const [q4Score, setQ4Score] = useState<number>(0);
  const [q5Score, setQ5Score] = useState<number>(0);
  //hook for ip address
  const [ipAddress, setIpAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //hook for crypto data
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);


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

  const addUser = () => {
    Axios.post<User[]>('http://localhost:3001/addUser', {
      address: address,
    }).then((response) => {
      console.log("User added!");
      setSubmitted(true);
    })
  };  

  const addDispute = async () => {

    try{
      await Axios.post('http://localhost:3001/addIp', {
        ipAddress: ipAddress,
        protocolName: protocol,
      }).then(async (response) => {
        // response.data will have the data from your backend.
        console.log(response.data);
        const response1 = await Axios.get<boolean>(`http://localhost:3001/getIpWithin?ip=${ipAddress}`);
        const iswithin = response1.data;
        console.log("iswithin", iswithin);
        
        if (iswithin) {
          console.log("You have already rated this protocol");
          setErrorMessage("You have already rated this protocol. Try rating another!");
        }
        else{
            try {
                await Axios.post('http://localhost:3001/addDispute', {
                protocol: protocol,
                qVals: [question1, question2, question3, question4, question5]
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
                averageScore: (q1Score+q2Score+q3Score+q4Score+q5Score)/5,
                qScores: [q1Score, q2Score, q3Score, q4Score, q5Score]
              });
            
              const response = await Axios.get<GetProtocolResponse[]>('http://localhost:3001/getProtocols');
              setProtocolData(response.data);
            } catch (error) {
              console.error('There was an error with the addProtocol request:', error);
            }
          }
      });
    }
    catch (error) {
      console.log('There was an error with the addIprequest:', error);
    }  
};

function transformApiResponse(response: any): CryptoData[] {
  return Object.values(response.data).map((coin: any) => ({
      id: coin.id,
      slug: coin.slug,
      logo: coin.logo,
  }));
}
 
const getCoins = async () => {
  try {
      const response = await Axios.get('http://localhost:3001/api/cryptocurrency');
      console.log(response);
      const coins = transformApiResponse(response);
      console.log(coins);
      setCryptoData(coins);
  } catch (error) {
      console.error('There was an error with the getCoins request:', error);
  }
};

   
  
  return (
    <div className="App">
      <h1>Aegis Protocol Tracker</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight:'20%', paddingLeft:'20%'}}>
        <div>
          <h4>Live Responses</h4>
          {listofDisputes.slice(-2).map((dispute) => {
            return (
              <div key={dispute._id}>
                <h3>{dispute.protocol}</h3>
                {dispute.qVals.map((val, index) => (
                  <p key={index}>Question {index + 1}: {val}</p>
                ))}
              </div>
            );
          })}
        </div>
        <div>
          <h4>Protocol Leaderboards</h4>
          {protocolData.map((protocol) => {
            return (
              <div key={protocol._id}>
                <h3>{protocol.protocolName}</h3>
                <p>number of ratings: {protocol.disputeCount}</p>
                <p> averageScore: {protocol.averageScore}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
            {/* <input type="text" placeholder="Enter your address" onChange={(event) => setAddressFrom(event.target.value)} /> */}
            <input type="text" placeholder="Protocol Name" onChange={(event) => setProtocol(event.target.value)}/>
            <input type="number" placeholder="Question 1" onChange={(event) => {setQuestion1(parseInt(event.target.value)); setQ1Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 2" onChange={(event) => {setQuestion2(parseInt(event.target.value)); setQ2Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 3" onChange={(event) => {setQuestion3(parseInt(event.target.value)); setQ3Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 4" onChange={(event) => {setQuestion4(parseInt(event.target.value)); setQ4Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 5" onChange={(event) => {setQuestion5(parseInt(event.target.value)); setQ5Score(parseInt(event.target.value))}}/>
            <button onClick={addDispute}>Submit</button>
            <h5 style={{ color: 'red' }}>{errorMessage}</h5>
        </div> 
        <div>
          Drop your address here: <input type="text" placeholder="Enter your address" onChange={(event) => setAddress(event.target.value)} />
          <button onClick={addUser}>Submit</button>
          <h5>{submitted ? "Thank you for submitting your address." : ""}</h5>
          <button onClick={getCoins}>Get Coins</button>
        </div>

    </div>
  );
}

export default App;
