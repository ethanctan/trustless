import UserModel, { RatingModel, ReferralModel } from "../models/user/UserModel"
import express, { Request, Response } from 'express';
import mongoose from "mongoose"
import User, {NullUser, Rating, NullRating} from "../models/user/User";
import { errors } from "ethers";

export default class UserController{

    database : mongoose.Model<any>

    constructor(database : mongoose.Model<any>){
        this.database = database
    }

    async handlePostRequest(user : object){
        const userCookie = await this.database.findOne({ cookieId: user["cookieId"] });
        const userWallet = await this.database.findOne({ walletId: user["walletId"] });

        let userCookieExists = Boolean(userCookie)
        let userWalletExists = Boolean(userWallet)
        switch (true){
            case (!userCookieExists && userWalletExists):
                this.updateUserCookies(user, userWallet)
                return "reassigned user"
            case (userCookieExists && !userWalletExists):
                return "non existent wallet"
            case (userCookieExists && userWalletExists):
                return this.handleKnownUser(userCookie.id, userWallet.id)
            default:
                await this.addUserToDatabase(user)
                return "added user to database"
        }
    }

    async addUserToDatabase(user : object){
        let userModel;
        if (user instanceof User){
            userModel = new UserModel(user.getUserObject())
        }else{
            userModel = new UserModel({
                cookieId: user["cookieId"],
                walletId: user["walletId"],
                referralCode: user["referralCode"],
                referredUsers: new Map(),
                protocolRatings: new Map()
            });
        }
        
        await userModel.save()
    }

    private async updateUserCookies(user : object, userWallet : any){
        userWallet.cookieId = user["cookieId"];
        await userWallet.save();
    }

    private handleKnownUser(userCookie : string, userWallet : string){
        if (userCookie != userWallet){
            return "wrong user-wallet pair"
        }
        return "correct user-wallet pair"
    }

    async checkReferralCodeExists(referralCode : string){
        try{
            const referralCodeExists = await UserModel.findOne({ 
                referralCode: referralCode });
            return Boolean(referralCodeExists)
        }catch(err){
            console.log("Error", err)
            return false
        }
    }

    /**
     * Adds rating to the database for a user. If user already has rating, 
     * update it instead. Returns a success/failure message
     * If user doesn't exist, then 
     * @param userIdentity 
     * @param rating 
     */
    async upsertRating(userIdentity : object, rating : object){
        
        const user = await UserModel.findOne({ 
            cookieId: userIdentity["cookieId"], 
            walletId: userIdentity["walletId"] 
        });
        if (!user) 
            return 'user not found'
        
        const newRating = new RatingModel({
            code : rating["code"], scores : rating["scores"]
        })

        let protocolName = rating["protocol"]
        let ratingExists = Boolean(user.protocolRatings.get(protocolName))
        user.protocolRatings.set(rating["protocol"], newRating);
        if (ratingExists){
            return "rating updated successfully"
        }
        return "rating added"
    }

    /**
     * Adds referee to the referrer's map of referred user
     * Should not allow users to add themselves as a referrer
     * @param referee 
     * @param referrerCode 
     */
    async addReferral(referee : User, referrerCode : string){
        const referrer = await this.database.findOne({
            referralCode : referrerCode})
        let status = this.checkReferralConditions(referee, referrer)
        if (status != "valid"){
            return status
        }

        const referralModel = new ReferralModel({protocol : referrerCode})
        referrer.referredUsers.set(referee.walletId, referralModel)
        await referrer.save()
        return "successfully added/updated referral code"
    }

    private checkReferralConditions(user : User, referrer : object){
        if (!referrer){
            return "user not found"
        }

        if (referrer["walletId"] == user["walletId"] || 
                referrer["cookieId"] == user["cookieId"]){
            return "user submitted own referral code"
        }

        return "valid"
    }



    /**
     * Gets a user based on userId. Returns user object and success message
     * if found and returns only message otherwise
     * @param cookieId 
     */
    async getUserInfo(cookieId : string) : Promise<User> {
        let user = await UserModel.findOne({ cookieId: cookieId})
        if (!user){
            return new NullUser()
        }
        let ret = User.getUserFromDocument(user)
        return ret
    }
    
    /**
     * Gets user rating from database. Returns 
     * nullRating user or rating isn't found
     */
    async getUserRating(cookieId : string, 
        walletId : string, protocolName : string) : Promise<Rating>{
            const user = await UserModel.findOne(
                { cookieId: cookieId, walletId: walletId });
            if (!user){
                return new NullRating()
            }
            const rating = user.protocolRatings.get(protocolName);
            if (!rating) return  new NullRating()

            return Rating.fromIRating(rating)
    }

    private async findUser(condition : object) : Promise<User>{
        const user = await UserModel.findOne(condition)
        if (user == null){
            throw new Error("user not found")
        }
        
        let protocolRatings = User.convertIRatingToRating(user.protocolRatings)
        let returnedUser = new User(
            user.cookieId, user.walletId, user.referralCode, 
            user.referredUsers, protocolRatings)

        return returnedUser
    }
}

/** @returns a random alphanumeric code with length codeLength */
function generateCode(codeLength = 8) : string {
    const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let code = ""
    for (let i=0; i < codeLength; i++){
        code += str.charAt(Math.floor(Math.random() * (str.length+1)));
    }
    return code
}


