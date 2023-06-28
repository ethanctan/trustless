import { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import {Dispute, User,  GetProtocolResponse, DefiData} from './interfaces.ts'
import * as utils from './utils.ts'

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
  //hook for other protocol
  const [duplicate, setDuplicate] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);



  useEffect(() => {
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
      console.log("Logged defi data");
      console.log(response.data)
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


  // TODO: refactor
  const addDispute = async () => {
    let scores = [q1Score, q2Score, q3Score, q4Score, q5Score]
    
    if (!utils.checkScoresCorrect(scores)){
      setErrorMessage("Invalid score, re-enter a valid score")
      return
    }
    setDuplicate(false);

    try{
      // Why are you sending a post request here?
      await Axios.post('http://localhost:3001/ip', {
        ipAddress: ipAddress,
        protocolName: protocol,
      })

      const response1 = await Axios.get<boolean>(`http://localhost:3001/ip?ip=${ipAddress}`);
      const iswithin = response1.data;

      if (iswithin) {
        setErrorMessage("You have already rated this protocol. Try rating another!");
        return
      }

      let response = await utils.updateDisputes(protocol, scores)
      //@ts-ignore
      setListofDisputes(response.data);
      setErrorMessage("Rating submitted!");

      let [ascendingResponse, descendingResponse] = await utils.updateProtocol(protocol, scores)
      setProtocolData(ascendingResponse.data);
      setProtocolDataTop(descendingResponse.data);      
    }
    catch (error) {
      console.log('There was an error with the addIprequest:', error);
    }  
  
}; 

const addDisputeFromOther = async () => {
  let isDuplicate = false;
  console.log("Protocol: ",protocol) 
  try {
    await Axios.post('http://localhost:3001/defiData', {
      protocolName: protocol,
      logo: "None"
    });
    console.log("Defi data added!");
  }
  catch (error : any) {
    if (error.response) {
      console.log('Protocol already exists:', error.response.data.message);
      setErrorMessage("");
      isDuplicate = true;
    } else {
      console.log('Error', error.message);
      setErrorMessage("");
      isDuplicate = true;
    }
  }
  setDuplicate(isDuplicate);
  if (isDuplicate){
    return
  }
  

  addDispute()

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
              {isDropdownOpen &&
                <select 
                  onChange={(event) => {setProtocol(event.target.value);setIsDropdownOpen(true)}}
                >
                  <option value="">Select Protocol</option>
                  {defiData.map((protocol) => (
                    <option key={protocol._id} value={protocol.name}>
                      {protocol.name}
                    </option>
                  ))}
                </select>}
                
                <button onClick={() => {setIsDropdownOpen(!isDropdownOpen); setErrorMessage("")}}> {isDropdownOpen ? "Can't find protocol?" : "Back"} </button> 
                {!isDropdownOpen && <input 
                  type="text" 
                  placeholder="Other" 
                  onChange={(event) => {setProtocol(event.target.value)}}
                />}
              
           
            <input type="number" placeholder="Question 1" onChange={(event) => {setQ1Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 2" onChange={(event) => {setQ2Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 3" onChange={(event) => {setQ3Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 4" onChange={(event) => {setQ4Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 5" onChange={(event) => {setQ5Score(parseInt(event.target.value))}}/>
            <button onClick={isDropdownOpen ? addDispute : addDisputeFromOther}>Submit</button>
            <h5>{duplicate ? "This protocol is in the dropdown." : ""}</h5>
            <h5 style={{ color: 'grey' }}>{errorMessage}</h5>
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
