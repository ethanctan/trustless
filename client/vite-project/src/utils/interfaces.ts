

// export interface Dispute {
//     _id: string; 
//     protocol: string;
//     influencer: string;
//     qVals: [number]
//   }

export interface NewUser {
    cookieId: string;
    walletId: string;
}

export interface Rating {
    scores: number[];
    code: string;
}

export interface ProtocolRatings {
    [protocolName: string]: Rating;
}

export interface UserReferral {
    protocol: string;
}

export interface UserInfo {
    walletId: string;
    referralCode: string;
    protocolRatings: ProtocolRatings;
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

declare global {
    interface Window {
        ethereum: any;
    }
}


