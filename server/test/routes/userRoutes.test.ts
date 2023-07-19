const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const mockingoose = require('mockingoose');
import UserModel from '../../models/user/UserModel';
import {describe, expect, test} from '@jest/globals';
import { testUserObject, createUserObject, isEqualWithDocAndObject } from '../testUtils';
let userRouter = require('../../routes/user');
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
jest.useFakeTimers();

const app = express();
app.use(bodyParser.json()); // This line adds body parser middleware
app.use('/', userRouter);
let basicTestUser = testUserObject
const timeoutLimit = 10000
jest.setTimeout(timeoutLimit)


beforeEach(() => {
    mockingoose.resetAll();
    basicTestUser = testUserObject
});


describe("Get user tests", ()=> {
    it("Should get all users", async () => {
        mockingoose(UserModel).toReturn(basicTestUser, 'find')
        let response = await request(app).get('/')
        expect(isEqualWithDocAndObject(response.body, basicTestUser)).toBe(true)
    })
})


xdescribe("Add user tests", () => {
    it("Should add user to database", async () => {
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

describe("Test get rating", () => {
    const baseUrl = "/getRating/"
    it("Should return User not found if user cannot be found", async () => {
        let url = baseUrl + "one/two/three"
        mockingoose(UserModel).toReturn(null, 'findOne')
        let response = await request(app).get(url)
        expect(response.body.message).toBe("User not found")
    })
    it("Should return rating not found if rating cannot be found", async () => {
        let url = baseUrl + "uwu/owo/three"
        mockingoose(UserModel).toReturn(basicTestUser, 'findOne')
        let response = await request(app).get(url)
        expect(response.body.message).toBe("Rating not found")
    })
    // it("Should return rating if it exists", async () => {
    //     let url = baseUrl +  "uwu/owo/Hello"
    //     mockingoose(UserModel).toReturn(basicTestUser, 'findOne')
    //     let response = await request(app).get(url)
    //     expect(response.body.message).toBe("World")
    // })
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

describe("Check ratings exist",  () => {
    const baseUrl = "/ratings/"
    it("Should return user not found if user does not exist", async () => {
        let url = baseUrl + "hello/world"
        mockingoose(UserModel).toReturn(null, 'findOne')
        let response = await request(app).get(url)
        expect(response.body.message).toBe("User not found")
    })
    // Cannot test protocol ratings
    // it("Should return user not found if user does not exist", async () => {
    //     let url = baseUrl + basicTestUser["cookieId"] + "/" + 
    //             basicTestUser["walletId"]

    //     mockingoose(UserModel).toReturn(basicTestUser, 'findOne')
    //     let response = await request(app).get(url)
    //     expect(response.body).toBe("User not found")
    // })
})