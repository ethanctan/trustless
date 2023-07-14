import mongoose from "mongoose";
import { IRating, IUser } from "./UserModel";

class Rating{

    scores : number[];
    code : string
    constructor(scores : number[], code?: string){
        this.scores = scores
        if (code == null){
            this.code = ""
        }else{
            this.code = code
        }
    }

    static fromIRating(rating : IRating){
        return new this(rating.scores, rating.code)
    }

    getRatingObject(){
        return {scores: this.scores, code: this.code}
    }
}

export default class User{

    cookieId: string;
    walletId: string;
    referralCode: string;
    referredUsers: Map<string, String> ;
    protocolRatings: Map<string, Rating> ;
    
    constructor(
        cookieId: string,
        walletId: string,
        referralCode ?: string,
        referredUsers ?: Map<string, string>,
        protocolRatings ?: Map<string, Rating>){
            this.cookieId = cookieId
            this.walletId = walletId

            if (referralCode == null){
                this.referralCode = ""
            }else{
                this.referralCode = referralCode
            }
           
            if (!referredUsers){
                this.referredUsers = new Map()
            }else{
                this.referredUsers = referredUsers
            }
            
            if (!protocolRatings){
                this.protocolRatings = new Map()
            }else{
                this.protocolRatings = protocolRatings
            }
    }

    static getUserFromRequest(){

    }

    static getUserFromModel(model : mongoose.Document<User>){
        
    }

    getReferralCode(){
        return this.referralCode
    }

    

    

    getUid(){
        return {"cookieId": this.cookieId, "walletId": this.walletId}
    }

    getReferredUsers(){
        return this.referredUsers
    }

    getProtocolRatings(){
        return this.protocolRatings
    }

    addReferredUser(referee : string, protocol : string){
        this.referredUsers.set(referee, protocol)
    }

    setProtocolRating(protocol : string, rating : Rating){
        this.protocolRatings.set(protocol, rating)
    }

    setProtocolRatingString(
        protocol : string, score : number[], referral?: string){
        let rating = new Rating(score, referral)
        this.protocolRatings.set(protocol, rating)
    }

    protocolExistsInRating(protocol : string){
        return Boolean(this.protocolRatings.get(protocol))
    }

    getProtocolRatingObject(){
        let protocolRatingObject = 
        Array.from(this.protocolRatings).reduce((obj : any, 
                                        [key, value] : [string, Rating])=>{
            {
                obj[key] = value.getRatingObject()
                return obj
            }
        }, {})
        return protocolRatingObject
    }

    getReferredUsersObject(){
        let referredUsersObject  = 
        Array.from(this.referredUsers).reduce((obj : any, [key, value] : any)=>{
            {
                obj[key] = value
                return obj
            }
        }, {})
        return referredUsersObject
    }

    static convertIRatingToRating(iRatings : Map<string, IRating>){
        let referredUsersObject  = new Map<string, Rating>()
        Array.from(iRatings).reduce((obj : any, [key, value] : [string, any])=>{
            {
                referredUsersObject.set(key, Rating.fromIRating(value))
            }
        }, {})
        return referredUsersObject
    }

    getUserObject() : object{
        let referredUsersObject = this.getProtocolRatingObject()
        let getProtocolRatingObject = this.getProtocolRatingObject()
        let userObject = {
            "cookieId": this.cookieId, "walletId": this.walletId, 
            "referralCode": this.referralCode, 
            "referredUsers": referredUsersObject,
            "protocolRatings": getProtocolRatingObject
        }
        return userObject
    }




    

}