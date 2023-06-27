

export interface Dispute {
    _id: string; 
    protocol: string;
    qVals: [number]
  }

export interface User {
    address: string;
}

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
