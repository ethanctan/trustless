const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const mockingoose = require('mockingoose');
import ProtocolModel from '../../models/Protocols';
import {describe, expect, test} from '@jest/globals';
let protocolRouter = require('../../routes/protocols').router;
jest.useFakeTimers();

const app = express();
app.use(bodyParser.json()); // This line adds body parser middleware
app.use('/', protocolRouter);


beforeEach(() => {
    mockingoose.resetAll();
});



describe("addRating tests", () => {
    it("should output in correct format", async function() {
        const newProtocol = [
            {
                protocolName: 'Protocol1',
                disputeCount: 10,
                averageScore: 85,
                qScores: [80, 85, 90, 80, 85],
                _id: '60d2c26e292a821e8ed2b4ab',
            },
            {
                protocolName: 'Protocol2',
                disputeCount: 5,
                averageScore: 95,
                qScores: [90, 95, 100, 90, 95],
                _id: '60d2c27e292b821e8ed2b4ad',
            }
        ]

        mockingoose(ProtocolModel).toReturn( newProtocol, 'find');

        let response = await request(app)
            .get('/')
            // console.log('Status:', response.status);
            // console.log('Headers:', response.headers);
            // console.log('Body:', response.body);
        expect(response.headers['content-type']).toMatch(/application\/json/);

    },10000)

    it("should output in correct status", async function() {
        const newProtocol = [
            {
                protocolName: 'Protocol1',
                disputeCount: 10,
                averageScore: 85,
                qScores: [80, 85, 90, 80, 85],
                _id: '60d2c26e292a821e8ed2b4ab',
            },
            {
                protocolName: 'Protocol2',
                disputeCount: 5,
                averageScore: 95,
                qScores: [90, 95, 100, 90, 95],
                _id: '60d2c27e292b821e8ed2b4ad',
            }
        ]

        mockingoose(ProtocolModel).toReturn( newProtocol, 'find');
        let response = await request(app)
            .get('/')
            // console.log('Status:', response.status);
            // console.log('Headers:', response.headers);
            // console.log('Body:', response.body);
        expect(response.status).toBe(200);

    },10000)

    it("should output with correct data", async function() {
        const newProtocol = [
            {
                protocolName: 'Protocol1',
                disputeCount: 10,
                averageScore: 85,
                qScores: [80, 85, 90, 80, 85],
                _id: '60d2c26e292a821e8ed2b4ab',
            },
            {
                protocolName: 'Protocol2',
                disputeCount: 5,
                averageScore: 95,
                qScores: [90, 95, 100, 90, 95],
                _id: '60d2c27e292b821e8ed2b4ad',
            }
        ]

        mockingoose(ProtocolModel).toReturn( newProtocol, 'find');
        let response = await request(app)
            .get('/')
            // console.log('Status:', response.status);
            // console.log('Headers:', response.headers);
            // console.log('Body:', response.body);
            expect(response.body).toEqual([
                {
                    protocolName: 'Protocol1',
                    disputeCount: 10,
                    averageScore: 85,
                },
                {
                    protocolName: 'Protocol2',
                    disputeCount: 5,
                    averageScore: 95,
                }
            ]);

    },10000)

    it("should successfully add a new protocol by status", async function() {
        const newProtocol = {
            protocolName: 'Protocol3',
            disputeCount: 3,
            averageScore: 70,
            qScores: [70, 70, 70, 70, 70]
        };
    
        // Mock ProtocolModel.findOne() to simulate that the protocol doesn't exist yet
        mockingoose(ProtocolModel).toReturn(null, 'findOne');

        // Mock ProtocolModel.save() to simulate a successful add
        mockingoose(ProtocolModel).toReturn(newProtocol, 'save');
    
        // Make the request to the API
        let response = await request(app).post('/').send(newProtocol);

        // Check if the response has the correct status
        expect(response.status).toBe(201);
    
    }, 10000);

    it("should successfully add a new protocol by response", async function() {
        const newProtocol = {
            protocolName: 'Protocol3',
            disputeCount: 3,
            averageScore: 70,
            qScores: [70, 70, 70, 70, 70]
        };
    
        // Mock ProtocolModel.findOne() to simulate that the protocol doesn't exist yet
        mockingoose(ProtocolModel).toReturn(null, 'findOne');

        // Mock ProtocolModel.save() to simulate a successful add
        mockingoose(ProtocolModel).toReturn(newProtocol, 'save');
    
        // Make the request to the API
        let response = await request(app).post('/').send(newProtocol);

        // Check if the response body is correct
        expect(response.body).toEqual({
            message: 'Success'
        });
    
    }, 10000);
    
    it("should successfully update an existing protocol", async function() {
        const existingProtocol = {
            protocolName: 'Protocol1',
            disputeCount: 11,
            averageScore: 86,
            qScores: [85, 85, 85, 85, 85]
        };
    
        // Mock ProtocolModel.findOne() to simulate that the protocol exists
        mockingoose(ProtocolModel).toReturn(existingProtocol, 'findOne');
    
        // Mock ProtocolModel.save() to simulate a successful update
        mockingoose(ProtocolModel).toReturn(existingProtocol, 'save');
    
        // Make the request to the API
        let response = await request(app).post('/').send(existingProtocol);
    
        // Check if the response has the correct status
        expect(response.status).toBe(201);
    
    }, 10000);
    

    it("should handle missing protocolName", async function() {
        const invalidProtocol = {
            disputeCount: 11,
            averageScore: 86,
            qScores: [85, 85, 85, 85, 85]
        }; // Missing 'protocolName'

        // Make the request to the API
        let response = await request(app).post('/').send(invalidProtocol);

        // Check if the response has the error status
        expect(response.status).toBe(500);

    }, 10000);

    it("should handle missing protocolName with proper message body", async function() {
        const invalidProtocol = {
            disputeCount: 11,
            averageScore: 86,
            qScores: [85, 85, 85, 85, 85]
        }; // Missing 'protocolName'

        // Make the request to the API
        let response = await request(app).post('/').send(invalidProtocol);

        // Check if the response body contains an error message
        expect(response.body).toHaveProperty('message');
    }, 10000);

    it("should handle missing disputeCount", async function() {
        const invalidProtocol = {
            protocolName: 'Protocol1',
            averageScore: 86,
            qScores: [85, 85, 85, 85, 85]
        }; // Missing 'protocolName'

        // Make the request to the API
        let response = await request(app).post('/').send(invalidProtocol);

        // Check if the response has the error status
        expect(response.status).toBe(500);

    }, 10000);

    it("should handle missing disputeCount with proper message body", async function() {
        const invalidProtocol = {
            protocolName: 'Protocol1',
            averageScore: 86,
            qScores: [85, 85, 85, 85, 85]
        }; // Missing 'protocolName'

        // Make the request to the API
        let response = await request(app).post('/').send(invalidProtocol);

        // Check if the response body contains an error message
        expect(response.body).toHaveProperty('message');
    }, 10000);

    it("should handle missing averageScore", async function() {
        const invalidProtocol = {
            protocolName: 'Protocol1',
            disputeCount: 11,
            qScores: [85, 85, 85, 85, 85]
        }; // Missing 'protocolName'

        // Make the request to the API
        let response = await request(app).post('/').send(invalidProtocol);

        // Check if the response has the error status
        expect(response.status).toBe(500);

    }, 10000);

    it("should handle missing averageScore with proper message body", async function() {
        const invalidProtocol = {
            protocolName: 'Protocol1',
            disputeCount: 11,
            qScores: [85, 85, 85, 85, 85]
        }; // Missing 'protocolName'

        // Make the request to the API
        let response = await request(app).post('/').send(invalidProtocol);

        // Check if the response body contains an error message
        expect(response.body).toHaveProperty('message');
    }, 10000);

    // NOT SURE NEEDED SINCE QSCORES ARE INITIALIZED TO 1
    // it("should handle missing qScores", async function() {
    //     console.log('start of test missing qScores')
    //     const invalidProtocol = {
    //         protocolName: 'Protocol1',
    //         disputeCount: 11,
    //         averageScore: 86
    //     }; // Missing 'protocolName'

    //     // Make the request to the API
    //     let response = await request(app).post('/').send(invalidProtocol);

    //     // Check if the response has the error status
    //     expect(response.status).toBe(500);

    // }, 10000);

    // it("should handle missing qScores with proper message body", async function() {
    //     const invalidProtocol = {
    //         protocolName: 'Protocol1',
    //         disputeCount: 11,
    //         averageScore: 86
    //     }; // Missing 'protocolName'

    //     // Make the request to the API
    //     let response = await request(app).post('/').send(invalidProtocol);

    //     // Check if the response body contains an error message
    //     expect(response.body).toHaveProperty('message');
    // }, 10000);
     
})
