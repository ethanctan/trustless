const request = require("supertest")
const mockingoose = require('mockingoose');
import {describe, expect, test} from '@jest/globals';
jest.useFakeTimers();

const API = "http://localhost:3001/"

describe("defiData tests", () => {
    it("Should do something", async () => {
        expect(1+1).toBe(2)
    })


})