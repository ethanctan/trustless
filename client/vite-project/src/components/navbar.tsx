import Button from "./button";
import { Link, NavLink, useLocation } from "react-router-dom";

// @ts-ignore
export default function Navbar({ buttonFxn }) {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 w-full py-2 z-50 bg-slate-800/60 backdrop-blur-lg poppins flex flex-row ">
      <ul className="flex items-center justify-start space-x-8 px-8 py-2">
        <li>
          <NavLink
            to="/"
            className={`${
              location.pathname === "/" ? "text-purple-400 text-glow" : "text-gray-400 hover:text-gray-100"
            }`}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/airdrop"
            className={`${
              location.pathname === "/airdrop" ? "text-purple-400 text-glow " : "text-gray-400 hover:text-gray-100"
            }`}
          >
            Claim Airdrop
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mechanics"
            className={`${
              location.pathname === "/mechanics" ? "text-purple-400 text-glow " : "text-gray-400 hover:text-gray-100"
            }`}
          >
            Mechanics
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/submitRatings"
            className={`${
              location.pathname === "/submitRatings" ? "text-purple-400 text-glow " : "text-gray-400 hover:text-gray-100"
            }`}
          >
            Submit Ratings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/viewRatings"
            className={`${
              location.pathname === "/viewRatings" ? "text-purple-400 text-glow " : "text-gray-400 hover:text-gray-100"
            }`}
          >
            View Ratings
          </NavLink>
        </li>
      </ul>
      <div className="ml-auto flex items-center justify-end px-8 py-2">
        <Button text="Connect Wallet" clickFunction={buttonFxn} />
      </div>
    </nav>
  );
}
