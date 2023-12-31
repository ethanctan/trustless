import { ethers } from "ethers";
import {DefiData} from '../utils/interfaces.ts'

export interface INavbar {
    passAccount: (account: string) => void;
    passContracts: (contracts: { trust: ethers.Contract; trustStaking: ethers.Contract; trustStakingHelper: ethers.Contract}) => void;
    passProvider: (provider: ethers.providers.Web3Provider) => void;
    pendingState: boolean;
  }

export interface INavlinkComponent {
    to: string;
    classNamePath: string;
    title: string;
    onClick: () => void;
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
}

export interface ICountdownTimer {
    ExpiredDisplay: any;
    CountdownDisplay: any;
}

export interface IShowCounter {
    timeUntilDeadline: number[];
    surveyStatus: 'before' | 'during';
    epochNumber: number;
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

export interface IPendingCheck {
    txHash: string;
    provider : ethers.providers.JsonRpcProvider
}










