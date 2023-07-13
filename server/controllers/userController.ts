import UserModel, { RatingModel } from "../models/user/UserModel"
import express, { Request, Response } from 'express';
import mongoose from "mongoose"
import User from "../models/user/User";

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
     * Add referral to user's mapping. If user isn't found, return an error 
     * message
     * @param user 
     * @param referral 
     */
    async addReferral(user : User, referral : string){

    }

    private async findUser(condition : object) : Promise<User>{
        const user = await UserModel.findOne(condition)
        if (user == null){
            throw new Error("User not found")
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


