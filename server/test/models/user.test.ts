import User, { NullUser } from "../../models/user/User";
import { createUserObject, createRating, testUserObject } from "../testUtils"
var _ = require('lodash');


let basicTestUser = testUserObject
let protocolRating : object;
let testUser : User;

beforeAll(() => {
    basicTestUser = testUserObject
    protocolRating =  createRating("c", [1,2,3,4,5]);
    testUser = new User("uwu", "owo", "awa")
})


afterEach(() => {
    basicTestUser = testUserObject
    protocolRating =  createRating("c", [1,2,3,4,5]);
    testUser = new User("uwu", "owo", "awa")
})



describe("Test isNull", () => {
    it("Should return isNull for objects", () =>{
        expect(testUser.isNull()).toBe(false)
    })
    it("Should return isNull for objects", () =>{
        let nullUser = new NullUser
        expect(nullUser.isNull()).toBe(true)
    })
})

describe("Test constructor", () => {
    it("Should correctly instantiate user", () => {
        expect(testUser.cookieId).toBe("uwu")
    })
    it("Should create user without referral and returns empty string", () => {
        let testUserWithoutReferral = new User("uwu", "owo")
        expect(testUserWithoutReferral.referralCode).toBe("")
    })
    it("Should create user without referredUsers and returns empty map", () => {
        let testUserWithoutReferral = testUser
        expect(testUserWithoutReferral.getNumReferrredUsers()).toBe(0)
    })
    it("Should create user without protocolRatings and returns empty map", () => {
        let testUserWithoutProtocolRatings = testUser
        expect(
            testUserWithoutProtocolRatings.getProtocolRating().size).toBe(0)
    })

    it("Should create users with referredUsers and the referredUsers should exist ", () =>{
        let usersWithReferrals = new User("uwu", "owo", "awa", 1)
        expect(usersWithReferrals.getNumReferrredUsers()).toBe(1)
    })

    it("Should add 1 more user", () => {
        testUser.addReferredUser();
        expect(testUser.getNumReferrredUsers()).toEqual(1)
    })

    it("Should add 2 more users", () => {
        testUser.addReferredUser();
        testUser.addReferredUser();
        expect(testUser.getNumReferrredUsers()).toEqual(2)
    })

    it("Should add n more users", () => {
        for (let i = 0; i < 5; i++){
            testUser.addReferredUser();
        }
        expect(testUser.getNumReferrredUsers()).toEqual(5)
    })
})

describe("Test createUserFromObject", () => {
    it("Should create a basic object from scratch", () => {
        let testUserFromObject = User.createUserFromObject(basicTestUser)
        expect(testUserFromObject.walletId).toBe(testUser.walletId)
        expect(testUserFromObject.cookieId).toBe(testUser.cookieId)
        expect(testUserFromObject.referralCode).toBe(testUser.referralCode)
    })
})



describe("Test basic set methods", () => {
    it("Should update protocol ratings via setProtocolRating", () => {
        testUser.setProtocolRatingString("Hello", [0,0,0,0,0], "World");
        let res = testUser.getProtocolRating().get("Hello")
        if (res != null)
            expect(res.code).toBe("World")
    })
    
})


describe("Test user get methods", () => {

    it("Should correctly get protocol ratings", () => {
        let rating = {
            "Your sister" : {code : "Your mom", scores : [1,2,3,4,5]},
            "Your dad" : {code : "", scores : [2,3,4,5,6]}
        }
        let user = new User("hello", "world", "")
        user.setProtocolRatingString("Your sister", [1,2,3,4,5], "Your mom")
        user.setProtocolRatingString("Your dad", [2,3,4,5,6], "")
        expect(user.getProtocolRatingObject()).toEqual(rating)
    })

    it("Should get a basic user object", () => {
        let user = new User("a", "b")
        let otherUser = createUserObject("a", "b", "")
        expect(user.getUserObject()).toEqual(otherUser)
    })

})

describe("Test user existence methods", () => {
    it("should correctly check a protocol exists", () => {
        let user = new User("hello", "world", "", )
        user.setProtocolRatingString("a", [1,2,3,4,5], "c")
        expect(user.protocolExistsInRating("a")).toBe(true)
    })

    it("should correctly check a protocol exists", () => {
        let user = new User("hello", "world")
        user.setProtocolRatingString("a", [1,2,3,4,5], "c")
        expect(user.protocolExistsInRating("a")).toBe(true)
    })
})

describe("Test creating object from json", () => {
    it("Should create a basic object", () => {
        let generatedUser = User.createUserFromObject(basicTestUser);
        expect(basicTestUser).toEqual(generatedUser.getUserObject())
    })

    
})