// const request = require("supertest")
const protocolExports = require("../routes/protocols")
const { updateAvg, updateDoc} = protocolExports.testFxns


import {describe, expect, test} from '@jest/globals';

// const protocolsRoute = require('./routes/protocols')

function addRandomScore(cumScore : number[]){
    let randVec = [0,0,0,0,0]
    for (let i = 0; i < cumScore.length; i++){
        let val = Math.floor(Math.random()*11)
        randVec[i] += val;
        cumScore[i] += val
    }
    return [cumScore, randVec]
} 

function getAvg(times : number[], num : number){
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = (sum / (times.length * (num))) || 0;
    return avg
}


describe('updating averages', () =>{
    test("Basic update", ()=>{
        let val = updateAvg([0,0,0,0,0], [1,1,1,1,1], 1)
        expect(val).toStrictEqual([[1,1,1,1,1], 0.5])
    })
    test("Adding 0s", ()=>{
        let val = updateAvg([0,0,0,0,0], [0,0,0,0,0], 100)
        expect(val).toStrictEqual([[0,0,0,0,0], 0])
    })
    test("Adding 5s", ()=>{
        let val = updateAvg([55,55,55,55,55], [5,5,5,5,5], 11)
        expect(val).toStrictEqual([[60,60,60,60,60], 5])
    })
    test("All 0s", ()=>{
        let val = updateAvg([0,0,0,0,0], [0,0,0,0,0], 0)
        expect(val).toStrictEqual([[0,0,0,0,0], 0])
    })
    test("Initialization", ()=>{
        let val = updateAvg([0,0,0,0,0], [1,1,1,1,1], 0)
        expect(val).toStrictEqual([[1,1,1,1,1], 1])
    })
    test ("Random testing", ()=>{
        let average = 0;
        let cumScore = [0,0,0,0,0]
        let randVec = [0,0,0,0,0]
        let test_val = [0,0,0,0,0]
        for (let i=0; i < 10000; i++){
            [cumScore, randVec] = addRandomScore(cumScore);
            average = getAvg(cumScore, i+1)
            let values =  updateAvg(test_val, randVec, i)
            test_val = values[0]
            expect(values[0]).toStrictEqual(cumScore)
            expect(values[1]).toBe(average)
        }

    })
})


describe("Testing updateDoc", () => {
    test("Empty person", ()=>{
        let doc = {
            "qScores": [0,0,0,0,0], 
            "disputeCount": 0,
            "protocolName": "aegis",
            "averageScore": 0
        }
        let protocol = {
            "qScores": [1,1,1,1,1],
            "protocolName": "aegis"
        }
        doc = updateDoc(doc, protocol)
        expect(doc["qScores"]).toStrictEqual([1,1,1,1,1])
        expect(doc["averageScore"]).toBe(1)
    })
    test("Empty person", ()=>{
        let doc = {
            "qScores": [55,55,55,55,55], 
            "disputeCount": 11,
            "protocolName": "aegis",
            "averageScore": 5
        }
        let protocol = {
            "qScores": [5,5,5,5,5],
            "protocolName": "aegis"
        }
        doc = updateDoc(doc, protocol)
        expect(doc["qScores"]).toStrictEqual([60,60,60,60,60])
        expect(doc["averageScore"]).toBe(5)
    })
})
