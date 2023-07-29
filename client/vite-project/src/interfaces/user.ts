import { ProtocolRatings } from "../interfaces/rating";

export interface UserIdentity {
    cookieId: string;
    walletId: string;
}

export interface UserReferral {
    protocol: string;
}

export interface UserInfo {
    walletId: string;
    referralCode: string;
    protocolRatings: ProtocolRatings;
}