import Button from "./button"
import {Link} from "react-router-dom"
// Used tutorial here: https://www.youtube.com/watch?v=SLfhMt5OUPI

//@ts-ignore
export default function Navbar({buttonFxn}){
    return (
        <nav className="nav">
            <ul>
                <li>
                    <Link to="/">About</Link>
                    <Link to="/airdrop">Claim Airdrop</Link>
                    <Link to="/mechanics">Mechanics</Link>
                    <Link to="/submitRatings">Submit Ratings</Link>
                    <Link to="/viewRatings">View Ratings</Link>
                </li>
            </ul>
            <Button text={'Connect Wallet'} clickFunction={buttonFxn}></Button>
        </nav>
    )
}
