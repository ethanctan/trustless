/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import MyModel from '../dependencies/testModel';
import ProtocolModel from '../../models/Protocols';
import ProtocolController from '../../controllers/protocolController';
// This is an Example test, do not merge it with others and do not delete this file

describe('Single MongoMemoryServer', () => {
  let con: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    con = await MongoClient.connect(mongoServer.getUri(), {});
    await mongoose.connect(mongoServer.getUri())
  });

  afterEach(async () => {
    if (mongoServer) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
          await collection.deleteMany({})
        }
      }
  })

  afterAll(async () => {
    if (con) {
      await con.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    await mongoose.disconnect()
  });

  let jsonList = [
    {
        protocolName: "b",
        disputeCount: 14,
        averageScore: 4,
        qScores: [4, 4, 4, 4, 4]
    },
    {
        protocolName: "a",
        disputeCount: 10,
        averageScore: 3,
        qScores: [3, 3, 3, 3, 3]
    },
      {
        protocolName: "c",
        disputeCount: 18,
        averageScore: 8,
        qScores: [8, 8, 8, 8, 8]
    }]

    
    it("Should give json data in ascending", async () => {
        await ProtocolModel.insertMany(jsonList)
        
        let protocolController = new ProtocolController(ProtocolModel)
        let jsonData = await protocolController.getProtocolJson({query : 
            {order : "ascending"}})
        expect(jsonData[0]["protocolName"]).toBe("a")
    })

    it("Should give json data in descending", async () => {
        await ProtocolModel.insertMany(jsonList)

        let protocolController = new ProtocolController(ProtocolModel)
        let jsonData = await protocolController.getProtocolJson({query : 
            {order : "descending"}})
        expect(jsonData[0]["protocolName"]).toBe("c")
    })

    it("Should give json data in descending without args", async () => {
        await ProtocolModel.insertMany(jsonList)
    
        let protocolController = new ProtocolController(ProtocolModel)
        let jsonData = await protocolController.getProtocolJson({query : 
            {order : "uwu"}})
        expect(jsonData[0]["protocolName"]).toBe("c")
    })


});

    