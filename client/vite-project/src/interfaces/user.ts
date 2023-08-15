import { ProtocolRatings, emptyRating } from "../interfaces/rating";

export interface UserIdentity {
    cookieId: string;
    walletId: string;
}

export interface UserReferral {
    protocol: string;
}

export type UserInfo = {
    walletId: string;
    referralCode: string;
    protocolRatings: ProtocolRatings;
}

let emptyUserInfo : UserInfo = {
    walletId : "", referralCode : "", protocolRatings : emptyRating
}

export { emptyUserInfo }