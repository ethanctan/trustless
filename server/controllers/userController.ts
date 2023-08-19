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

    // Edit: changed to walletId
    async handleGetUserInfo(walletId : string) {
        let user = await this.getUserInfo(walletId)
        if (user.isNull()) return {status: 404, 
                                message: { message: user.getErrorMessage() }}
        return {status: 200, message: user.getUserObject()}
    }

    /**
     * Gets a user based on walletId. Returns user object and success message
     * if found and returns only message otherwise
     * @param walletId 
     */
    async getUserInfo(walletId : string) : Promise<User> {
        let user = await UserModel.findOne({ walletId: walletId})
        if (!user){
            return new NullUser("User not found")
        }
        let ret = User.createUserFromDocument(user)
        return ret
    }

    /**
     * @returns list of all valid user addresses
     */
    async getAllUsers() : Promise<String[]> {
        let users = await UserModel.find({})
        let ret = users.map((user : any) => User.createUserFromDocument(user).walletId)

        // Filter out strings that do not have a length of 42 characters
        ret = ret.filter((walletId: string) => walletId.length === 42);
        
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

