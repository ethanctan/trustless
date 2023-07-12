const request = require("supertest")
const mockingoose = require('mockingoose');
import DefiDataModel from '../models/DefiData';
import {describe, expect, test} from '@jest/globals';
let defiDataRouter = require('../routes/defiData')
jest.useFakeTimers();

const API = "http://localhost:3001/"

describe("defiData tests", () => {
    it("Should do something", async () => {
        expect(1+1).toBe(2)
    })

    // it("should output in descending order", async function() {
    //     let response = await request(defiDataRouter)
    //         .get('/')
    //     expect(response.headers['Content-Type'].toMatch('application/json'))
    // })

    // it("should output in ascending order", async function() {
    //     let response = await request(defiDataRouter)
    //         .get('/?order=ascending')
    //     expect(response.headers['Content-Type'].toMatch('application/json'))
    // })

    // it("should output in descending order", async function() {
    //     let response = await request(defiDataRouter)
    //         .get('/?order=descending')
    //     expect(response.headers['Content-Type'].toMatch('application/json'))
    // })
})