import User from "../../models/user/User";
var _ = require('lodash');

function createUser(cookieId: string, walletId: string, referralCode: string,
    referrals ?: ([string, string])[]){
    let user = {
        cookieId: cookieId, walletId: walletId, referralCode: referralCode,
        referredUsers: new Map(referrals), protocolRatings : new Map()
    }
    return user
  }

function createUserObject(cookieId: string, walletId: string, referralCode: string,
    referrals ?: ([string, string])[]){
    let refs = new Map(referrals)
    let referralObject =  Object.fromEntries(refs)
    let user = {
        cookieId: cookieId, walletId: walletId, referralCode: referralCode,
        referredUsers: referralObject, protocolRatings : {}
    }
    
    return user
}

  function createRating(code : string, score : number[]){
    return  {code: code, scores: score} 
  }

  function createProtocolRating(protocol : string, score : number[], referral : string){
    return {protocol: protocol,
            rating: {
              score : score,
              referral : referral
            }
        }
    }

const basicTestUser = createUser("uwu", "owo", "awa")
const basicTestUserObject = createUserObject("uwu", "owo", "awa")

describe("Test user creations", () => {
    it("Should construct users correctly", () => {
        let secondUser = new User("uwu", "owo", "awa")
        expect(basicTestUser).toEqual(secondUser)
    })

    it("Should construct users with correct maps", () => {
        let user = createUser("uwu", "owo", "awa")
        user.referredUsers.set("Hello", "World")
        let secondUser = new User("uwu", "owo", "awa", new Map([["Hello", "World"]]))
        expect(user).toEqual(secondUser)
    })

    it("Should construct users with correct referred users", () => {
        let user = createUser("uwu", "owo", "awa")
        user.referredUsers.set("Hello", "World")
        let secondUser = new User("uwu", "owo", "awa", new Map([["Goodbyw", "World"]]))

        expect(user).not.toEqual(secondUser)
    })
    
    it("Should construct users with correct protocol ratings", () => {
        let user = createUser("uwu", "owo", "awa")
        user.referredUsers.set("Hello", "World")
        let protocolRating = createRating("c", [1,2,3,4,5])
        user.protocolRatings.set("a", protocolRating)

        let secondUser = new User("uwu", "owo", "awa", new Map([["Hello", "World"]]))
        secondUser.setProtocolRatingString("a", [1,2,3,4,5], "c")
        expect(user).toEqual(secondUser)
    })
})

describe("Test user get methods", () => {
    it("Should correctly get referred users", () => {
        let user = new User("uwu", "owo", "awa", new Map([
            ["hello", "world"], ["Goodbye", "Charlie"]
        ]))
        let referral = {"hello": "world", "Goodbye": "Charlie"}
        expect(user.getReferredUsersObject()).toEqual(referral)
    })

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
        let otherUser = {cookieId : "a", 
        walletId : "b", referralCode: "", protocolRatings : {}, referredUsers: {}}
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
        let generatedUser = User.getUserFromObject(basicTestUserObject);
        console.log("generated user",generatedUser)
        console.log("basic test user",basicTestUserObject)
        expect(basicTestUserObject).toEqual(generatedUser)
    })
    // it("Should create an object with map", () => {
    //     let generatedUser = createUserObject("uwu", "owo", "awa")
    //     generatedUser.referredUsers = {
    //         cookieId : "Hello"
    //     }
    // })
    // it("Should fail due to incorrect argument types", () => {

    // })
    
})