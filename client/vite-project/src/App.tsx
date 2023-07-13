import Navbar from "./components/navbar";
import Home from "./pages/home";
import Mechanics from "./pages/mechanics";
import SubmitRating from "./pages/submitRatings";
import ViewRatings from "./pages/viewRatings";
import Airdrop from "./pages/airdrop"; 
import Stake from "./pages/stake";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
  const [account, setAccount] = useState(""); // global address variable
  const passAccount = (account: string) => {
    setAccount(account);
    console.log("global account set: " + account);
  }

  return (
    <>
      <Navbar passAccount={passAccount}/>
      <div className="container mx-auto pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/airdrop" element={<Airdrop />} />
          <Route path="/stake" element={<Stake />} /> Uncomment when pages go live */}
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/submitRatings" element={<SubmitRating account={account}/>} />
          <Route path="/viewRatings" element={<ViewRatings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
