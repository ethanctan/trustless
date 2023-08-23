
import { Tooltip } from '@chakra-ui/react'
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
  } from '@chakra-ui/react'
  import { IQuestion, IModifiedSlider, IQuestionPrompt } from '../utils/components';

function QuestionPrompt({text, title} : IQuestionPrompt){
    return (
    <div className="col-span-3 flex items-center justify-left pl-6">
        <p className="text-left">
            <span className="mr-2">{title}</span>
        </p>
        <Tooltip className="poppins" label={text} placement="top" hasArrow>
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

function ModifiedSlider({questionScore, setScore} : IModifiedSlider){
    return (
    <div className="col-span-4 flex items-center w-full my-3">
        <Slider 
            defaultValue={questionScore} 
            value={questionScore}
            min={1} 
            max={10} 
            step={1}
            onChange={(value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value;
                setScore(selectedValue);
            }}
        >
            <SliderTrack bg='blue.700'>
                <SliderFilledTrack bg='blue.500' />
            </SliderTrack>
            <SliderThumb boxSize={3} />
        </Slider>
    </div>
    )
}

function Question({questionScore, setScore, text, title} : IQuestion){
    // const [questionScore, setQuestionScore] = useState<number>(1);

    return (
        <div className="grid grid-cols-8 text-lg md:text-base">
        <QuestionPrompt text={text} title={title} />
        <ModifiedSlider questionScore={questionScore} setScore={setScore}/>
            
        <div className="flex items-center justify-center">
            <p className=" text-zinc-300 ml-2 font-mono">
                {questionScore}
            </p>
        </div>
        </div>
    )
}

export {Question, QuestionPrompt, ModifiedSlider};