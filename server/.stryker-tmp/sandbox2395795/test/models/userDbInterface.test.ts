/* eslint-disable @typescript-eslint/no-non-null-assertion */
// @ts-nocheck

import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../../models/user/User';
import UserDbInterface from '../../models/dbInterface/userDbInterface';
import UserModel from '../../models/user/UserModel';
var _ = require('lodash');

let con: MongoClient;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    con = await MongoClient.connect(mongoServer.getUri(), {});
    await mongoose.connect(mongoServer.getUri())
    });
    
afterEach(async () => {
if (mongoServer) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({})
    }
    }
})

afterAll(async () => {
if (con) {
    await con.close();
}
if (mongoServer) {
    await mongoServer.stop();
}
await mongoose.disconnect()
});

const basicTestUser = new User("Sky", "does", "Minecraft")
async function addToDatabase(user : User){
    let userModel = new UserModel(user.getUserObject())
    await userModel.save()
   } 

describe("Test addUserToDatabase", () => {
    
    it("Should return true", async () => {
        let userDb = new UserDbInterface(UserModel)
        let result = await userDb.addUserToDatabase(basicTestUser)
        expect(result).toBe(true)
    })
    it("Should update the database", async () => {
        let userDb = new UserDbInterface(UserModel)
        await userDb.addUserToDatabase(basicTestUser)
        let response = await UserModel.find({})
        expect(response[0].walletId).toBe(basicTestUser.walletId)
    })
    it("Should return false when multiple users are added", async () => {
        let userDb = new UserDbInterface(UserModel)
        await userDb.addUserToDatabase(basicTestUser)
        let response = await userDb.addUserToDatabase(basicTestUser)
        expect(response).toBe(false)
    })
})

describe("Test findUser", () => {
    it("Should return an empty user", async () => {
        let userDb = new UserDbInterface(UserModel)
        await addToDatabase(basicTestUser)
        let response = await userDb.findUser({walletId: "Hello"})
        expect(response.isNull()).toBe(true)
    })
    it("Should retrieve user", async () => {
        let userDb = new UserDbInterface(UserModel)
        await addToDatabase(basicTestUser)
        let response = await userDb.findUser({cookieId: basicTestUser.cookieId})
        expect(_.isEqual(response, basicTestUser)).toBe(true)
    })
    
})