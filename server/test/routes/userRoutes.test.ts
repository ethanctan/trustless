const request = require('supertest');
const mockingoose = require('mockingoose');
import UserModel from '../../models/user/UserModel';
import {describe, expect, test} from '@jest/globals';
import { testUserObject, createUserObject, isEqualWithDocAndObject } from '../testUtils';
let userRouter = require('../../routes/user');
jest.useFakeTimers();
import setupSupertest from './setupSupertest';


const app = setupSupertest(userRouter)

let basicTestUser = testUserObject

beforeEach(() => {
    mockingoose.resetAll();
    basicTestUser = testUserObject
});

let basicProtocolRating = {protocol : "ant", rating : 
                {scores : [1,2,3,4,5], referral : "venom"}}

describe("Get user tests", ()=> {
    it("Should get all users", async () => {
        mockingoose(UserModel).toReturn(basicTestUser, 'find')
        let response = await request(app).get('/')
        expect(isEqualWithDocAndObject(response.body, basicTestUser)).toBe(true)
    })
})


describe("Add user tests", () => {
    it("Should add user to database", async () => {
        mockingoose(UserModel).toReturn(null, 'findOne')
        let response = await request(app).post('/').send(basicTestUser)
        expect(response.body.message).toBe("added user to database")
    })
})

// Timing out on null referral codes(empty get string)
describe("Test get referral code", () => {
    const baseUrl = '/checkReferralCode/'
    it("Should return true for existent referral codes", async () => {
        let url = baseUrl+"Minecraft"
        mockingoose(UserModel).toReturn(basicTestUser, 'findOne')
        let response = await request(app).get(url)
        expect(response.body.referralCodeExists).toBe(true)
    })
    it("Should return false for non-existent referral codes", async () => {
        let url = baseUrl+"Minecraft"
        mockingoose(UserModel).toReturn(null, 'findOne')
        let response = await request(app).get(url)
        expect(response.body.referralCodeExists).toBe(false)
    })
})


describe("Test get user info", () => {
    const baseUrl = '/getUserInfo/'
    it("Should return null user if user does not exist", async () => {
        let url = baseUrl + "hello"
        let response = await request(app).get(url)
        expect(response.body.message).toBe("User not found")
    })
    it("Should return an existing user if the user exists", async () => {
        let url = baseUrl + "uwu"
        mockingoose(UserModel).toReturn(basicTestUser, 'findOne')
        let response = await request(app).get(url)
        expect(response.body.walletId).toEqual(basicTestUser["walletId"])
    })
})



describe("Check cookie id exists", () => {
    const baseUrl = "/check/"
    it("Should return false if user does not exist", async () => {
        let url = baseUrl + "hello"
        mockingoose(UserModel).toReturn(null, 'findOne')
        let response = await request(app).get(url)
        expect(response.body).toBe(false)
    })
    it("Should return true if user does not exist", async () => {
        let url = baseUrl + basicTestUser["cookieId"]
        mockingoose(UserModel).toReturn(basicTestUser, 'findOne')
        let response = await request(app).get(url)
        expect(response.body).toBe(true)
    })
})

