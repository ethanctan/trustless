/* eslint-disable @typescript-eslint/no-non-null-assertion */
import User, { Rating } from '../../models/user/User';
const request = require('supertest');
import { testUserObject } from '../testUtils';
let referralRouter = require('../../routes/referrals');
import setupSupertest from './setupSupertest';
import  {setup, teardown, close} from '../setupMongoDb'
import { addUserToDatabase } from '../testUtils';

const app = setupSupertest(referralRouter)

let basicTestUserObject = testUserObject

let basicTestUser = User.createUserFromObject(basicTestUserObject)

let basicProtocolRating = {protocolName : "ant", rating : 
                {scores : [1,2,3,4,5], referral : "venom"}}

beforeAll(async () => {
    await setup()
    await addUserToDatabase(basicTestUser)
});

afterEach(async () => {
    await teardown()
    await addUserToDatabase(basicTestUser)
})

afterAll(async () => {
    await close()
});




describe("Test add referral code", () => {
    it("Should return unfound referee for no matching referee", async () => {
        let url = "/hello"
        let response = await request(app).post(url).send({walletId : "world"})
        expect(response.body.message).toBe("referee not found")
    })
    it("Should return unfound referrer for no matching referral code", async () => {
        let url = "/hello"
        let response = await request(app).post(url).send({walletId : "owo"})
        expect(response.body.message).toBe("referrer not found")
    })
    it("Should catch case where user submits own referral code", async () => {
        let url = "/awa"
        let response = await request(app).post(url).send({walletId : "owo"})
        expect(response.body.message).toBe("user submitted own referral code")
    })
    it("Should update referral code", async () => {
        addUserToDatabase(new User("sky", "does", "minecraft"))
        let url = "/awa"
        let response = await request(app).post(url).send({walletId : "does"})
        expect(response.body.message).toBe("successfully added/updated referral code")
    })
})


describe("Test get referral code", () => {
    it("Should return true for existent referral codes", async () => {
        let url = "/awa"
        let response = await request(app).get(url)
        expect(response.body.referralCodeExists).toBe(true)
    })
    it("Should return false for non-existent referral codes", async () => {
        let url = "/Minecraft"
        let response = await request(app).get(url)
        expect(response.body.referralCodeExists).toBe(false)
    })
})