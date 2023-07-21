/* eslint-disable @typescript-eslint/no-non-null-assertion */
import User, { Rating } from '../../models/user/User';
const request = require('supertest');
import { testUserObject } from '../testUtils';
let ratingRouter = require('../../routes/ratings');
import setupSupertest from './setupSupertest';
import  {setup, teardown, close} from '../setupMongoDb'
import { addUserToDatabase } from '../testUtils';
import UserModel from '../../models/user/UserModel';

const app = setupSupertest(ratingRouter)

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


describe("Add rating tests", () => {
    it("Should say user not found", async () => {
        let url = "/hello/world"
        let response = await request(app).post(url).send(basicProtocolRating)
        expect(response.body.message).toBe("user not found")
    })

    it("Should say protocol added successfully", async () => {
        let url = "/uwu/owo"
        let response = await request(app).post(url).send(basicProtocolRating)
        expect(response.body.message).toBe("rating added")
    })
})


describe("Test get rating", () => {
    it("Should return User not found if user cannot be found", async () => {
        let url = "/one/two/three"
        let response = await request(app).get(url)
        expect(response.body.message).toBe("User not found")
    })
    it("Should return rating not found if rating cannot be found", async () => {
        let url = "/uwu/owo/three"
        let response = await request(app).get(url)
        expect(response.body.message).toBe("Rating not found")
    })
    it("Should return rating if it exists", async () => {
        let url = "/Sky/does/Hello"
        let rating = new Rating([1,2,3,4,5], "World")
        let newUser = new User("Sky", "does", "craft", 0, new Map([["Hello", rating]]))
        await addUserToDatabase(newUser)
        let response = await request(app).get(url)
        expect(response.body.code).toBe("World")
    })
})

describe("Check ratings exist",  () => {
    const baseUrl = "/ratings/"
    it("Should return user not found if user does not exist", async () => {
        let url = baseUrl + "hello/world"
        let response = await request(app).get(url)
        expect(response.body.message).toBe("User not found")
    })
    // Cannot test protocol ratings
    it("Should return user not found if user does not exist", async () => {
        let url = baseUrl + basicTestUser["cookieId"] + "/" + 
                basicTestUser["walletId"]
        let response = await request(app).get(url)
        expect(response.body.message).toBe("User not found")
    })
})


describe("Test getting all ratings", () => {
    it("Should get all ratings", async () => {
        let url = "/hello/world"
        let response = await request(app).get(url)
        expect(response.body.message).toBe("User not found")
    })
    it("Should get empty object", async () => {
        let url = "/uwu/owo"
        let response = await request(app).get(url)
        expect(response.body).toStrictEqual({})
    })
    it("Should get ratings", async () => {
        let rating = new Rating([1,2,3,4,5], "hello")
        let testUser2 = new User("hello", "world", "", 0, new Map([["minecraft", rating]]))
        await addUserToDatabase(testUser2)
        let url = "/hello/world"
        let response = await request(app).get(url)
        expect(response.body["minecraft"]["code"]).toBe("hello")
    })
})