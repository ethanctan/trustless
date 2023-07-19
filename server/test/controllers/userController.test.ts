/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserModel from '../../models/user/UserModel';
import UserController from '../../controllers/userController';
import User, { Rating } from '../../models/user/User';

let con: MongoClient;
let mongoServer: MongoMemoryServer;
let userController = new UserController();
let basicTestUser = new User("Sky", "does", "Minecraft");

async function initializeDatabase(){
  userController = new UserController();
  basicTestUser = new User("Sky", "does", "Minecraft");
  await addUserToDatabase(basicTestUser)
}

async function addUserToDatabase(user : User){
  let userModel = new UserModel(user.getUserObject())
  await userModel.save()
 } 


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  con = await MongoClient.connect(mongoServer.getUri(), {});
  await mongoose.connect(mongoServer.getUri());
  await initializeDatabase()
  
});

afterEach(async () => {
  if (mongoServer) {
      const collections = await mongoose.connection.db.collections();
      for (let collection of collections) {
        await collection.drop()
      }
    }
    await initializeDatabase()
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




async function testHandlePostRequest(
  cookieId: string, walletId: string, referralCode: string, expected : string
  ){
    let testUser2 = new User("uwu", "owo", "awa")
    await addUserToDatabase(testUser2);
    let user = new User(cookieId, walletId, referralCode)
    let res = await userController.handlePostRequest(user)
    expect(res).toBe(expected)
}


describe('Test handlePostRequest', () => {

  it("Should test Existent cookie, non identifiable wallet ", async() => {
    await testHandlePostRequest("uwu", "bruh", "awa", "non existent wallet")
  })

  it("Should handle Wrong cookie wallet pair", async () => {
    await testHandlePostRequest("uwu", "does", "awa", "wrong user-wallet pair")
  })

  it("Should handle Correct cookie wallet pair", async () => {
    await testHandlePostRequest("Sky", "does", "minecraft", "correct user-wallet pair")
  })

  it("Should handle Re-assign user", async () => {
    await testHandlePostRequest("Your mom", "does", "minecraft", "reassigned user")
  })

  it("Should add user to database", async () => {
    let response = await userController.handlePostRequest(new User("foo", "bar"))
    expect(response).toBe("added user to database")
  })

  it("Should add user to database and user should exist", async () => {
    await userController.handlePostRequest(new User("foo", "bar"))
    let user = await UserModel.findOne({"cookieId" : "foo"})
    expect(user?.walletId).toBe("bar")
  })

  it("Should successfully reassign user cookie", async () => {
    await userController.handlePostRequest(new User("Your mom", "does"))
    let user = await UserModel.find({"walletId" : "does"})
    let singleUser = await UserModel.findOne({"walletId" : "does"})
    expect(user?.length).toBe(1)
    expect(singleUser?.cookieId).toBe("Your mom")
  })

  it("Should handle correct user cookie pair after reassignment", async () => {
    await userController.handlePostRequest(new User("Your mom", "does"))
    let response = await userController.handlePostRequest(new User("Your mom", "does"))
    expect(response).toBe("correct user-wallet pair")
  })

});


describe("Test checkReferralCodeExists ",  () => {
  it("Should return true after adding referral code", async () => {
    let response = await userController.checkReferralCodeExists("Minecraft");
    expect(response).toBe(true)
  })

  it("Should return false due to nonexistent referral code", async () => {
    let response = await userController.checkReferralCodeExists("null");
    expect(response).toBe(false)
  })
})
    
describe("Test upsert rating", () => {

  it("Should return should return failure message for nonexistent user", async () => {
    let uid = createUid("Hello", "world")
    let rating = new Rating([1,2,3,4,5], "protocol")
    let response = await userController.upsertRating(uid, rating, "uwu");
    expect(response).toBe("user not found")
  })

  it("should return rating added if user exists and new protocol is added", async () => {
    let rating = new Rating([1,2,3,4,5], "Your mom")
    let response = await userController.upsertRating(basicTestUser, rating, "MakerDao")
    expect(response).toBe("rating added")
  })

  it("should return rating added if user exists and new protocol is added", async () => {
    let rating = new Rating([1,2,3,4,5], "Your mom")
    await userController.upsertRating(basicTestUser, rating, "MakerDao")
    let userWithUpdatedRating = await UserModel.findOne({cookieId: "Sky"})
    //@ts-ignore
    expect(userWithUpdatedRating.protocolRatings.get("MakerDao").code).toBe("Your mom")
    //@ts-ignore
    expect(userWithUpdatedRating.protocolRatings.get("MakerDao").scores).toStrictEqual([1,2,3,4,5])
  })


  it("should return rating already submitted if user exists and \
    new protocol is updated", async () => {
    let rating = new Rating([1,2,3,4,5], "Does")
    await userController.upsertRating(basicTestUser, rating, "Sky")
    let updatedRating = new Rating([2,3,4,5,6], "Uwu")
    let response = await userController.upsertRating(basicTestUser, updatedRating, "Sky")
    expect(response).toBe("rating already submitted")
  })

  

})

describe("Test add referral", () => {
  it("Should return an error", async () => {
    let response = await userController.addReferral(basicTestUser, "")
    expect(response).toBe("user not found")
  })

  it("should return an error due to user adding themself", async () => {
    let response = await userController.addReferral(basicTestUser, basicTestUser.referralCode)
    expect(response).toBe("user submitted own referral code")
  })

  it("Should return success message when user adds message", async () => {
    let referee = new User("foo", "bar", "baz")
    await addUserToDatabase(referee)
    let response = await userController.addReferral(referee, basicTestUser.referralCode)
    expect(response).toBe("successfully added/updated referral code")
  })

  it("Should increase number of referred users ", async () => {
    let referee = new User("foo", "bar", "baz")
    await addUserToDatabase(referee)
    await userController.addReferral(referee, basicTestUser.referralCode)
    let resp = await UserModel.findOne({cookieId : "Sky"})
    //@ts-ignore
    expect(resp?.referredUsers).toBe(1)
  })

  it("Should increase number of referred users ", async () => {
    let referee = new User("foo", "bar", "baz")
    await addUserToDatabase(referee)
    await userController.addReferral(referee, basicTestUser.referralCode)
    let referee2 = new User("foo", "bar", "baz")
    await addUserToDatabase(referee2)
    await userController.addReferral(referee2, basicTestUser.referralCode)
    let resp = await UserModel.findOne({cookieId : "Sky"})
    //@ts-ignore
    expect(resp?.referredUsers).toBe(2)
  })

})

describe("Test get user info", () => {
  it("Should return an error message for unfound users", async () => {
    let response = await userController.getUserInfo("hello")
    expect(response.isNull()).toBe(true)
  })

    // TODO: Install and use lodash for inequality
  it("Should return a user for existing users", async () => {
    let response = await userController.getUserInfo(basicTestUser.cookieId)
    expect(response["cookieId"] == basicTestUser.cookieId).toBe(true)
  })
})

describe("Test getUserRating", () =>{
    it("Should return a null rating", async () =>{
      let response = await userController.getUserRating("", "", "")
      expect(response.isNull()).toBe(true)
    })

    it("Should return a rating", async () => {
      let testUser2 = new User("foo", "bar", "baz")
      testUser2.setProtocolRating("foo", new Rating([1,1,1,1,1], "bar"))
      await addUserToDatabase(testUser2)
      let response = await userController.getUserRating(
        testUser2.cookieId, testUser2.walletId, "foo"
      )
      expect(response.code).toBe("bar")
    })
    
  })


