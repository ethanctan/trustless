import { useCountdown } from "../hooks/countdown";
import { ICountdownDisplay, ICountdownTimer, IDateTimeDisplay, IShowCounter } from "../utils/components";
// Used this tutorial: https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks#heading-the-countdown-app

/**
 * @param targetDate Date the countdown timer counts down to in the form
 * YYYY-MM-DD. See javascript date docs for more info
 */ 

function CountdownDisplay({targetDate} : ICountdownDisplay){

  return <CountdownTimer 
  targetDate={targetDate} 
  ExpiredDisplay={ExpiredNotice} 
  CountdownDisplay={ShowCounter}
  />
}

export function CountdownTimer({targetDate, ExpiredDisplay, CountdownDisplay} : ICountdownTimer){
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  if (days + hours + minutes + seconds <= 0) {
      return <ExpiredDisplay />;
  } 
  
  return (
    //@ts-ignore
    <CountdownDisplay timeuntildeadline={[days, hours, minutes, seconds] } />
  );
  }


const ExpiredNotice = () => {
    return (
      <div className="expired-notice">
        <span>Expired!!!</span>
        <p>Please select a future date and time.</p>
      </div>
    );
  };
  

function ShowCounter({ timeuntildeadline } : IShowCounter){
    let [ days, hours, minutes, seconds] = timeuntildeadline 
    return (
        <div className="show-counter text-zinc-300 shadow-2xl shadow-purple-800/70 unbounded text-5xl p-7 bg-gradient-to-br from-purple-500/80 via-indigo-500/80 to-blue-500 lg:w-1/3 w-full bg-opacity-80 backdrop-filter backdrop-blur-md rounded-2xl flex flex-col">
          <p className="unbounded text-2xl font-light mb-2"> Ratings open in: </p>
          <div className="unbounded w-full flex flex-row justify-center">
            <DateTimeDisplay value={hours + (days * 24) < 10 ? `0${hours + (days * 24)}` : hours + (days * 24)} type={'Hours'} isDanger={false} />
            <p>:</p>
            <DateTimeDisplay value={minutes < 10 ? `0${minutes}` : minutes} type={'Mins'} isDanger={false} />
            <p>:</p>
            <DateTimeDisplay value={seconds < 10 ? `0${seconds}` : seconds} type={'Seconds'} isDanger={false} />
          </div>
        </div>
      );
}

const DateTimeDisplay = ({ value, type, isDanger } : IDateTimeDisplay) => {
    return (
      <div className={isDanger ? 'countdown danger' : 'countdown'}>
        <p>{value}</p>
      </div>
    );
  };

export default CountdownDisplay