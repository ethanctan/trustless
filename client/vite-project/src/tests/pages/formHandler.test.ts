import FormHandler from "../../pages/submitRatings/formHandler";
import { UserIdentity } from "../../interfaces/user";
import {Rating, ProtocolRatings, emptyRating } from "../../interfaces/rating"
import * as referralApi from '../../api/referralApi.ts';
import * as ratingApi from "../../api/ratingApi";
import * as utils from "../../utils/utils";

const formHandler = new FormHandler()

let testRating : Rating = {protocol: "testProtocol", scores : [1,2,3,4,5], code : "testCode"}
let testUser : UserIdentity = {cookieId: "testUserCookie", walletId: "testUserWallet"}
let testProtocolRating : ProtocolRatings = {hello : testRating}

afterEach(() => {
    testRating = {protocol: "testProtocol", scores : [1,2,3,4,5], code : "testCode"}
    testUser  = {cookieId: "testUserCookie", walletId: "testUserWallet"}
    testProtocolRating = {hello : testRating}
})

describe("test add user rating", () => {
    it("Should successfully add a rating", async () => {
        let response = await formHandler.addUserRating(testUser, testRating)
        const spy = jest.spyOn(utils, 'addRating');
        expect(response).toBe("Successfully added!")
        spy.mockRestore();
    })
    it("Should return an error message", async () => {
        const spy = jest.spyOn(utils, 'addRating');
        spy.mockRejectedValue(new Error("Internal server error"))

        let response = await formHandler.addUserRating(testUser, testRating)
        expect(response).toBe("Oops! Something went wrong")
        spy.mockRestore();
    })
    it("Should return an error message", async () => {
        const spy = jest.spyOn(utils, 'addRating');
        spy.mockRejectedValue({response: {status : 400}})
        let response = await formHandler.addUserRating(testUser, testRating)
        expect(response).toBe("You have already rated this protocol.")
        spy.mockRestore();
    })
})

function checkStatusAndValue(
    response : any, expected : unknown, key : string, status: string){
    expect(response["status"]).toBe(status)
    if (response["status"] == status && status == "success")
        expect(response.data[key]).toBe(expected)
    else{
        expect(response["error"]).toBe(expected)
    }
}

describe("Test get ratings", () => {
    const spy = jest.spyOn(ratingApi, 'getProtocolRatings');
    it("Should give a good response", async () => {
        let promise = new Promise<ProtocolRatings>((resolve, reject) => {testRating ? 
            resolve(testProtocolRating): reject(new Error("Not found"))})
        spy.mockReturnValue(promise)
        let response = await formHandler.getAllOfUsersRatings(testUser)
        console.log("response", response)
        checkStatusAndValue(response, testProtocolRating, "protocolRatings", "success")
    })
    it("Should return empty rating for null values", async () => {
        let promise = new Promise<ProtocolRatings | null>(
            (resolve, reject) => {testRating ? 
            resolve(null): reject(new Error("Not found"))})
        spy.mockReturnValue(promise)
        let response = await formHandler.getAllOfUsersRatings(testUser)
        checkStatusAndValue(response, emptyRating, "protocolRatings","success")
    })
})

describe("test handle user submission", () => {
    const spy = jest.spyOn(referralApi, 'checkReferralCodeExists');
    it("Should return an influencer dne error", async () => {
        let response = await formHandler.handleUserSubmission(testUser, testRating)
        expect(response.status).toBe("error")
        if (response.status == "error")
            expect(response.error).toBe("Influencer does not exist. Try again or leave blank!")
    })
    it("Should not find a wallet id", async () => {
        let exists = true
        let promise = new Promise<boolean>(
            (resolve, reject) => exists ? resolve(exists) : reject(new Error("Internal server")))
        spy.mockReturnValue(promise)
        testUser.walletId = ""
        let response = await formHandler.handleUserSubmission(testUser, testRating)
        expect(response.status).toBe("error")
        if (response.status == "error")
            expect(response.error).toBe("Wallet not connected. Try again!")
    })
    it("Should give a successful addition", async () => {
        let exists = true
        let promise = new Promise<boolean>(
            (resolve, reject) => exists ? resolve(exists) : reject(new Error("Internal server")))
        spy.mockReturnValue(promise)
        let response = await formHandler.handleUserSubmission(testUser, testRating)
        expect(response.status).toBe("success")
    })
})


describe("Test handleProtocol", () => {
    const spy = jest.spyOn(referralApi, 'checkReferralCodeExists');
    it("Should handle nonexistent influencer code", async () => {
        let exists = false
        let promise = new Promise<boolean>(
            (resolve, reject) => !exists ? resolve(exists) : reject(new Error("Internal server")))
        spy.mockReturnValue(promise)
        let response = await formHandler.updateProtocol(testRating, testUser)
        expect(response.status).toBe("error")
    })
    it("Should not find a wallet id", async () => {
        let exists = true
        let promise = new Promise<boolean>(
            (resolve, reject) => exists ? resolve(exists) : reject(new Error("Internal server")))
        spy.mockReturnValue(promise)
        testUser.walletId = ""
        let response = await formHandler.handleUserSubmission(testUser, testRating)
        expect(response.status).toBe("error")
        if (response.status == "error")
            expect(response.error).toBe("Wallet not connected. Try again!")
    })
})

