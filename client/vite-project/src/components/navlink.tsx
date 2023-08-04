import { NavLink } from "react-router-dom";
import { INavlinkComponent } from "../utils/components";
import { useLocation } from 'react-router-dom';

export default function NavlinkComponent({to , classNamePath, title} : INavlinkComponent){
    const location = useLocation();

        return(
            <li>
                <NavLink
                    // key={location.pathname}
                    to={to}
                    className={`${
                    location.pathname === classNamePath ? "text-purple-400 text-glow" : "text-gray-400 hover:text-gray-100"
                    }`}
                    >
                    {title}
                </NavLink>
          </li>
        )          
}