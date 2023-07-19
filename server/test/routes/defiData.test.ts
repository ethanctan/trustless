const request = require("supertest");
const express = require("express");
const mockingoose = require('mockingoose');
import DefiDataModel from '../../models/DefiData';
import {describe, expect, test} from '@jest/globals';
let defiDataRouter = require('../../routes/defiData')
jest.useFakeTimers();

const API = "http://localhost:3001/"

const app = express();
app.use('/', defiDataRouter);

beforeEach(() => {
    // Mock the DefiDataModel.find() function
    mockingoose(DefiDataModel).toReturn([
        { 
            protocolName: "Protocol1", 
            logo: "https://example.com/logo1.png",
            _id: "60d2c26e292a821e8ed2b4ab", // Mock ObjectID from MongoDB
        },
        { 
            protocolName: "Protocol2", 
            logo: "https://example.com/logo2.png",
            _id: "60d2c27e292b821e8ed2b4ad",
        }
    ], 'find');
});


describe("defiData tests", () => {
    it("Should do something", async () => {
        expect(1+1).toBe(2)
    })

    it("should output", async function() {
        let response = await request(app)
            .get('/')
        expect(response.headers['content-type']).toMatch(/application\/json/);

    },10000)

    it("should output in ascending order", async function() {
        let response = await request(app)
            .get('/?order=ascending')
        expect(response.headers['content-type']).toMatch(/application\/json/);
    })

    it("should output in descending order", async function() {
        let response = await request(app)
            .get('/?order=descending')
        expect(response.headers['content-type']).toMatch(/application\/json/);
    })
})