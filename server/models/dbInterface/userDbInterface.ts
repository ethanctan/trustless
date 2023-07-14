import mongoose from "mongoose";
import User, { NullUser } from "../user/User";
import UserModel, { IRating, IUser }  from "../user/UserModel";

export default class UserDbInterface{

    database : typeof UserModel;
    constructor(database : typeof UserModel){
        this.database = database
    }


    /**
     * @param condition Object specifying the search conditions
     * @returns A User object if the user is found. 
     * Otherwise returns an empty user
     */
    async findUser(condition : object) : Promise<User>{
        const user = await UserModel.findOne(condition)
        if (user == null){
            return new NullUser()
        }
        let ret = User.getUserFromDocument(user)
        return ret
    }

    /** 
     * Adds user to the database. Returns true if user has been added to
     * database. Returns false if user already exists in database or adding fails
     */
    async addUserToDatabase(user : User){
        let userModel;
        let userExists = await UserModel.findOne({
            cookieId: user.cookieId, walletId: user.walletId})
        if (userExists){
            return false
        }
        userModel = new UserModel(user.getUserObject())
        await userModel.save()
        return true
    }

    async checkUserExists(user: User){

    }

    async updateUser(user : User){

        let foundUser = await UserModel.findOne({
            cookieId: user.cookieId, walletId: user.walletId
        })
        if (!foundUser){
            return false
        }

        
        return true
    }

    /** Adds user object to the database. Same as addUserToDatabase 
     * Will throw error if user is an invalid object
    */
    async addUserObjectToDatabase(user : object){
        let userModel = new UserModel({
            cookieId: user["cookieId"],
            walletId: user["walletId"],
            referralCode: user["referralCode"],
            referredUsers: new Map(),
            protocolRatings: new Map()
        });
        userModel.save()
    }

}