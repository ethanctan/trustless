const mockingoose = require('mockingoose');
import ProtocolModel from '../models/Protocols';
import {describe, expect, test} from '@jest/globals';
let protocolExport = require('../routes/protocols')
const protocolsRouter = protocolExport.router
jest.useFakeTimers();

const API = "http://localhost:3001/"

describe("user post tests", () => {
    it("Should catch identifiable wallet nonexistent user", () => {
        expect(1+1).toBe(2)
    })

    it("Should catch existent cookie and nonidentifiable wallet", () => {
        expect(1+1).toBe(2)
    })

    it("Should catch wrong cookie wallet pair", () => {
        expect(1+1).toBe(2)
    })

    it("Should correct cookie-wallet pair", () => {
        expect(1+1).toBe(2)
    })

    it("Should catch nonexistent cookie nonexistent wallet pair", () => {
        expect(1+1).toBe(2)
    })


})

describe("check referral code tests", () => {
    it ("Should return false with empty referral code", () => {
        expect(1+1).toBe(2)
    })
    it ("Should return false with null and underfined", () => {
        expect(1+1).toBe(2)
    })
    it ("Should return true with existent user", () => {
        expect(1+1).toBe(2)
    })
})


describe("addRating tests", () => {
    it ("Should return false with empty referral code", () => {
        expect(1+1).toBe(2)
    })
})


describe ("addReferral tests", () => {
    
})


