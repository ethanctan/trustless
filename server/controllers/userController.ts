import UserModel from "../models/user/UserModel"
import User, { NullUser } from "../models/user/User";


export default class UserController{


    // need to make new function to take in a req and parse the req
    async handlePostRequest(user : User) : Promise<string> {
        const userWallet = await UserModel.findOne({ walletId: user["walletId"] });

        
        if (userWallet == null){
            return await this.addUserToDatabase(user)
        }
        return await this.handleKnownUser("", userWallet.id)

    }

    /** Assumes that user does not exist in the database */
    private async addUserToDatabase(user : User){
        let userModel;
        user["referredUsers"] = user["numReferredUsers"]
        user["referralCode"] = this.generateCode()
        user.cookieId = "null"
        userModel = await new UserModel(user)
        await userModel.save()
        return "added user to database"
    }
    

    private handleKnownUser(userCookie : string, userWallet : string){
        return "correct user-wallet pair"
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


    async handleCheckUserExists(cookieId : string){
        const user = await UserModel.findOne({ cookieId: cookieId });
        if (!user) return false
        return true
    }

    private generateCode(codeLength = 8) : string {
        const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let code = ""
        for (let i=0; i < codeLength; i++){
            code += str.charAt(Math.floor(Math.random() * (str.length+1)));
        }
        return code
    }
    
    
}

