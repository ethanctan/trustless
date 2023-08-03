const request = require("supertest");
const express = require("express");
const mockingoose = require('mockingoose');
import EpochCountModel from '../../models/EpochCount';
import {describe, expect, test} from '@jest/globals';
let epochCountRouter = require('../../routes/epochCount')
jest.useFakeTimers();

const API = "http://localhost:3001/"

const app = express();
app.use('/', epochCountRouter);

beforeEach(() => {
    // Mock the DefiDataModel.find() function
    mockingoose(EpochCountModel).toReturn([
        { 
            epochCount: "0", //a number by model definition
            _id: "60d2c26e292a821e8ed2b4ab", // Mock ObjectID from MongoDB
        }
    ], 'find');
});


describe("epochCount tests", () => {
    it("Should do something", async () => {
        expect(1+1).toBe(2)
    })

    it("should output", async function() {
        let response = await request(app)
            .get('/')
        expect(response.headers['content-type']).toMatch(/application\/json/);

    },10000)

    it("should output correctly", async function() {
        let response = await request(app)
            .get('/')
        expect(response.body[0].epochCount).toBe(0);
    }, 10000)
})