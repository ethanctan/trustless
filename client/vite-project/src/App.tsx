import Navbar from "./components/navbar";
import Home from "./pages/home";
import Mechanics from "./pages/mechanics";
import SubmitRating from "./pages/submitRatings";
import ViewRatings from "./pages/viewRatings";
import Airdrop from "./pages/airdrop";
import {Route, Routes} from "react-router-dom"

function App(){
    return(
        <>
        <Navbar buttonFxn={null}/>
        <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/airdrop" element={<Airdrop />} />
                <Route path="/mechanics" element={<Mechanics />} />
                <Route path="/submitRatings" element={<SubmitRating />} />
                <Route path="/viewRatings" element={<ViewRatings />} />
            </Routes>
        </div>
        </>
    )
}

export default App