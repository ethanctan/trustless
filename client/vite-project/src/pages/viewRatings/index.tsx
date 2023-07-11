import { CountdownTimer } from '../../components/timer.tsx';
import ProtocolRankingTables from './protocolRankingTables.tsx';

export default function ViewRatings(){
    return (
        <div>
            <CountdownTimer targetDate={"2022-03-08"} 
            ExpiredDisplay={ProtocolRankingTables}
            CountdownDisplay={Counter}/>
        </div>
        
    )
}

//@ts-ignore
function Counter({timeuntildeadline}){
    return (<p>Hello world</p>)
}