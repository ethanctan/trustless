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


describe("Get user info", () => {
    const baseUrl = '/getUserInfo/'
    it("Should return null user if user does not exist")
})
