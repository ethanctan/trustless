import Navbar from "./components/navbar";
import Home from "./pages/home";
import Mechanics from "./pages/mechanics";
import SubmitRating from "./pages/submitRatings";
import ViewRatings from "./pages/viewRatings";
import Airdrop from "./pages/airdrop"; 
import Stake from "./pages/stake";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState(""); // global address variable
  const [contracts, setContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract} | null>(null); //global contracts variable

  const passAccount = (account: string) => {
    setAccount(account);
    console.log("global account set: " + account);
  }

  const passContracts = (contracts: {trust: ethers.Contract, trustStaking: ethers.Contract}) => {
    setContracts(contracts);
    console.log("global contracts set: " + contracts.trust.address + " " + contracts.trustStaking.address);
  }

  return (
    <>
      <Navbar passAccount={passAccount} passContracts={passContracts}/>
      <div className="container mx-auto pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/airdrop" element={<Airdrop account={account} contracts={contracts}/>} />
          <Route path="/stake" element={<Stake account={account} contracts={contracts}/>} />
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/submitRatings" element={<SubmitRating account={account}/>} />
          <Route path="/viewRatings" element={<ViewRatings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
