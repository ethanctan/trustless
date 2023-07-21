var _ = require('lodash');
import mongoose from "mongoose";
import MongoMemoryServer from "mongodb-memory-server-core";
import { MongoClient } from "mongodb";
import UserModel from "../models/user/UserModel";
import User from "../models/user/User";

function createUserObject(cookieId: string, walletId: string, referralCode: string,
    numReferrals ?: number) : object{
    numReferrals = checkNumberNull(numReferrals)
    let user = {
        cookieId: cookieId, walletId: walletId, referralCode: referralCode,
        referredUsers: numReferrals, protocolRatings : {}
    }
    
    return user
}

function checkNumberNull(number : number | undefined){
    if (number == null)
        return 0
    return number
}

function createRating(code : string, score : number[]){
    return  {code: code, scores: score} 
}

function isEqualWithDocAndObject(document : mongoose.Document, object : object) : Boolean {
    return _.isEqual(_.omit(document, ["_id"]), object)
}

let testUserObject = createUserObject("uwu", "owo", "awa")


async function addUserToDatabase(user : User){
    let userModel = new UserModel(user.getUserObject())
    await userModel.save()
   } 

export {
    createUserObject, createRating, isEqualWithDocAndObject, testUserObject,
    addUserToDatabase}