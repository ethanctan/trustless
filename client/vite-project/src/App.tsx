import { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';

interface Dispute {
  _id: string; 
  addressFrom: string;
  addressTo: string;
  txnHash: string;
  blockID: number;
}

function App() {
  const [listofDisputes, setListofDisputes] = useState<Dispute[]>([]);
  const [addressFrom, setAddressFrom] = useState<string>("");
  const [addressTo, setAddressTo] = useState<string>("");
  const [txnHash, setTxnHash] = useState<string>("");
  const [blockID, setBlockID] = useState<number>(0);

  useEffect(() => {
    Axios.get<Dispute[]>('http://localhost:3001/getDisputes').then((response) => {
      setListofDisputes(response.data);
    });
  }, []);

  const addDispute = () => {
    Axios.post('http://localhost:3001/addDispute', {
      addressFrom: addressFrom,
      addressTo: addressTo,
      txnHash: txnHash,
      blockID: blockID,
    }).then((response) => {
      setListofDisputes([...listofDisputes, {
        _id: response.data._id,  
        addressFrom: addressFrom,
        addressTo: addressTo,
        txnHash: txnHash,
        blockID: blockID
      }]);
    });
  };
  
  return (
    <div className="App">
      <h1>Dispute Resolution</h1>
      {listofDisputes.map((dispute) => {
        return (
          <div key={dispute._id}>
            <h3>{dispute.addressFrom}</h3>
            <h4>{dispute.addressTo}</h4>
            <h5>{dispute.txnHash}</h5>
            <h6>{dispute.blockID}</h6>
          </div>
        );
      })}
      <div>
            <input type="text" placeholder="Enter your address" onChange={(event) => setAddressFrom(event.target.value)} />
            <input type="text" placeholder="Enter the address you are disputing" onChange={(event) => setAddressTo(event.target.value)}/>
            <input type="text" placeholder="Enter the transaction hash" onChange={(event) => setTxnHash(event.target.value)}/>
            <input type="number" placeholder="Enter the block ID" onChange={(event) => {
                let num = Number(event.target.value);
                setBlockID(isNaN(num) ? 0 : num);
            }}/>
            <button onClick={addDispute}>Submit</button>
          </div> 
    </div>
  );
}

export default App;
