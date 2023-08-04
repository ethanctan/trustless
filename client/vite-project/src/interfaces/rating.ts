export interface Rating {
    protocol : string;
    scores: number[];
    code: string;
}

export interface ProtocolRatings {
    [protocolName: string]: Rating;
}

const emptyRating = {empty : {protocol: "", scores: [0,0,0,0,0], code : ""}}
export { emptyRating }