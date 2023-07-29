import { ethers } from "ethers";
import {DefiData} from '../utils/interfaces.ts'

export interface INavbar {
    passAccount: (account: string) => void;
    passContracts: (contracts: { trust: ethers.Contract; trustStaking: ethers.Contract; }) => void;
  }

export interface INavlinkComponent {
    to: string;
    classNamePath: string;
    title: string;
}

export interface IQuestionPrompt {
    text: string;
    title: string;
}

export interface IModifiedSlider {
    questionScore: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
}

export interface IQuestion {
    questionScore: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    text: string;
    title: string;
}

export interface ISearchBar {
    protocol: string;
    defiData: DefiData[];
    handleSetProtocol: (protocol: string) => void;
}

export interface ISubmissionTable {
    headings: string[];
    submissions: any[];
    RowGenerator: (submission : any) => JSX.Element;
}

export interface ICountdownDisplay {
    targetDate: Date;
}

export interface ICountdownTimer {
    targetDate: Date;
    ExpiredDisplay: any;
    CountdownDisplay: any;
}

export interface IShowCounter {
    timeuntildeadline: number[];
}

export interface IDateTimeDisplay {
    value: string | number;
    type: string;
    isDanger: boolean;
}

export interface ITooltipComponent {
    toolTipTitle: string;
    classNamePath: string;
    title: string;
}










