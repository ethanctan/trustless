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
    private numReferredUsers: number;
    private protocolRatings: Map<string, Rating> ;
    
    constructor(
        cookieId: string,
        walletId: string,
        referralCode ?: string,
        referredUsers ?: number,
        protocolRatings ?: Map<string, Rating>){
            this.cookieId = cookieId
            this.walletId = walletId

            if (referralCode == null){
                this.referralCode = ""
            }else{
                this.referralCode = referralCode
            }
           
            if (!referredUsers){
                this.numReferredUsers = 0
            }else{
                this.numReferredUsers = referredUsers
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
    static createUserFromObject(obj : object) : User {
        let protocolRatings = _.keyBy(obj["protocolRatings"])

        let user = new User(
            obj["cookieId"], obj["walletId"], obj["referralCode"],
            obj["numReferredUsers"], protocolRatings)
        
        return user
    }

    /** Creates user object based on MongoDB object */
    static createUserFromDocument(document : UserDocument | null){
        if (document == null){
            return new NullUser()
        }

        let protocolRatings = new Map(Array.from(
            document.protocolRatings,
             ([k, v] : [string, IRating]) => [k, Rating.fromIRating(v)]
        ))
        return new this(
            document.cookieId, document.walletId, document.referralCode, 
            document.referredUsers, protocolRatings)
    }

    addReferredUser(){
        this.numReferredUsers += 1
    }
    
    getNumReferrredUsers(){
        return this.numReferredUsers
    }

    setProtocolRating(protocol : string, rating : Rating){
        if (this.protocolRatings.get(protocol)){
            return false
        }
        this.protocolRatings.set(protocol, rating)
        return true
    }

    setProtocolRatingString(protocol : string, score : number[], referral?: string){
        this.setProtocolRating(protocol, new Rating(score, referral))
    }

    /** returns a deep copy of protocol ratings */
    getProtocolRatingCopy(){
        return structuredClone(this.protocolRatings)
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
        let getProtocolRatingObject = this.getProtocolRatingObject()
        let userObject = {
            "cookieId": this.cookieId, "walletId": this.walletId, 
            "referralCode": this.referralCode, 
            "referredUsers": this.numReferredUsers,
            "protocolRatings": getProtocolRatingObject
        }
        return userObject
    }

}

class NullUser extends User{
    
    isNull() : boolean {return true}

    constructor(){
        super("", "")
    }
}

export {NullUser, NullRating, Rating}