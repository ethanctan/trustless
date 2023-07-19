/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import ProtocolModel from '../../models/Protocols';
import ProtocolController from '../../controllers/protocolController';

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

  let unit = {
        protocolName: "c",
        disputeCount: 18,
        averageScore: 8,
        qScores: [8, 8, 8, 8, 8]
    }
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
      unit]

    
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

    it("Should return an empty array if empty", async () => {
        let protocolController = new ProtocolController(ProtocolModel)
        let response = await protocolController.getProtocolJson({query : 
            {order : "uwu"}}) 
        expect(response).toStrictEqual([])
    })

    it("Should successfully update db", async() => {
        let protocolController = new ProtocolController(ProtocolModel)
        let response = await protocolController.addProtocolJson(unit)
        expect(response).toStrictEqual({message : "Success in adding new protocol"})
        let numDocs = await ProtocolModel.count()
        expect(numDocs).toBe(1)
    })

    it("Should correctly calculate average in newQscores", () => {
        let protocolController = new ProtocolController(ProtocolModel);
    
        // Provide test data
        let docScores = [3, 3, 3, 3, 3];
        let protocolScores = [5, 5, 5, 5, 5];
        let numDisputes = 1;
    
        // Call updateAvg
        let [newQScores, newAvg] = protocolController.updateAvg(docScores, protocolScores, numDisputes);
    
        // Check the results
        expect(newQScores).toEqual([8, 8, 8, 8, 8]);
    });

    it("Should correctly calculate final average", () => {
        let protocolController = new ProtocolController(ProtocolModel);
    
        // Provide test data
        let docScores = [3, 3, 3, 3, 3];
        let protocolScores = [5, 5, 5, 5, 5];
        let numDisputes = 1;
    
        // Call updateAvg
        let [newQScores, newAvg] = protocolController.updateAvg(docScores, protocolScores, numDisputes);
    
        // Check the results
        expect(newAvg).toBeCloseTo(4);  // 40 / (2*5)
    });
    
    // Test to check disputeCount increment
    it('should increment disputeCount by 1', () => {
        const protocolController = new ProtocolController(ProtocolModel);
        const protocol = {protocolName: "c", qScores: [5,5,5,5,5]};
        const doc = {protocolName: "c", disputeCount: 10, qScores: [2,2,2,2,2]};
        const updatedDoc = protocolController.updateDoc(doc, protocol);
        expect(updatedDoc.disputeCount).toBe(11);
    });
  
    // Test to check protocolName is assigned correctly
    it('should throw error if protocol names don\'t match', () => {
        const protocolController = new ProtocolController(ProtocolModel);
        const protocol = {protocolName: "c", qScores: [5,5,5,5,5]};
        const doc = {protocolName: "b", disputeCount: 10, qScores: [2,2,2,2,2]};
        expect(() => protocolController.updateDoc(doc, protocol)).toThrowError("Protocol names don't match");
    });
  
    // Test to check averageScore is assigned correctly
    it('should assign correct averageScore', () => {
        const protocolController = new ProtocolController(ProtocolModel);
        const protocol = {protocolName: "c", qScores: [5,5,5,5,5]};
        const doc = {protocolName: "c", disputeCount: 10, qScores: [2,2,2,2,2]};
        const updatedDoc = protocolController.updateDoc(doc, protocol);
        const newAvg = 35/(11*5);
        expect(updatedDoc.averageScore).toBeCloseTo(newAvg);
    });
  
    // Test to check qScores are updated correctly
    it('should update qScores correctly', () => {
        const protocolController = new ProtocolController(ProtocolModel);
        const protocol = {protocolName: "c", qScores: [5,5,5,5,5]};
        const doc = {protocolName: "c", disputeCount: 10, qScores: [2,2,2,2,2]};
        const updatedDoc = protocolController.updateDoc(doc, protocol);
        expect(updatedDoc.qScores).toEqual([7,7,7,7,7]);
    });

    // Test to check output has protocolName, disputeCount, averageScore, and qScores
    it('should update qScores correctly', () => {
      const protocolController = new ProtocolController(ProtocolModel);
      const protocol = {protocolName: "c", qScores: [5,5,5,5,5]};
      const doc = {protocolName: "c", disputeCount: 10, qScores: [2,2,2,2,2]};
      const updatedDoc = protocolController.updateDoc(doc, protocol);
      expect(updatedDoc).toHaveProperty('protocolName');
      expect(updatedDoc).toHaveProperty('disputeCount');
      expect(updatedDoc).toHaveProperty('averageScore');
      expect(updatedDoc).toHaveProperty('qScores');
  });


});

    