import { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import Select from 'react-select';
import {Dispute, User, Protocol, GetProtocolResponse, DefiData} from './interfaces.ts'

function App() {
  //hooks for dispute list
  const [listofDisputes, setListofDisputes] = useState<Dispute[]>([]);
  //hooks for dispute input
  const [protocol, setProtocol] = useState<string>("");
  //hooks for user address
  const [address, setAddress] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  //hooks for protocol list
  const [protocolData, setProtocolData] = useState<GetProtocolResponse[]>([]);
  const [protocolDataTop, setProtocolDataTop] = useState<GetProtocolResponse[]>([]);
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
  const [defiData, setDefiData] = useState<DefiData[]>([]);


  useEffect(() => {
    Axios.get<Dispute[]>('http://localhost:3001/disputes').then((response) => {
      setListofDisputes(response.data);
    });
    Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=ascending').then((response) => {
      setProtocolData(response.data);
    });
    Axios.get<string>('http://localhost:3001/ip/getClientIp').then((response) => {
      setIpAddress(response.data);
      console.log(response.data);
    });
    Axios.get<DefiData[]>('http://localhost:3001/defiData').then((response) => {
      setDefiData(response.data);
      console.log(response.data);
    });
  }, []);

  useEffect(() => {
    setSubmitted(false);
  }, [address]);


  const addUser = () => {
    Axios.post<User[]>('http://localhost:3001/users', {
      address: address,
    }).then((response) => {
      console.log("User added!");
      setSubmitted(true);
    })
  };  

  function checkScoresCorrect(dispute : number[]){
    for (let i=0; i < dispute.length; i++){
        if (dispute[i] > 10 || dispute[i] < 1){
            return false
        }
    }
    return true
  }

  async function updateDisputes(protocol : string, scores : number[]){
     // send data to disputes
     try {
      await Axios.post('http://localhost:3001/disputes', {
      protocol: protocol,
      qVals: scores
    });

    const response = await Axios.get<Dispute[]>('http://localhost:3001/disputes');
    setListofDisputes(response.data);
    setErrorMessage("Rating submitted!");
  } catch (error) {
    console.error('There was an error with the addDispute request:', error);
  }
  }

  async function updateProtocol(protocol : string, scores : number[]){
    // send data to protocols
    try {

      let average =  (scores.reduce(
        (partialSum : number, a: number) => 
        partialSum + a, 0))/(scores.length)

      await Axios.post<Protocol>('http://localhost:3001/protocols', {
        disputeCount: 1,
        protocolName: protocol,
        averageScore: average,
        qScores: scores
      });
    
      const response = await Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=ascending');
      setProtocolData(response.data);
      const response1 = await Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=descending');
      setProtocolDataTop(response1.data);
      console.log(response1.data);
    } catch (error) {
      console.error('There was an error with the addProtocol request:', error);
    }
  }

  // TODO: refactor
  const addDispute = async () => {
    let scores = [q1Score, q2Score, q3Score, q4Score, q5Score]
    
    if (!checkScoresCorrect(scores)){
      setErrorMessage("Invalid score, re-enter a valid score")
      return
    }

    try{
      

      // what is this trying to say?
      await Axios.post('http://localhost:3001/ip', {
        ipAddress: ipAddress,
        protocolName: protocol,
      }).then(async (response) => {
        // response.data will have the data from your backend.
        console.log(response.data);
        const response1 = await Axios.get<boolean>(`http://localhost:3001/ip?ip=${ipAddress}`);
        const iswithin = response1.data;
        console.log("iswithin", iswithin);
        
        if (iswithin) {
          console.log("You have already rated this protocol");
          setErrorMessage("You have already rated this protocol. Try rating another!");
          return
        }

        await updateDisputes(protocol, scores)
        await updateProtocol(protocol, scores)
  
      });
    }
    catch (error) {
      console.log('There was an error with the addIprequest:', error);
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
          <h4>Most Trusted</h4>
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
        <div>
          <h4>Least Trusted</h4>
          {protocolDataTop.map((protocol) => {
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
            <select onChange={(event) => setProtocol(event.target.value)}>
              <option value="">Select Protocol</option>
              {defiData.map((protocol) => (
                <option key={protocol._id} value={protocol.name}>
                  {protocol.name}
                </option>
              ))}
            </select>

            <input type="number" placeholder="Question 1" onChange={(event) => {setQ1Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 2" onChange={(event) => {setQ2Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 3" onChange={(event) => {setQ3Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 4" onChange={(event) => {setQ4Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 5" onChange={(event) => {setQ5Score(parseInt(event.target.value))}}/>
            <button onClick={addDispute}>Submit</button>
            <h5 style={{ color: 'red' }}>{errorMessage}</h5>
        </div> 
        <div>
          Drop your address here: <input type="text" placeholder="Enter your address" onChange={(event) => setAddress(event.target.value)} />
          <button onClick={addUser}>Submit</button>
          <h5>{submitted ? "Thank you for submitting your address." : ""}</h5>
        </div>

    </div>
  );
}

export default App;
