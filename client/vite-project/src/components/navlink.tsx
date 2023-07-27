import { NavLink } from "react-router-dom";

//@ts-ignore
export default function NavlinkComponent({to , classNamePath, title}){
        return(
            <li>
                <NavLink
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