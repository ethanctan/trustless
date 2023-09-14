

export interface Protocol {
    disputeCount: number;
    _id: string;
    averageScore: number;
    qScores: [number]
    protocolName: string;
}

export interface GetProtocolResponse {
    protocolName: string;
    disputeCount: number;
    averageScore: number;
    _id: string;
}

export interface IpAdress {
    protocolName: string;
    ipAddress: string;
}

export interface DefiData {
    name: string;
    logo: string;
    _id: string;
}

export interface EpochCount {
    epochCount: number;
    surveyStatus: string;
    targetDate: Date;
    _id: string;
}
