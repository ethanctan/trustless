/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserModel from '../../models/user/UserModel';
import UserController from '../../controllers/userController';
import User, { Rating, NullRating } from '../../models/user/User';
import { trace } from 'console';

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


function createUid(cookieId: string, walletId: string){
  return {cookieId: cookieId, walletId: walletId}
}


const basicTestUser = new User("Sky", "does", "Minecraft")

async function addToDatabase(user : User){
 let userModel = new UserModel(user.getUserObject())
 await userModel.save()
} 

describe('Single MongoMemoryServer', () => {

  it("Should return a string ", async() => {
    let userController = new UserController(UserModel)
    let user = new User("uwu", "owo", "awa")
    let secondUser = new User("Sky", "does", "minecraft")

    async function testHandlePostRequest(
      cookieId: string, walletId: string, referralCode: string, expected : string
      ){
      let user = new User(cookieId, walletId, referralCode)
      let res = await userController.handlePostRequest(user.getUserObject())
      expect(res).toBe(expected)
    }

    await UserModel.insertMany([
      user.getUserObject(), secondUser.getUserObject()])
    
    // Existent cookie, non identifiable wallet
    await testHandlePostRequest("uwu", "bruh", "awa", "non existent wallet")
    
    // Wrong cookie wallet pair
    await testHandlePostRequest("uwu", "does", "awa", "wrong user-wallet pair")

    // Correct cookie wallet pair
    await testHandlePostRequest("Sky", "does", "minecraft", "correct user-wallet pair")

    // Re-assign user
    await testHandlePostRequest("Your mom", "does", "minecraft", "reassigned user")
  })

});


describe("Test referral code ",  () => {
  it("Should return true after adding referral code", async () => {
    let userController = new UserController(UserModel)
    let user = new User("Sky", "does", "Minecraft")
    let userModel = new UserModel(user.getUserObject())
    await userModel.save()
    trace()
    let response = await userController.checkReferralCodeExists("Minecraft");
    expect(response).toBe(true)
  })

  it("Should return false due to nonexistent referral code", async () => {
    let userController = new UserController(UserModel)
    trace()
    let response = await userController.checkReferralCodeExists("null");
    expect(response).toBe(false)
  })
})
    
describe("Test upsert rating", () => {

  
  it("Should return should return failure message for nonexistent user", async () => {
    let userController = new UserController(UserModel)
    let uid = createUid("Hello", "world")
    let rating = createRating("protocol", [1,2,3,4,5])
    let response = await userController.upsertRating(uid, rating);
    expect(response).toBe("user not found")
  })

  it("should return rating added if user exists and new protocol is added", async () => {
    let userController = new UserController(UserModel)
    let userModel = new UserModel(basicTestUser.getUserObject())
    await userModel.save()

    let protocolRating = createProtocolRating("MakerDao", "Your mom", [1,2,3,4,5])
    let response = await userController.upsertRating(basicTestUser, protocolRating)

    expect(response).toBe("rating added")
  })

  it("should return rating updated if user exists and new protocol is updated", async () => {
    let userController = new UserController(UserModel)
    let user = new User("Sky", "does", "Minecraft")
    let userModel = new UserModel(user.getUserObject())
    await userModel.save()

    let protocolRating = createProtocolRating("Sky", "Does", [1,2,3,4,5])
    let response = await userController.upsertRating(user, protocolRating)

    expect(response).toBe("rating added")
  })



})

describe("Test add referral", () => {
  it("Should return an error", async () => {
    let userController = new UserController(UserModel)
    
    let response = await userController.addReferral(basicTestUser, "")
    expect(response).toBe("user not found")
  })

  it("should return an error due to user adding themself", async () => {
    let userController = new UserController(UserModel)
    await addToDatabase(basicTestUser)
    let response = await userController.addReferral(basicTestUser, basicTestUser.getReferralCode())
    expect(response).toBe("user submitted own referral code")
  })

  it("Should return success message when user adds message", async () => {
    let userController = new UserController(UserModel)
    await addToDatabase(basicTestUser)
    let testUser2 = new User("foo", "bar", "baz")
    await addToDatabase(testUser2)
    let response = await userController.addReferral(testUser2, basicTestUser.getReferralCode())
    expect(response).toBe("successfully added/updated referral code")
  })

})

describe("Test get user info", () => {
  it("Should return an error message for unfound users", async () => {
    let userController = new UserController(UserModel)
    let response = await userController.getUserInfo("hello")
    expect(response.isNull()).toBe(true)
  })

    // TODO: Install and use lodash for inequality
  it("Should return a user for existing users", async () => {
    let userController = new UserController(UserModel)
    await addToDatabase(basicTestUser)
    let response = await userController.getUserInfo(basicTestUser.cookieId)
    expect(response["cookieId"] == basicTestUser.cookieId).toBe(true)
  })
})

describe("Test getUserRating", () =>{
    it("Should return a null rating", async () =>{
      let userController = new UserController(UserModel)
      await addToDatabase(basicTestUser)
      let response = await userController.getUserRating("", "", "")
      expect(response.isNull()).toBe(true)
    })

    it("Should return a rating", async () => {
      let userController = new UserController(UserModel)
      basicTestUser.protocolRatings.set("foo", new Rating([1,1,1,1,1], "bar"))
      await addToDatabase(basicTestUser)
      let response = await userController.getUserRating(
        basicTestUser.cookieId, basicTestUser.walletId, "foo"
      )
      expect(response.code).toBe("bar")
    })
    
  })


function createRating(protocol : string, score : number[]){
  return  {protocol: protocol, qScore: score} 
}

function createProtocolRating(protocol : string, referral : string, score : number[]){
  return {protocol: protocol,
          rating: {
            score : score,
            referral : referral
          }}
}