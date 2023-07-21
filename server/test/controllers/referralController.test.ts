import UserModel from '../../models/user/UserModel';
import User, { Rating } from '../../models/user/User';
import  {setup, teardown, close} from '../setupMongoDb'
import { addUserToDatabase } from '../testUtils';
import ReferralController from '../../controllers/referralController';

let referralController = new ReferralController();
let basicTestUser = new User("Sky", "does", "Minecraft");

async function initializeDatabase(){
  referralController = new ReferralController();
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

describe("Test checkReferralCodeExists ",  () => {
    it("Should return true after adding referral code", async () => {
      let response = await referralController.checkReferralCodeExists("Minecraft");
      expect(response).toBe(true)
    })
  
    it("Should return false due to nonexistent referral code", async () => {
      let response = await referralController.checkReferralCodeExists("null");
      expect(response).toBe(false)
    })
  })


  describe("Test add referral", () => {
    it("Should return an error", async () => {
      let response = await referralController.addReferral(basicTestUser, "")
      expect(response).toBe("user not found")
    })
  
    it("should return an error due to user adding themself", async () => {
      let response = await referralController.addReferral(basicTestUser, basicTestUser.referralCode)
      expect(response).toBe("user submitted own referral code")
    })
  
    it("Should return success message when user adds message", async () => {
      let referee = new User("foo", "bar", "baz")
      await addUserToDatabase(referee)
      let response = await referralController.addReferral(referee, basicTestUser.referralCode)
      expect(response).toBe("successfully added/updated referral code")
    })
  
    it("Should increase number of referred users ", async () => {
      let referee = new User("foo", "bar", "baz")
      await addUserToDatabase(referee)
      await referralController.addReferral(referee, basicTestUser.referralCode)
      let resp = await UserModel.findOne({cookieId : "Sky"})
      //@ts-ignore
      expect(resp?.referredUsers).toBe(1)
    })
  
    it("Should increase number of referred users ", async () => {
      let referee = new User("foo", "bar", "baz")
      await addUserToDatabase(referee)
      await referralController.addReferral(referee, basicTestUser.referralCode)
      let referee2 = new User("foo", "bar", "baz")
      await addUserToDatabase(referee2)
      await referralController.addReferral(referee2, basicTestUser.referralCode)
      let resp = await UserModel.findOne({cookieId : "Sky"})
      //@ts-ignore
      expect(resp?.referredUsers).toBe(2)
    })
  
  })

