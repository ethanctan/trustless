import Navbar from "./components/navbar";
import Home from "./pages/home";
import Mechanics from "./pages/mechanics";
import SubmitRating from "./pages/submitRatings";
import ViewRatings from "./pages/viewRatings";
import Airdrop from "./pages/airdrop"; 
import Stake from "./pages/stake";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { walletConnect } from "@thirdweb-dev/react";

function App() {
  const [account, setAccount] = useState(""); // global address variable
  const [contracts, setContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract} | null>(null); //global contracts variable
  const [walletInfo, setWalletInfo] = useState<{balance: string, epoch: string, stakingStatus: string} | null>(null);

  const passAccount = (account: string) => {
    setAccount(account);
    console.log("global account set: " + account);
  }

  const passContracts = (contracts: {trust: ethers.Contract, trustStaking: ethers.Contract}) => {
    setContracts(contracts);
    console.log("global contracts set: " + contracts.trust.address + " " + contracts.trustStaking.address);
  }

  // add params here as needed 
  const getWalletInfo = async (contracts: {trust: ethers.Contract, trustStaking: ethers.Contract}) => {
      if (contracts && account) {
        let balance = (await contracts.trust.balanceOf(account)).toString();
        let epoch = (await contracts.trustStaking.epochCount()).toString();
        let stakingStatus = (await contracts.trustStaking.allowStaking()).toString();
        console.log("Wallet info set: " + balance + " " + epoch + " " + stakingStatus);
        setWalletInfo({balance, epoch, stakingStatus});
    }
  }

  useEffect(() => {
    if (account && contracts) {
      getWalletInfo(contracts);
    }
  }, [account, contracts]);

  //currently, any transactions can only be reflected after a manuel refresh, need events to update in real time. Also need error handling. 
  return (
    <>
      <Navbar passAccount={passAccount} passContracts={passContracts}/>
      <div className="container mx-auto pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/airdrop" element={<Airdrop account={account} contracts={contracts} balance={walletInfo?.balance} epoch={walletInfo?.epoch} stakingStatus={walletInfo?.stakingStatus}/>} />
          <Route path="/stake" element={<Stake account={account} contracts={contracts} balance={walletInfo?.balance} epoch={walletInfo?.epoch} stakingStatus={walletInfo?.stakingStatus}/>} />
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/submitRatings" element={<SubmitRating account={account}/>} />
          <Route path="/viewRatings" element={<ViewRatings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
