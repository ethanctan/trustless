import { Tooltip } from '@mui/material';
import { ITooltipComponent } from '../utils/components';

export default function TooltipComponent({toolTipTitle, classNamePath, title} : ITooltipComponent){
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