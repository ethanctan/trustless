export interface Rating {
    protocol : string;
    epoch : number;
    scores: number[];
    code: string;
}

export interface PostRating {
    protocol : string;
    scores: number[];
    code: string;
}

export interface ProtocolRatings {
    [protocolName: string]: Rating;
}

const emptyRating = {empty : {protocol: "", epoch: 0, scores: [0,0,0,0,0], code : ""}}
export { emptyRating }