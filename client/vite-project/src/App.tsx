import Navbar from "./components/navbar";
import Home from "./pages/home";
import SubmitRating from "./pages/submitRatings";
import ViewRatings from "./pages/viewRatings";
import Airdrop from "./pages/airdrop"; 
import Stake from "./pages/stake";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { EpochCount } from "./utils/interfaces";
import Axios from "axios";

// import { useNetworkMismatch } from "@thirdweb-dev/react";
// import { useSwitchChain } from "@thirdweb-dev/react";
// import { Sepolia } from "@thirdweb-dev/chains";

function App() {
  const [account, setAccount] = useState(""); // global address variable
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null); //global provider variable
  const [contracts, setContracts] = useState<{trust: ethers.Contract, trustStaking: ethers.Contract, trustStakingHelper: ethers.Contract} | null>(null); //global contracts variable
  const [walletInfo, setWalletInfo] = useState<{balance: string, epoch: string} | null>(null);
  const [epoch, setEpoch] = useState("");
  const [pendingState, setPendingState] = useState(false);

  //thirdWeb hooks
  // const isMismatched = useNetworkMismatch();
  // const switchChain = useSwitchChain();

  const passAccount = (account: string) => {
    setAccount(account);
    console.log("global account set: " + account);
  }

  const passContracts = (contracts: {trust: ethers.Contract, trustStaking: ethers.Contract, trustStakingHelper: ethers.Contract}) => {
    setContracts(contracts);
    console.log("global contracts set: " + contracts.trust.address + " " + contracts.trustStaking.address +  " " + contracts.trustStakingHelper.address);
  }

  // set pending state for all transactions
  const passPendingState = (isPending: boolean) => {
    setPendingState(isPending);
    console.log("global pending state set: " + isPending);
  }

  const passProvider = (provider: ethers.providers.JsonRpcProvider) => {
    setProvider(provider);
    console.log("global provider set: " + provider);
  }

  // add params here as needed 
  const getWalletInfo = async (contracts: {trust: ethers.Contract, trustStaking: ethers.Contract, trustStakingHelper: ethers.Contract}) => {
    if (contracts && account) {
      let balance = (await contracts.trust.balanceOf(account)).toString();
      console.log("Wallet info set: " + balance + " " + epoch );
      setWalletInfo({balance, epoch});
    }
  }
  
  useEffect(() => {
    if (account && contracts) {
      getWalletInfo(contracts);
    }
  }, [account, contracts]);

  useEffect(() => {
      Axios.get<EpochCount[]>('http://localhost:3001/epochCount').then((response) => {
      setEpoch(response.data[0].epochCount.toString());
      console.log("Epoch set: " + response.data[0].epochCount.toString())
  });
  }, [])

  // useEffect(() => {
  //   if (isMismatched) {
  //     console.log("Network mismatched")
  //     switchChain(Sepolia.chainId);
  //   }
  // }, [isMismatched]);

  // TODO: Add conditionals to disable pages based on website state
  return (
    <>
      <Navbar passAccount={passAccount} passContracts={passContracts} pendingState={pendingState} passProvider={passProvider}/>
      <div className="container mx-auto pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/airdrop" element={<Airdrop passPendingState={passPendingState} account={account} contracts={contracts} balance={walletInfo?.balance} epoch={walletInfo?.epoch} provider={provider} />} />
          <Route path="/stake" element={<Stake passPendingState={passPendingState} account={account} contracts={contracts} balance={walletInfo?.balance} epoch={walletInfo?.epoch} provider={provider} />} />
          <Route path="/submitRatings" element={<SubmitRating account={account}/>} />
          <Route path="/viewRatings" element={<ViewRatings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
