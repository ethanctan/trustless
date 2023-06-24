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

function App() {
  const [listofDisputes, setListofDisputes] = useState<Dispute[]>([]);
  const [protocol, setProtocol] = useState<string>("");
  const [question1, setQuestion1] = useState<number>(0);
  const [question2, setQuestion2] = useState<number>(0);
  const [question3, setQuestion3] = useState<number>(0);
  const [question4, setQuestion4] = useState<number>(0);
  const [question5, setQuestion5] = useState<number>(0);
  const [address, setAddress] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [listofProtocols, setListofProtocols] = useState<Protocol[]>([]);
  const [q1Score, setQ1Score] = useState<number>(0);
  const [q2Score, setQ2Score] = useState<number>(0);
  const [q3Score, setQ3Score] = useState<number>(0);
  const [q4Score, setQ4Score] = useState<number>(0);
  const [q5Score, setQ5Score] = useState<number>(0);


  useEffect(() => {
    Axios.get<Dispute[]>('http://localhost:3001/getDisputes').then((response) => {
      setListofDisputes(response.data);
    });
  }, []);

  useEffect(() => {
    setSubmitted(false);
  }, [address]);

  useEffect(() => {
    Axios.get<Protocol[]>('http://localhost:3001/getProtocols').then((response) => {
      setListofProtocols(response.data);
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
      const disputeResponse = await Axios.post('http://localhost:3001/addDispute', {
        protocol: protocol,
        qVals: [question1, question2, question3, question4, question5]
      });
  
      setListofDisputes([...listofDisputes]);
    } catch (error) {
      console.error('There was an error with the addDispute request:', error);
    }
  
    try {
      const protocolResponse = await Axios.post('http://localhost:3001/addProtocol', {
        disputeCount: 1,
        protocolName: protocol,
        averageScore: (q1Score+q2Score+q3Score+q4Score+q5Score)/5,
        qScores: [q1Score, q2Score, q3Score, q4Score, q5Score]
      });
  
      setListofProtocols([...listofProtocols]);
    } catch (error) {
      console.error('There was an error with the addProtocol request:', error);
    }
  };
   
  
  return (
    <div className="App">
      <h1>Aegis Protocol Tracker</h1>
      <h4>Live Responses</h4>
      {listofDisputes.map((dispute) => {
        return (
          <div key={dispute._id}>
            <h3>{dispute.protocol}</h3>
            <p>{dispute.question1}</p>
            <p>{dispute.question2}</p>
            <p>{dispute.question3}</p>
            <p>{dispute.question4}</p>
            <p>{dispute.question5}</p>
          </div>
        );
      })}
      <h4>Protocol Leaderboards</h4>
      {listofProtocols.map((protocol) => {
        return (
          <div key={protocol._id}>
            <h3>{protocol.protocol}</h3>
            <p>{protocol.q1Score}</p>
            <p>{protocol.q2Score}</p>
            <p>{protocol.q3Score}</p>
            <p>{protocol.q4Score}</p>
            <p>{protocol.q5Score}</p>
          </div>
        );
      })};
        <div>
            {/* <input type="text" placeholder="Enter your address" onChange={(event) => setAddressFrom(event.target.value)} /> */}
            <input type="text" placeholder="Protocol Name" onChange={(event) => setProtocol(event.target.value)}/>
            <input type="number" placeholder="Question 1" onChange={(event) => {setQuestion1(parseInt(event.target.value)); setQ1Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 2" onChange={(event) => {setQuestion2(parseInt(event.target.value)); setQ2Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 3" onChange={(event) => {setQuestion3(parseInt(event.target.value)); setQ3Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 4" onChange={(event) => {setQuestion4(parseInt(event.target.value)); setQ4Score(parseInt(event.target.value))}}/>
            <input type="number" placeholder="Question 5" onChange={(event) => {setQuestion5(parseInt(event.target.value)); setQ5Score(parseInt(event.target.value))}}/>
            <button onClick={addDispute}>Submit</button>
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
