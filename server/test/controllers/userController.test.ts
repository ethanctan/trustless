/* eslint-disable @typescript-eslint/no-non-null-assertion */
import UserModel from '../../models/user/UserModel';
import UserController from '../../controllers/userController';
import User from '../../models/user/User';
import  {setup, teardown, close} from '../setupMongoDb'
import { addUserToDatabase } from '../testUtils';

let userController = new UserController();
let basicTestUser = new User("Sky", "does", "Minecraft");

async function initializeDatabase(){
  userController = new UserController();
  basicTestUser = new User("Sky", "does", "Minecraft");
  await addUserToDatabase(basicTestUser)
}


 beforeAll(async () => {
  await setup()
  await initializeDatabase()
});

afterEach(async () => {
  await teardown()
  await initializeDatabase()
})

afterAll(async () => {
  await close()
});

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

  it("Should handle Correct cookie wallet pair", async () => {
    await testHandlePostRequest("Sky", "does", "minecraft", "correct user-wallet pair")
  })

  it("Should add user to database", async () => {
    let response = await userController.handlePostRequest(new User("foo", "bar"))
    expect(response).toBe("added user to database")
  })

  it("Should add user to database and user should exist", async () => {
    await userController.handlePostRequest(new User("", "bar"))
    let user = await UserModel.findOne({"walletId" : "bar"})
    expect(user?.walletId).toBe("bar")
  })

  it("Should handle correct user cookie pair after reassignment", async () => {
    await userController.handlePostRequest(new User("Your mom", "does"))
    let response = await userController.handlePostRequest(new User("Your mom", "does"))
    expect(response).toBe("correct user-wallet pair")
  })

});


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

