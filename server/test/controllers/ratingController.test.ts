/* eslint-disable @typescript-eslint/no-non-null-assertion */
import UserModel from '../../models/user/UserModel';
import RatingController from '../../controllers/ratingController';
import User, { Rating } from '../../models/user/User';
import  {setup, teardown, close} from '../setupMongoDb'
import { addUserToDatabase } from '../testUtils';

let ratingController = new RatingController();
let basicTestUser = new User("Sky", "does", "Minecraft");

async function initializeDatabase(){
  ratingController = new RatingController();
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

function createUid(cookieId: string, walletId: string){
    return {cookieId: cookieId, walletId: walletId}
  }



describe("Test upsert rating", () => {

    it("Should return should return failure message for nonexistent user", async () => {
      let uid = createUid("Hello", "world")
      let rating = new Rating([1,2,3,4,5], "protocol")
      let response = await ratingController.upsertRating(uid, rating, "uwu");
      expect(response).toBe("user not found")
    })
  
    it("should return rating added if user exists and new protocol is added", async () => {
      let rating = new Rating([1,2,3,4,5], "Your mom")
      let response = await ratingController.upsertRating(basicTestUser, rating, "MakerDao")
      expect(response).toBe("rating added")
    })
  
    it("should return rating added if user exists and new protocol is added", async () => {
      let rating = new Rating([1,2,3,4,5], "Your mom")
      await ratingController.upsertRating(basicTestUser, rating, "MakerDao")
      let userWithUpdatedRating = await UserModel.findOne({cookieId: "Sky"})
      //@ts-ignore
      expect(userWithUpdatedRating.protocolRatings.get("MakerDao").code).toBe("Your mom")
      //@ts-ignore
      expect(userWithUpdatedRating.protocolRatings.get("MakerDao").scores).toStrictEqual([1,2,3,4,5])
    })
  
  
    it("should return rating already submitted if user exists and \
      new protocol is updated", async () => {
      let rating = new Rating([1,2,3,4,5], "Does")
      await ratingController.upsertRating(basicTestUser, rating, "Sky")
      let updatedRating = new Rating([2,3,4,5,6], "Uwu")
      let response = await ratingController.upsertRating(basicTestUser, updatedRating, "Sky")
      expect(response).toBe("rating already submitted")
    })  
  
  })

  describe("Test getUserRating", () =>{
    it("Should return a null rating", async () =>{
      let response = await ratingController.getUserRating("", "", "")
      expect(response.isNull()).toBe(true)
    })

    it("Should return a rating", async () => {
      let testUser2 = new User("foo", "bar", "baz")
      testUser2.setProtocolRating("foo", new Rating([1,1,1,1,1], "bar"))
      await addUserToDatabase(testUser2)
      let response = await ratingController.getUserRating(
        testUser2.cookieId, testUser2.walletId, "foo"
      )
      expect(response.code).toBe("bar")
    })
    
  })