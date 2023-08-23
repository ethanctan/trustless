import { Tooltip } from '@chakra-ui/react'
import { ITooltipComponent } from '../utils/components';

export default function TooltipComponent({toolTipTitle, classNamePath, title} : ITooltipComponent){
    return(
        <li>
          <Tooltip hasArrow className="poppins" label={toolTipTitle}>
            <p className={`${
                location.pathname === classNamePath ? "text-purple-400 text-glow " : "text-gray-400 "
              }`}>
                {title}
              </p>
          </Tooltip> 
        </li>
    )
}