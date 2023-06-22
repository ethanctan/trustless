import { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import { ethers } from "ethers";

interface Dispute {
  _id: string; 
  addressFrom: string;
  addressTo: string;
  txnHash: string;
  blockID: number;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

interface User {
  address: string;
}

function App() {
  const [listofDisputes, setListofDisputes] = useState<Dispute[]>([]);
  const [addressFrom, setAddressFrom] = useState<string>("");
  const [addressTo, setAddressTo] = useState<string>("");
  const [txnHash, setTxnHash] = useState<string>("");
  const [blockID, setBlockID] = useState<number>(0);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);


  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setSigner(provider.getSigner());
    }
  }, []);

  useEffect(() => {
    Axios.get<Dispute[]>('http://localhost:3001/getDisputes').then((response) => {
      setListofDisputes(response.data);
    });
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // If user has granted access and there are accounts available
        if (accounts && accounts.length > 0) {
          // The array `accounts` holds the addresses, with the user's primary account at index 0
          setAddress(accounts[0]); // Pass the user's address to the setAddress function
          setAddressFrom(accounts[0]);
          Axios.post<User[]>('http://localhost:3001/addUser', {
            address: accounts[0],
          }).then((response) => {
            console.log("User added!");
          })
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Install MetaMask!");
    }
  };  

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
      <button onClick={connectWallet}>Connect Your Wallet</button>
      <h6>{address ? "Wallet Connected!" : ""}</h6>
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
            {/* <input type="text" placeholder="Enter your address" onChange={(event) => setAddressFrom(event.target.value)} /> */}
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
