import { useCountdown } from "../hooks/countdown";
import { ICountdownDisplay, ICountdownTimer, IDateTimeDisplay, IShowCounter } from "../utils/components";
import { useEffect, useState, useMemo } from "react";
import { EpochCount } from "../utils/interfaces";
import Axios from "axios";

/**
 * @param targetDate Date the countdown timer counts down to in the form
 * YYYY-MM-DD. See javascript date docs for more info
 */ 

// This is the top-level component that is returned
function CountdownDisplay(){
  return <CountdownTimer 
  ExpiredDisplay={ExpiredNotice} 
  CountdownDisplay={ShowCounter}
  />
}

export function CountdownTimer({ExpiredDisplay, CountdownDisplay} : ICountdownTimer){
  const [targetDate, setTargetDate] = useState<null | Date>(null); // this is the date that the timer counts down to
  const [epoch, setEpoch] = useState(0);
  const [surveyStatus, setSurveyStatus] = useState("");
  const now = new Date();

  // Get existing epoch and survey status
  useEffect(() => {
    Axios.get<EpochCount[]>('http://localhost:3001/epochCount/').then((response) => {
    setEpoch(response.data[0].epochCount);
    setSurveyStatus(response.data[0].surveyStatus);
    setTargetDate(new Date(response.data[0].targetDate));
    console.log("Epoch (timer component): " + response.data[0].epochCount)
    console.log("Survey status (timer component): " + response.data[0].surveyStatus.toString())
    console.log("Target date (timer component): " + response.data[0].targetDate.toString())
  });
  }, []);

  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  // If surveyStatus is before, then the threshold is the start of the next month and we will update only surveystatus
  if (surveyStatus === "before" && targetDate) {
    if (now >= targetDate) {
      Axios.post('http://localhost:3001/epochCount/setSurveyStatus', {
        surveyStatus: "during"
      }).then((response) => {
        console.log(response);
      });

      // add 3 days to the target date; no additional logic is needed since the date is already set to the first of the month
      const currentDay = targetDate.getDate();
      const currentMonth = targetDate.getMonth();
      const currentYear = targetDate.getFullYear();
      const targetDay = currentDay + 3;
      const newTargetDate = new Date(currentYear, currentMonth, targetDay);

      Axios.post('http://localhost:3001/epochCount/setTargetDate', {
        targetDate: newTargetDate
      }).then((response) => {
        console.log(response);
      });
    }
  }

  // If surveyStatus is during, then the threshold for the next epoch is 3 days and we will update both surveystatus and epoch
  // that means surveys will take place during the first 3 days of each month
  if (surveyStatus === "during" && targetDate) {
    if (now >= targetDate) {
      Axios.post('http://localhost:3001/epochCount/increment', {
      }).then((response) => {
        console.log(response);
      });

      Axios.post('http://localhost:3001/epochCount/setSurveyStatus', {
        surveyStatus: "before"
      }).then((response) => {
        console.log(response);
      });

      // set target date to start of next month
      const currentMonth = targetDate.getMonth();
      const currentYear = targetDate.getFullYear();
      const targetYear = currentMonth == 11 ? currentYear + 1 : currentYear;
      const targetMonth = currentMonth == 11 ? 0 : currentMonth + 1;
      const targetDay = 1;
      const newTargetDate = new Date(targetYear, targetMonth, targetDay);

      Axios.post('http://localhost:3001/epochCount/setTargetDate', {
        targetDate: newTargetDate
      }).then((response) => {
        console.log(response);
      });

    }
  }

  return (
    //@ts-ignore
    <CountdownDisplay timeUntilDeadline={[days, hours, minutes, seconds]} surveyStatus={surveyStatus} /> // this component refers to ShowCounter
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
  


function ShowCounter({ timeUntilDeadline, surveyStatus } : IShowCounter){
    let [ days, hours, minutes, seconds] = timeUntilDeadline 

    return (
        <div className="show-counter text-zinc-300 shadow-2xl shadow-purple-800/70 unbounded text-4xl md:text-5xl p-7 bg-gradient-to-br from-purple-500/80 via-indigo-500/80 to-blue-500 lg:w-1/2 w-full bg-opacity-80 backdrop-filter backdrop-blur-md rounded-2xl flex flex-col">
          <p className="unbounded text-2xl font-light mb-2"> {surveyStatus === 'before'? `Ratings open in:` : `Ratings close in:`} </p>
          <div className="unbounded w-full flex flex-row justify-center items-end">
            {days} <a className="font-light text-3xl ml-1">d&nbsp;</a>
            {hours} <a className="font-light text-3xl ml-1">h&nbsp;</a>
            {minutes} <a className="font-light text-3xl ml-1">m&nbsp;</a>
            {seconds} <a className="font-light text-3xl ml-1">s&nbsp;</a>
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