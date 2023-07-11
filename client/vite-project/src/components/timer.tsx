import { useCountdown } from "../hooks/countdown";

// Used this tutorial: https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks#heading-the-countdown-app

/**
 * @param targetDate Date the countdown timer counts down to in the form
 * YYYY-MM-DD. See javascript date docs for more info
 */ 
//@ts-ignore
function CountdownDisplay({targetDate}){

  return <CountdownTimer 
  targetDate={targetDate} 
  ExpiredDisplay={ExpiredNotice} 
  CountdownDisplay={ShowCounter}
  />
}

//@ts-ignore
export function CountdownTimer({targetDate, ExpiredDisplay, CountdownDisplay}){
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
  

//@ts-ignore
function ShowCounter({ timeuntildeadline }){
    let [ days, hours, minutes, seconds] = timeuntildeadline 
    return (
        <div className="show-counter">
          <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
          <p>:</p>
          <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
          <p>:</p>
          <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
          <p>:</p>
          <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
        </div>
      );
}

//@ts-ignore
const DateTimeDisplay = ({ value, type, isDanger }) => {
    return (
      <div className={isDanger ? 'countdown danger' : 'countdown'}>
        <p>{value}</p>
        <span>{type}</span>
      </div>
    );
  };

export default CountdownDisplay