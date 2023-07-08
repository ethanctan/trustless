import { useCountdown } from "../hooks/countdown";

// Used this tutorial: https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks#heading-the-countdown-app


//@ts-ignore
function Timer({targetDate}){
    const [days, hours, minutes, seconds] = useCountdown(targetDate);
    if (days + hours + minutes + seconds <= 0) {
        return <ExpiredNotice />;
    } 
    
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
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
function ShowCounter({ days, hours, minutes, seconds}){
    return (
        <div className="show-counter">
          <a
            href="https://tapasadhikary.com"
            target="_blank"
            rel="noopener noreferrer"
            className="countdown-link"
          >
            <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
            <p>:</p>
            <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
            <p>:</p>
            <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
            <p>:</p>
            <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
          </a>
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

export default Timer