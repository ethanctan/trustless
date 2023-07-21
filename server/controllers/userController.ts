import UserModel from "../models/user/UserModel"
import User, { NullUser } from "../models/user/User";


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
    
}

// /** @returns a random alphanumeric code with length codeLength */
// function generateCode(codeLength = 8) : string {
//     const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
//     let code = ""
//     for (let i=0; i < codeLength; i++){
//         code += str.charAt(Math.floor(Math.random() * (str.length+1)));
//     }
//     return code
// }


