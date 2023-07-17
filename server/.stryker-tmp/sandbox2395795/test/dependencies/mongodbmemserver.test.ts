/* eslint-disable @typescript-eslint/no-non-null-assertion */
// @ts-nocheck

import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import MyModel from './testModel';
// This is an Example test, do not merge it with others and do not delete this file

describe('Single MongoMemoryServer', () => {
  let con: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    con = await MongoClient.connect(mongoServer.getUri(), {});
    await mongoose.connect(mongoServer.getUri())
  });

  afterAll(async () => {
    if (con) {
      await con.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    await mongoose.disconnect()
  });

  it('should successfully set & get information from the database', async () => {
    const db = con.db(mongoServer.instanceInfo!.dbName);

    expect(db).toBeDefined();
    const col = db.collection('test');
    const result = await col.insertMany([{ a: 1 }, { b: 1 }]);
    expect(result.insertedCount).toStrictEqual(2);
    expect(await col.countDocuments({})).toBe(2);
  });

  const ASCENDING = 1
  const DESCENDING = -1

  it("Should successfully connect to mongoose and do mongoose things", async () => {
    expect(mongoose.connection.readyState).toBe(1)
    
    const test = new MyModel({name: "Hello"})
    await test.save()

    let num_docs = await MyModel.count()
    expect(num_docs).toBe(1)
    await MyModel.insertMany([{name: "Goodbye"}, {name: "World"}])
    let num_docs2 = await MyModel.count()
    expect(num_docs2).toBe(3)

    let responseList = await MyModel.find({})
    expect(responseList.length).toBe(3)
    let goodbyeResponse = await MyModel.find({name: "Goodbye"})
    expect(goodbyeResponse[0]["name"]).toBe("Goodbye")
    
    let ascendingSortList = await MyModel.find({}).sort({name : ASCENDING})
    expect(ascendingSortList[0]["name"]).toBe("Goodbye")
    let descendingSortList = await MyModel.find({}).sort({name : DESCENDING})
    expect(descendingSortList[0]["name"]).toBe("World")
  })


});