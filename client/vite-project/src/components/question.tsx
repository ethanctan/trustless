
import { Tooltip } from '@mui/material';
import Slider from '@mui/material/Slider';

//@ts-ignore
function QuestionPrompt({text, title}){
    return (
    <div className="md:col-span-3 flex items-center justify-left pl-6">
        <p className="text-left">
            <span className="mr-2">{title}</span>
        </p>
        <Tooltip title={text} placement="top" arrow>
            <svg fill="#3874cb" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 416.979 416.979" width="14" height="14">
            <g>
                <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
                c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
                c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
                c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
                c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
            </g>
            </svg>
        </Tooltip>
    </div>
    )
}

//@ts-ignore
function ModifiedSlider({questionScore, setScore}){
    return (
    <div className="md:col-span-4 flex items-center">
        <Slider
        min={1}
        max={10}
        step={1}
        defaultValue={questionScore}
        value={questionScore}
        onChange={(event, value) => {
            const selectedValue = Array.isArray(value) ? value[0] : value;
            setScore(selectedValue);
        }}
        marks
        valueLabelDisplay="off"
        />
    </div>
    )
}

//@ts-ignore
function Question({questionScore, setScore, text, title}){
    // const [questionScore, setQuestionScore] = useState<number>(1);

    return (
        <>
       <QuestionPrompt text={text} title={title} />
        <ModifiedSlider questionScore={questionScore} setScore={setScore}/>
            
        <div className="md:col-span-1 flex items-center">
            <p className="text-white ml-2">{questionScore}</p>
        </div>
        </>
    )
}

export {Question, QuestionPrompt, ModifiedSlider};