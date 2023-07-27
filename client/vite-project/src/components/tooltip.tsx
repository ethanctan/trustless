import { Tooltip } from '@mui/material';

//@ts-ignore
export default function TooltipComponent({toolTipTitle, classNamePath, title}){
    return(
        <li>
        <Tooltip title={toolTipTitle} placement="top" arrow>
            <span
              className={`${
                location.pathname === classNamePath ? "text-purple-400 text-glow " : "text-gray-400 "
              }`}
            >
              {title}
            </span>
          </Tooltip> 
        </li>
    )
}