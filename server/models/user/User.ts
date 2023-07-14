import mongoose from "mongoose";
import { IRating, IUser } from "./UserModel";
var _ = require('lodash');

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
    isNull(): boolean {return false}
}

class NullRating extends Rating{
    constructor(){
        super([0,0,0,0,0], "")
    }
    isNull(): boolean {return true}
}

type UserDocument = (mongoose.Document<unknown, {}, IUser> & Omit<IUser & {
    _id: mongoose.Types.ObjectId;
}, never>)

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

    isNull() : boolean{ return false }

    /**
     * Instantiates user from object. Assumes that object is properly formatted
     */
    static getUserFromObject(obj : object) : User {
        let user = new User(
            obj["cookieId"], obj["walletId"], obj["referralCode"])
        let referredUsers = _.keyBy(obj["referredUsers"])
        let protocolRatings = _.keyBy(obj["protocolRatings"])
        
        user.referredUsers = referredUsers
        user.protocolRatings = protocolRatings
        return user
    }

    // TODO Figure out how to make type easier to read
    static getUserFromDocument(document : UserDocument){
        let a = document.walletId

        let protocolRatings = new Map(Array.from(
            document.protocolRatings,
             ([k, v] : [string, IRating]) => [k, Rating.fromIRating(v)]
        ))
        return new this(
            document.cookieId, document.walletId, document.referralCode, 
            document.referredUsers, protocolRatings)
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
        let referredUsersObject = this.getReferredUsersObject()
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

class NullUser extends User{
    
    isNull() : boolean {return true}

    constructor(){
        super("", "", "")
    }
}

export {NullUser, NullRating, Rating}