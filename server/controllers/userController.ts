import UserModel, { RatingModel, ReferralModel } from "../models/user/UserModel"
import UserDbInterface from "../models/dbInterface/userDbInterface";
import User, {NullUser, Rating, NullRating} from "../models/user/User";


export default class UserController{


    // need to make new function to take in a req and parse the req
    async handlePostRequest(user : User) : Promise<string> {
        const userCookie = await UserModel.findOne({ cookieId: user["cookieId"] });
        const userWallet = await UserModel.findOne({ walletId: user["walletId"] });

        let userCookieExists = Boolean(userCookie)
        let userWalletExists = Boolean(userWallet)
        switch (true){
            case (!userCookieExists && userWalletExists):
                await this.updateUserCookies(user, userWallet)
                return "reassigned user"
            case (userCookieExists && !userWalletExists):
                return "non existent wallet"
            case (userCookieExists && userWalletExists):
                //@ts-ignore
                return this.handleKnownUser(userCookie.id, userWallet.id)
            default:
                return await this.addUserToDatabase(user)
        }
    }

    /** Assumes that user does not exist in the database */
    private async addUserToDatabase(user : User){
        let userModel;
        user["referredUsers"] = user["numReferredUsers"]
        userModel = await new UserModel(user)
        await userModel.save()
        return "added user to database"
    }
    

    private async updateUserCookies(user : User, userWallet : any){
        userWallet.cookieId = user.cookieId;
        await UserModel.findOneAndUpdate({_id : userWallet.id}, 
            userWallet, {upsert : true})

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
     * If user doesn't exist, then return error
     * @param userIdentity 
     * @param rating 
     */
    async upsertRating(userIdentity : object, rating : Rating, protocol : string){
        const user = await UserModel.findOne({ 
            cookieId: userIdentity["cookieId"], 
            walletId: userIdentity["walletId"] 
        });
        if (!user) 
            return 'user not found'
        
        const newRating = new RatingModel(
            {scores : rating.scores, code: rating.code})

        let ratingExists = Boolean(user.protocolRatings.get(protocol))
        if (ratingExists){
            return "rating already submitted"
        }
        user.protocolRatings.set(protocol, newRating);
        await user.save()
        return "rating added"
    }

    /**
     * Adds referee to the referrer's map of referred user
     * Should not allow users to add themselves as a referrer
     * @param referee 
     * @param referrerCode 
     */
    async addReferral(referee : User, referrerCode : string){
        const referrer = await UserModel.findOne({
            referralCode : referrerCode})

        let status = this.checkReferralConditions(referee,
                                         User.createUserFromDocument(referrer))
        if (status != "valid" || referrer == null){
            return status
        }
        referrer.referredUsers += 1
        referrer.save()

        return "successfully added/updated referral code"
    }

    private checkReferralConditions(user : User, referrer : User){
        
        if (referrer.isNull()) return "user not found"

        if (referrer.walletId == user.walletId || 
                referrer.cookieId == user.cookieId){
            return "user submitted own referral code"
        }

        return "valid"
    }

    async handleGetUserInfo(cookieId : string) {
        let user = await this.getUserInfo(cookieId)
        if (user.isNull()) return {status: 404, 
                                message: { message: user.getErrorMessage() }}
        return {status: 200, message: user.getUserObject()}
    }

    /**
     * Gets a user based on userId. Returns user object and success message
     * if found and returns only message otherwise
     * @param cookieId 
     */
    async getUserInfo(cookieId : string) : Promise<User> {
        let user = await UserModel.findOne({ cookieId: cookieId})
        if (!user){
            return new NullUser("User not found")
        }
        let ret = User.createUserFromDocument(user)
        return ret
    }

    
    async handleGetRating(cookieId : string, walletId : string, protocolName : string) {
        let rating = await this.getUserRating(cookieId, walletId, protocolName)
        if (rating.isNull()) return { status: 404, 
                                message: {message : rating.getErrorMessage()}}
        return {status : 200, message: rating}
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
                return new NullRating("User not found")
            }
            const rating = user.protocolRatings.get(protocolName);
            if (rating == null) return  new NullRating("Rating not found")

            return Rating.fromIRating(rating)
    }

    

    async handleCheckUserExists(cookieId : string){
        const user = await UserModel.findOne({ cookieId: cookieId });
        if (!user) return false
        return true
    }

    async handleGetAllRatings(cookieId : string, walletId : string){
       let user = await UserModel.findOne(
        { cookieId: cookieId, walletId: walletId });
        if (!user ) return {status: 404, message: 
                        {message : 'User not found'}}
        return {status : 200, message : user.protocolRatings}
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


